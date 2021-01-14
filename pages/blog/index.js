import { useEffect, useState } from "react";
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
            {/* <Title title={"Connecting the dots..."} line={false} /> */}
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
  const posts = await blog_static_props();
  return {
    props: {
      posts: posts,
    },
  };
}
