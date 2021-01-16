import Head from "next/head";
import Nav from "../../components/nav";
import Content from "../../components/content";
import PostList from "../../components/post-list";
import { blog_static_props } from "../../lib/posts";

export default function BlogPage({ posts }) {
  return BlogHome({ posts });
}

export function BlogHome({ posts }) {
  return (
    <div className="blog-home">
      <Head>
        <title>Connecting the dots</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Connecting the dots" />
      </Head>
      <Nav />
      <Content>
        <main>
          <div className="hero">
            <div className="content-title">
              <h1>
                Connecting the dots
                <div className="dots">
                  <span className="dot-1-color">.</span>
                  <span className="dot-2-color">.</span>
                  <span className="dot-3-color">.</span>
                </div>
              </h1>
            </div>
          </div>
          <PostList posts={posts} />
        </main>
      </Content>
      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await blog_static_props();
  return {
    props: {
      posts: posts,
    },
  };
}
