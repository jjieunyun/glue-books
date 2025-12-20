import { NOTION_DATABASE_ID, notion } from "@lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NextResponse } from "next/server";

export const revalidate = 1800;

export async function GET() {
    try {
        const res = await notion.databases.query({
            database_id: NOTION_DATABASE_ID,
            page_size: 50,
        });

        const pages = res.results.filter(
            (r): r is PageObjectResponse => r.object === "page",
        );

        const items = pages.map((p) => {
            let coverUrl: string | null = null;
            const coverProp = p.properties["표지"];
            if (coverProp?.type === "files" && coverProp.files.length > 0) {
                const firstFile = coverProp.files[0];
                if (firstFile.type === "external") {
                    coverUrl = firstFile.external.url;
                } else if (firstFile.type === "file") {
                    coverUrl = firstFile.file.url;
                }
            }

            // 모임날짜 추출 (date 타입)
            const meetingDateProp = p.properties["모임 날짜"];
            const meetingDate =
                meetingDateProp?.type === "date" && meetingDateProp.date
                    ? meetingDateProp.date.start
                    : null;

            return {
                id: p.id,
                title:
                    p.properties["도서명"]?.type === "title"
                        ? p.properties["도서명"].title.map((t) => t.plain_text).join("")
                        : "",
                cover: coverUrl,
                meetingDate,
            };
        });

        // meetingDate 기준 최신순 정렬 (날짜 없는 항목은 맨 뒤)
        const sortedItems = items.sort((a, b) => {
            if (!a.meetingDate) return 1;
            if (!b.meetingDate) return -1;
            return (
                new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
            );
        });

        return NextResponse.json({ data: sortedItems, result: true });
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
