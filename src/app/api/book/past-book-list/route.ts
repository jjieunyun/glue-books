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

        const getProperty = (
            properties: PageObjectResponse["properties"],
            names: string[],
        ) => {
            for (const name of names) {
                if (properties[name]) return properties[name];
            }
            const normalize = (value: string) => value.replace(/[.\s…]/g, "");
            const normalizedNames = names.map(normalize);
            for (const [key, value] of Object.entries(properties)) {
                const normalizedKey = normalize(key);
                if (normalizedNames.includes(normalizedKey)) {
                    return value;
                }
            }
            return undefined;
        };

        const parseRatingText = (value: string | null) => {
            if (!value) return null;
            const numeric = value.match(/\d+/);
            if (numeric) return Number(numeric[0]);
            const starCount =
                (value.match(/★/g)?.length ?? 0) + (value.match(/⭐/g)?.length ?? 0);
            return starCount > 0 ? starCount : null;
        };

        const getRating = (prop: PageObjectResponse["properties"][string]) => {
            if (!prop) return null;
            if (prop.type === "number") return prop.number;
            if (prop.type === "rating") return prop.rating;
            if (prop.type === "select") {
                return parseRatingText(prop.select?.name ?? null);
            }
            if (prop.type === "rich_text") {
                const text = prop.rich_text.map((t) => t.plain_text).join("");
                return parseRatingText(text);
            }
            if (prop.type === "title") {
                const text = prop.title.map((t) => t.plain_text).join("");
                return parseRatingText(text);
            }
            return null;
        };

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

            const meetingDateProp = p.properties["모임 날짜"];
            const meetingDate =
                meetingDateProp?.type === "date" && meetingDateProp.date
                    ? meetingDateProp.date.start
                    : null;

            const yearProp = p.properties["연도"];
            const year = yearProp?.type === "number" ? yearProp.number : null;

            const authorProp = p.properties["저자/번역/엮은이"];
            const author =
                authorProp?.type === "rich_text"
                    ? authorProp.rich_text.map((t) => t.plain_text).join("")
                    : authorProp?.type === "title"
                      ? authorProp.title.map((t) => t.plain_text).join("")
                      : "";

            const publisherProp = p.properties["출판사"];
            const publisher =
                publisherProp?.type === "rich_text"
                    ? publisherProp.rich_text.map((t) => t.plain_text).join("")
                    : publisherProp?.type === "title"
                      ? publisherProp.title.map((t) => t.plain_text).join("")
                      : "";

            const categoryProp = p.properties["분류"];
            const category =
                categoryProp?.type === "select"
                    ? categoryProp.select?.name ?? ""
                    : categoryProp?.type === "multi_select"
                      ? categoryProp.multi_select.map((v) => v.name)
                      : "";

            const pagesProp = p.properties["페이지"];
            const pagesCount = pagesProp?.type === "number" ? pagesProp.number : null;

            const janeRating = getRating(
                getProperty(p.properties, [
                    "제인에게 이 책은",
                    "제인에게... 이 책은",
                    "제인에게… 이 책은",
                ]),
            );
            const cardyRating = getRating(
                getProperty(p.properties, [
                    "카디에게 이 책은",
                    "카디에게... 이 책은",
                    "카디에게… 이 책은",
                ]),
            );
            const mihakRating = getRating(
                getProperty(p.properties, [
                    "미학에게 이 책은",
                    "미학에게... 이 책은",
                    "미학에게… 이 책은",
                ]),
            );

            return {
                id: p.id,
                title:
                    p.properties["도서명"]?.type === "title"
                        ? p.properties["도서명"].title.map((t) => t.plain_text).join("")
                        : "",
                cover: coverUrl,
                year,
                meetingDate,
                author,
                publisher,
                category,
                pages: pagesCount,
                ratings: {
                    jane: janeRating,
                    cardy: cardyRating,
                    mihak: mihakRating,
                },
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
