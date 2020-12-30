import BlogHome from "./blog/index";
import { get_all_posts, get_post } from "../lib/posts";
import { format } from "date-fns";

export default function Home({ posts }) {
  return BlogHome({ posts });
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
        date: format(p.date, "LLLL dd, yyyy"),
        slug: p.slug,
      };
    });

  return {
    props: {
      posts: posts,
    },
  };
}
