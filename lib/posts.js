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
        slug: [fname],
      },
    };
  });
  return ff;
}

export async function get_post(id) {
  const full_path = path.join(content_path, `${id}.md`);
  const post = fs.readFileSync(full_path, "utf8");
  const parsed = await parse_markdown(post);
  return { ...parsed };
}

export async function blog_static_props() {
  const paths = get_all_posts();
  const posts = Promise.all(
    paths.map(async (p) => {
      const post_data = await get_post(p.params.id);
      return { id: p.params.id, slug: p.params.slug, ...post_data };
    })
  );

  return posts.then((p) => {
    return p
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
  });
}
