import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { parse_markdown } from "./parse";

export const content_path = path.join(process.cwd(), "content");

export function get_all_posts() {
  const files = fs.readdirSync(content_path);
  const ff = files.map((f) => {
    const fname = f.replace(/\.md$/, "");
    return {
      params: {
        id: fname,
        slug: [fname.slice(0, 10), fname.slice(11)],
      },
    };
  });
  return ff;
}

export function get_post(id) {
  const full_path = path.join(content_path, `${id}.md`);
  const post = fs.readFileSync(full_path, "utf8");
  return {
    ...parse_markdown(post),
  };
}
