import fs from "fs";
import path from "path";
import { parse_markdown } from "./parse";
import { format } from "date-fns";
import truncate from "truncate-html";

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

export function blog_static_props() {
  const paths = get_all_posts();
  const posts = paths
    .map((p) => {
      return { id: p.params.id, slug: p.params.slug, ...get_post(p.params.id) };
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    })
    .map((p) => {
      return {
        title: p.title,
        categories: p.categories,
        id: p.id,
        slug: p.slug,
        date: format(p.date, "LLLL dd, yyyy"),
        desc: truncate(p.content, 25, { byWords: true, stripTags: true }),
      };
    });

  return posts;
}
