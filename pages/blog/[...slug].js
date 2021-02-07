import Post from "../../components/post";
import { format } from "date-fns";
import { get_all_posts, get_post } from "../../lib/posts";

export default function P({ content, title, date, categories }) {
  return (
    <Post title={title} content={content} date={date} categories={categories} />
  );
}

export async function getStaticPaths() {
  const paths = get_all_posts();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await get_post(params.slug);
  return {
    props: {
      title: postData.title,
      content: postData.content,
      date: format(postData.date, "LLLL dd, yyyy"),
      categories: postData.categories,
    },
  };
}
