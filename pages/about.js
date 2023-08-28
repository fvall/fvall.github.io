import Head from "next/head";
import Nav from "../components/nav";
import Content from "../components/content";
import Title from "../components/title";

import fs from "fs";
import path from "path";
import { parse_markdown } from "../lib/parse";

const about_md = path.join(process.cwd(), "about.md");

export default function About({ content, title }) {
  return (
    <div className="about">
      <Head>
        <title>Connecting the dots</title>
        <meta
          name="description"
          content="Connecting the dots - what the blog is all about"
        />
      </Head>
      <Nav />
      <Content>
        <main>
          <header>
            <Title title={title} />
          </header>
          <article
            className="page-content"
            dangerouslySetInnerHTML={{ __html: content }}
          ></article>
        </main>
      </Content>
    </div>
  );
}

export async function getStaticProps() {
  const about = fs.readFileSync(about_md, "utf8");
  return {
    props: await parse_markdown(about),
  };
}
