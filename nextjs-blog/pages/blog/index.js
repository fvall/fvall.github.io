import Head from "next/head";
import Link from "next/link";
import Nav from "../../components/nav";
import PostList from "../../components/post-list";
import { get_all_posts, get_post } from "../../lib/posts";

export default function BlogHome({ posts }) {
  return (
    <div className="blog-home">
      <Head>
        <title>Connecting the dots</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Nav />
        <div className="blog-home-hero">
          <h1>Connecting the dots</h1>
          <h3>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi
            quidem facilis soluta, laudantium reprehenderit dolore ullam
            provident voluptatibus libero illo.
          </h3>
        </div>
        <div className="measure"></div>
        <PostList posts={posts} />
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  const paths = get_all_posts();
  const posts = paths
    .map((p) => {
      return { id: p.params.id, slug: p.params.slug, ...get_post(p.params.id) };
    })
    .map((p) => {
      return {
        title: p.title,
        categories: p.categories,
        id: p.id,
        slug: p.slug,
      };
    });

  return {
    props: {
      posts: posts,
    },
  };
}
