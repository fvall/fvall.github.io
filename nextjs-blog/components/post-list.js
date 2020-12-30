import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PostList({ posts }) {
  return (
    <div className="post-list">
      <ul>
        {posts.map((p) => {
          return <li key={p.id}>{PostCard(p)}</li>;
        })}
      </ul>
    </div>
  );
}

function PostCard(post) {
  return (
    <div className="post-card">
      <Link href={`/blog/${post.slug[0]}/${post.slug[1]}`}>
        <a>
          <div className="card-header">
            <h2>{post.title}</h2>
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
        <FontAwesomeIcon icon={["fa", "tag"]} />
        <h4>{post.categories}</h4>
      </div>
    </div>
  );
}
