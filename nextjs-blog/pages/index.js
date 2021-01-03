import BlogHome from "./blog/index";
import { blog_static_props } from "../lib/posts";

export default function Home({ posts }) {
  return BlogHome({ posts });
}

export async function getStaticProps() {
  const posts = blog_static_props();
  return {
    props: {
      posts: posts,
    },
  };
}
