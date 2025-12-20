import { Client } from "@notionhq/client";

if (!process.env.NOTION_TOKEN) throw new Error("Missing NOTION_TOKEN");
if (!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID");

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;