import { notion } from "@lib/notion";
import type {
    BlockObjectResponse,
    DatabaseObjectResponse,
    PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NextResponse } from "next/server";

export const revalidate = 1800;

const norm = (s: string) => s.replace(/[\s,./…]/g, "").toLowerCase();
const includesAny = (key: string, candidates: string[]) => {
    const k = norm(key);
    return candidates.some((c) => k.includes(norm(c)));
};

const fetchChildrenBlocks = async (blockId: string) => {
    const blocks: BlockObjectResponse[] = [];
    let cursor: string | undefined;

    do {
        const res = await notion.blocks.children.list({
            block_id: blockId,
            page_size: 100,
            start_cursor: cursor,
        });

        const pageBlocks = res.results.filter(
            (b): b is BlockObjectResponse => b.object === "block",
        );

        blocks.push(...pageBlocks);
        cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return blocks;
};

/**
 * ✅ 페이지 전체를 재귀로 훑어서 모든 블록을 수집
 * - child_database는 내부 자식 탐색 불필요 (DB는 query로 가져올 거라)
 */
const fetchAllBlocksDeep = async (rootId: string) => {
    const result: BlockObjectResponse[] = [];
    const queue: string[] = [rootId];

    while (queue.length) {
        const current = queue.shift()!;
        const children = await fetchChildrenBlocks(current);
        result.push(...children);

        for (const b of children) {
            if (b.has_children && b.type !== "child_database") {
                queue.push(b.id);
            }
        }
    }
    return result;
};

const queryAllDatabasePages = async (databaseId: string) => {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
        const res = await notion.databases.query({
            database_id: databaseId,
            page_size: 100,
            start_cursor: cursor,
        });

        pages.push(
            ...res.results.filter(
                (r): r is PageObjectResponse => r.object === "page",
            ),
        );
        cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return pages;
};

const getPropertyPlain = (property: any): string => {
    if (!property || !property.type) return "";
    switch (property.type) {
        case "title":
            return property.title.map((t: any) => t.plain_text).join("");
        case "rich_text":
            return property.rich_text.map((t: any) => t.plain_text).join("");
        case "select":
            return property.select?.name ?? "";
        case "multi_select":
            return property.multi_select.map((s: any) => s.name).join(", ");
        case "people":
            return property.people.map((p: any) => p.name).join(", ");
        case "date":
            if (!property.date) return "";
            return property.date.end
                ? `${property.date.start} – ${property.date.end}`
                : property.date.start;
        case "number":
            return property.number != null ? String(property.number) : "";
        case "checkbox":
            return property.checkbox ? "true" : "false";
        case "url":
            return property.url ?? "";
        case "email":
            return property.email ?? "";
        case "phone_number":
            return property.phone_number ?? "";
        case "status":
            return property.status?.name ?? "";
        case "relation":
            return property.relation.map((r: any) => r.id).join(", ");
        case "files":
            return property.files.map((f: any) => f.name).join(", ");
        case "formula": {
            const v = property.formula;
            if (!v) return "";
            if (v.type === "string") return v.string ?? "";
            if (v.type === "number") return v.number != null ? String(v.number) : "";
            if (v.type === "boolean") return v.boolean ? "true" : "false";
            if (v.type === "date") {
                if (!v.date) return "";
                return v.date.end ? `${v.date.start} – ${v.date.end}` : v.date.start;
            }
            return "";
        }
        case "rollup": {
            const v = property.rollup;
            if (!v) return "";
            if (v.type === "number") return v.number != null ? String(v.number) : "";
            if (v.type === "date") {
                if (!v.date) return "";
                return v.date.end ? `${v.date.start} – ${v.date.end}` : v.date.start;
            }
            if (v.type === "array") {
                return v.array.map((item: any) => getPropertyPlain(item)).join(", ");
            }
            return "";
        }
        default:
            return "";
    }
};

/**
 * ✅ 핵심: 페이지 안 child_database 후보들을 모은 뒤,
 * "작성자" + "한 줄평" 컬럼이 있는 DB를 찾아낸다.
 */
const findOneLineDatabaseId = async (pageId: string) => {
    const blocks = await fetchAllBlocksDeep(pageId);
    const dbBlocks = blocks.filter((b) => b.type === "child_database");

    // 어떤 DB든 “작성자/한 줄평” 컬럼이 있는지 검사해서 고르기
    for (const b of dbBlocks) {
        try {
            const db = (await notion.databases.retrieve({
                database_id: b.id,
            })) as DatabaseObjectResponse;

            const keys = Object.keys(db.properties ?? {});
            const hasWriter = keys.some((k) =>
                includesAny(k, ["작성자", "멤버", "writer"]),
            );
            const hasOneLine = keys.some((k) =>
                includesAny(k, ["한 줄평", "한줄평", "한마디", "one line", "oneline"]),
            );

            if (hasWriter && hasOneLine) return b.id;
        } catch (e) {
            // 권한 없거나(공유 안됨) 접근 불가하면 건너뜀
        }
    }

    return null;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // ✅ 책 페이지 id

    if (!id) {
        return NextResponse.json(
            { data: null, result: false, error: "Missing id" },
            { status: 400 },
        );
    }

    try {
        const title = "한 마디로 설명하자면,";

        const databaseId = await findOneLineDatabaseId(id);

        if (!databaseId) {
            return NextResponse.json({
                data: {
                    title,
                    databaseId: null,
                    columns: ["작성자", "한 줄평"],
                    rows: [],
                },
                result: true,
            });
        }

        // DB 메타에서 정확한 컬럼명 찾기 (사용자 DB마다 표기 미세하게 다를 수 있어서)
        const db = (await notion.databases.retrieve({
            database_id: databaseId,
        })) as DatabaseObjectResponse;

        const keys = Object.keys(db.properties ?? {});
        const writerKey =
            keys.find((k) => includesAny(k, ["작성자", "멤버", "writer"])) ??
            "작성자";
        const oneLineKey =
            keys.find((k) =>
                includesAny(k, ["한 줄평", "한줄평", "한마디", "one line", "oneline"]),
            ) ?? "한 줄평";

        const pages = await queryAllDatabasePages(databaseId);

        const rows = pages
            .map((p) => {
                const props = (p as any).properties ?? {};
                const writer = getPropertyPlain(props[writerKey]).trim();
                const oneLine = getPropertyPlain(props[oneLineKey]).trim();
                return [writer, oneLine];
            })
            .filter(([w, o]) => w || o);

        return NextResponse.json({
            data: {
                title,
                databaseId,
                columns: [writerKey, oneLineKey],
                rows,
            },
            result: true,
        });
    } catch (error) {
        console.error("Notion API 호출 실패:", error);
        return NextResponse.json(
            {
                data: null,
                result: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
