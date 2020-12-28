import Head from "next/head";
import Link from "next/link";
import Nav from "../components/nav";

import fs from "fs";
import path from "path";
import { parse_markdown } from "../lib/parse";

const about_md = path.join(path.dirname(process.cwd()), "about.md");

export default function About({ content, title }) {
  return (
    <div className="blog-home">
      <Head>
        <title>Connecting the dots</title>
      </Head>
      <Nav>
        <ul>
          <li>
            <Link href="/">Connecting the dots</Link>
          </li>
        </ul>
      </Nav>
      <main className="single-page">
        <header>
          <h2>{title}</h2>
        </header>
        <article
          className="page-content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></article>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const about = fs.readFileSync(about_md, "utf8");
  return {
    props: parse_markdown(about),
  };
}
