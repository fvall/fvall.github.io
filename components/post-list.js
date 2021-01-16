import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "./title";

export default function PostList({ posts }) {
  return (
    <div className="post-list">
      {posts.map((p) => {
        return PostCard({ post: p, key: p.id });
      })}
    </div>
  );
}

function PostCard({ post, key }) {
  return (
    <div className="post-card" key={key}>
      <Link href={`/blog/${post.slug[0]}/${post.slug[1]}`}>
        <a>
          <div className="card-header">
            <Title title={post.title} />
          </div>
          <div className="card-date">
            <FontAwesomeIcon icon={["far", "calendar-alt"]} />
            <p>{post.date}</p>
          </div>
          <br />
          <p>{post.desc}</p>
        </a>
      </Link>
      <br />
      <div className="card-categories">
        <FontAwesomeIcon icon={["fa", "tag"]} size="xs" />
        <p>{post.categories}</p>
      </div>
    </div>
  );
}
