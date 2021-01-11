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
        </ul>
      </div>
      <div className="social-media">
        <ul>
          <li>
            <a href="https://github.com/fvall" target="_blank">
              <FontAwesomeIcon icon={["fab", "github"]} size="2x" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/felipe-de-souza-valladao/"
              target="_blank"
            >
              <FontAwesomeIcon icon={["fab", "linkedin"]} size="2x" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
