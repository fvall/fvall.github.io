import Link from "next/link";
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
    <Link href={`/blog/${post.slug[0]}/${post.slug[1]}`}>
      <a>
        <ul>
          <li>
            <h2>{post.title}</h2>
          </li>
          <li>
            <h2>{post.categories}</h2>
          </li>
        </ul>
      </a>
    </Link>
  );
}
