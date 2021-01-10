import matter from "gray-matter";
import unified from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
import emoji from "remark-emoji";
import math from "remark-math";
import katex from "rehype-katex";
import raw from "rehype-raw";
import footnotes from "remark-footnotes";

export function parse_markdown(markdown) {
  const md = matter(markdown);
  const content = unified()
    .use(parse)
    .use(math)
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(emoji)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(katex)
    .use(raw)
    .use(html)
    .processSync(md.content)
    .toString();
  return { content: content, ...md.data };
}
