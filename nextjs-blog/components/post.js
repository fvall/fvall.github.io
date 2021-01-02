import Head from "next/head";
import Nav from "../components/nav";
import Content from "../components/content";
import Title from "../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Post({ content, title, date, categories }) {
  return (
    <div className="post">
      <Head>
        <title>{title}</title>
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
    </div>
  );
}
