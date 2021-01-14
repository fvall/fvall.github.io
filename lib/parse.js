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
import prism from "@mapbox/rehype-prism";
import shiki from "rehype-shiki";
import path from "path";

export async function parse_markdown(markdown) {
  const md = matter(markdown);
  const content = await unified()
    .use(parse)
    .use(math)
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(emoji)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(katex)
    .use(raw)
    .use(shiki, {
      theme: path.join(
        process.cwd(),
        "styles",
        "material-theme-palenight.json"
      ),
    })
    .use(html)
    .process(md.content);
  return { content: content.toString(), ...md.data };
}
