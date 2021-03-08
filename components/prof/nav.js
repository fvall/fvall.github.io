import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Nav() {
  return (
    <nav>
      <div className="links">
        <ul>
          <li>
            <Link href="/professional/about/">About</Link>
          </li>
          <li>
            <Link href="/professional/skills/">Skills</Link>
          </li>
          <li>
            <Link href="/professional/projects/">Projects</Link>
          </li>
          <li>
            <Link href="/professional/contact/">Contact</Link>
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
