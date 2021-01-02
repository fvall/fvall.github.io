import Head from "next/head";
import { useRouter } from "next/router";
import Nav from "../components/nav";
import Content from "../components/content";
import Title from "../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Post({ content, title, date, categories }) {
  return (
    <div className="post">
      <Head>
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
          integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
          crossorigin="anonymous"
        />
      </Head>
      <Nav />
      <Content>
        <main>
          <header>
            <Title title={title} />
          </header>
          <div className="post-summary">
            <div className="date">
              <FontAwesomeIcon icon={["far", "calendar-alt"]} />
              <p>{date}</p>
            </div>
            <div className="categories">
              <FontAwesomeIcon icon={["fa", "tag"]} />
              <p>{categories}</p>
            </div>
          </div>
          <article
            className="post-content"
            dangerouslySetInnerHTML={{ __html: content }}
          ></article>
        </main>
      </Content>
      <script src={`${useRouter().basePath}/scripts/basic.js`}></script>
    </div>
  );
}
