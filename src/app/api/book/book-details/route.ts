import { notion } from "@lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NextResponse } from "next/server";

export const revalidate = 1800;

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

const getRating = (
    prop: PageObjectResponse["properties"][string] | undefined,
) => {
    if (!prop) return null;
    if (prop.type === "number") return prop.number;
    // Notion 타입 정의에서 "rating"이 누락된 경우가 있어 런타임 가드로 처리
    const maybeRatingProp = prop as unknown as {
        type?: string;
        rating?: number | null;
    };
    if (maybeRatingProp?.type === "rating") return maybeRatingProp.rating ?? null;
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

const getTitleFromProperties = (
    properties: PageObjectResponse["properties"],
) => {
    const titleProp = Object.values(properties).find(
        (prop) => prop.type === "title",
    );
    if (!titleProp || titleProp.type !== "title") return "";
    return titleProp.title.map((t) => t.plain_text).join("");
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            { data: null, result: false, error: "Missing id" },
            { status: 400 },
        );
    }

    try {
        const page = await notion.pages.retrieve({ page_id: id });

        if (page.object !== "page") {
            return NextResponse.json(
                { data: null, result: false, error: "Not a page object" },
                { status: 404 },
            );
        }

        const typedPage = page as PageObjectResponse;

        let coverUrl: string | null = null;
        const coverProp = typedPage.properties.표지;
        if (coverProp?.type === "files" && coverProp.files.length > 0) {
            const firstFile = coverProp.files[0];
            if (firstFile.type === "external") {
                coverUrl = firstFile.external.url;
            } else if (firstFile.type === "file") {
                coverUrl = firstFile.file.url;
            }
        } else if (typedPage.cover?.type === "external") {
            coverUrl = typedPage.cover.external.url;
        } else if (typedPage.cover?.type === "file") {
            coverUrl = typedPage.cover.file.url;
        }

        const meetingDateProp = typedPage.properties["모임 날짜"];
        const meetingDate =
            meetingDateProp?.type === "date" && meetingDateProp.date
                ? meetingDateProp.date.start
                : null;

        const title =
            typedPage.properties.도서명?.type === "title"
                ? typedPage.properties.도서명.title.map((t) => t.plain_text).join("")
                : "";

        const yearProp = typedPage.properties.연도;
        const year = yearProp?.type === "number" ? yearProp.number : null;

        const authorProp = typedPage.properties["저자/번역/엮은이"];
        const author =
            authorProp?.type === "rich_text"
                ? authorProp.rich_text.map((t) => t.plain_text).join("")
                : authorProp?.type === "title"
                    ? authorProp.title.map((t) => t.plain_text).join("")
                    : "";

        const publisherProp = typedPage.properties.출판사;
        const publisher =
            publisherProp?.type === "rich_text"
                ? publisherProp.rich_text.map((t) => t.plain_text).join("")
                : publisherProp?.type === "title"
                    ? publisherProp.title.map((t) => t.plain_text).join("")
                    : "";

        const categoryProp = typedPage.properties.분류;
        const category =
            categoryProp?.type === "select"
                ? (categoryProp.select?.name ?? "")
                : categoryProp?.type === "multi_select"
                    ? categoryProp.multi_select.map((v) => v.name)
                    : categoryProp?.type === "rich_text"
                        ? categoryProp.rich_text.map((t) => t.plain_text).join("")
                        : "";

        const pagesProp = typedPage.properties.페이지;
        const pages = pagesProp?.type === "number" ? pagesProp.number : null;

        const janeRating = getRating(
            getProperty(typedPage.properties, ["제인에게 이 책은"]),
        );
        const cardyRating = getRating(
            getProperty(typedPage.properties, ["카디에게 이 책은"]),
        );
        const mihakRating = getRating(
            getProperty(typedPage.properties, ["미학에게 이 책은"]),
        );

        return NextResponse.json({
            data: {
                id: typedPage.id,
                title,
                cover: coverUrl,
                year,
                meetingDate,
                author,
                publisher,
                category,
                pages,
                ratings: {
                    jane: janeRating,
                    cardy: cardyRating,
                    mihak: mihakRating,
                },
                url: typedPage.url,
                createdTime: typedPage.created_time,
                lastEditedTime: typedPage.last_edited_time,
                properties: typedPage.properties,
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
