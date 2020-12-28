import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Nav({ children }) {
  return (
    <nav>
      <div className="links">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about/">About</Link>
          </li>
          {/* <li>Blog</li>
          <li>Projects</li> */}
          <li>
            <Link href="/blog/">Blog</Link>
          </li>
        </ul>
      </div>
      <div className="social-media">
        <ul>
          <li>
            <a href="https://github.com/fvall">
              <FontAwesomeIcon icon={["fab", "github"]} size="2x" />
            </a>
          </li>
          <li>
            <FontAwesomeIcon icon={["fab", "linkedin"]} size="2x" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
