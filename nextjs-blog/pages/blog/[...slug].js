import Post from "../../components/post";
import Nav from "../../components/nav";
import { get_all_posts, get_post } from "../../lib/posts";

export default function P({ content }) {
  return (
    <>
      <Nav />
      <Post>
        <article dangerouslySetInnerHTML={{ __html: content }}></article>
      </Post>
    </>
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
  const postData = get_post(params.slug.join("-"));
  return {
    props: {
      content: postData.content,
    },
  };
}
