import { notion, NOTION_DATABASE_ID } from "./notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function getTitle(page: PageObjectResponse, key: string) {
    const prop = page.properties[key];
    if (!prop || prop.type !== "title") return "";
    return prop.title.map(t => t.plain_text).join("");
}

function getDate(page: PageObjectResponse, key: string) {
    const prop = page.properties[key];
    if (!prop || prop.type !== "date") return null;
    return prop.date?.start ?? null;
}

function getNumber(page: PageObjectResponse, key: string) {
    const prop = page.properties[key];
    if (!prop || prop.type !== "number") return null;
    return prop.number ?? null;
}

function getSelect(page: PageObjectResponse, key: string) {
    const prop = page.properties[key];
    if (!prop || prop.type !== "select") return null;
    return prop.select?.name ?? null;
}

function getRichText(page: PageObjectResponse, key: string) {
    const prop = page.properties[key];
    if (!prop || prop.type !== "rich_text") return "";
    return prop.rich_text.map(t => t.plain_text).join("");
}

function getCoverUrl(page: PageObjectResponse) {
    // Notion page cover (없으면 null)
    if (!page.cover) return null;
    if (page.cover.type === "external") return page.cover.external.url;
    return page.cover.file.url; // 서명 URL(만료 가능)
}

export type Book = {
    id: string;
    title: string;      // 도서명
    meetingDate: string | null; // 모임 날짜
    year: number | null;        // 연도
    author: string;     // 저자/번역/역은이
    publisher: string;  // 출판사
    category: string | null;    // 분류
    pages: number | null;       // 페이지
    coverUrl: string | null;    // 표지(페이지 커버)
};

export async function getBooks(): Promise<Book[]> {
    const res = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 50,
        // 필요하면 정렬/필터 추가 가능
        // sorts: [{ property: "모임 날짜", direction: "descending" }],
    });

    const pages = res.results.filter(
        (r): r is PageObjectResponse => r.object === "page"
    );

    return pages.map((p) => ({
        id: p.id,
        title: getTitle(p, "도서명"),
        meetingDate: getDate(p, "모임 날짜"),
        year: getNumber(p, "연도"),
        author: getRichText(p, "저자/번역/역은이"),
        publisher: getRichText(p, "출판사") || getSelect(p, "출판사") || "",
        category: getSelect(p, "분류"),
        pages: getNumber(p, "페이지"),
        coverUrl: getCoverUrl(p),
    }));
}