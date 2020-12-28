import matter from "gray-matter";
import unified from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
import emoji from "remark-emoji";
import math from "remark-math";
import katex from "rehype-katex";

export function parse_markdown(markdown) {
  const md = matter(markdown);
  const content = unified()
    .use(parse)
    .use(math)
    .use(gfm)
    .use(emoji)
    .use(remark2rehype)
    .use(katex)
    .use(html)
    .processSync(md.content)
    .toString();
  return { content: content, ...md.data };
}
