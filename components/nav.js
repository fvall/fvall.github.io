import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Nav({ children }) {
  return (
    <nav>
      <div className="links">
        <ul>
          <li>
            <Link href="/">Blog</Link>
          </li>
          <li>
            <Link href="/about/">About</Link>
          </li>
          <li>
            <Link href="/professional/">Professional</Link>
          </li>
        </ul>
      </div>
      <div className="social-media">
        <ul>
          <li>
            <a
              href="https://github.com/fvall"
              target="_blank"
              aria-label="github"
              rel="noopener"
            >
              <FontAwesomeIcon icon={["fab", "github"]} size="2x" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/felipe-de-souza-valladao/"
              target="_blank"
              aria-label="linkedin"
              rel="noopener"
            >
              <FontAwesomeIcon icon={["fab", "linkedin"]} size="2x" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
