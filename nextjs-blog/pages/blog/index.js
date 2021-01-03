import Head from "next/head";
import Nav from "../../components/nav";
import Content from "../../components/content";
import Title from "../../components/title";
import PostList from "../../components/post-list";
import { blog_static_props } from "../../lib/posts";

export default function BlogHome({ posts }) {
  return (
    <div className="blog-home">
      <Head>
        <title>Connecting the dots</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Content>
        <main>
          <div className="hero">
            <Title title={"Connecting the dots"} line={false} />
            {/* <h3>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi
              quidem facilis soluta, laudantium reprehenderit dolore ullam
              provident voluptatibus libero illo.
            </h3> */}
          </div>
          <PostList posts={posts} />
        </main>
      </Content>
      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  const posts = blog_static_props();
  return {
    props: {
      posts: posts,
    },
  };
}
