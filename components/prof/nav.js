import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Burger from "../burger";

export default function Nav() {
  return (
    <>
      <nav>
        <div className="links">
          <ul>
            <Burger />
            <li>
              <Link href="/professional/">About</Link>
            </li>
            <li>
              <Link href="/professional/cv/">Experience</Link>
            </li>
            <li>
              <Link href="/professional/projects/">Projects</Link>
            </li>
            <li>
              <Link href="/blog/">Blog</Link>
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
            <li>
              <a href="mailto:felipe.valladao@gmail.com" aria-label="email">
                <FontAwesomeIcon icon={["fa", "envelope"]} size="2x" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="hidden-nav hidden">
        <ul>
          <li>
            <Link href="/professional/">About</Link>
          </li>
          <li>
            <Link href="/professional/cv/">Experience</Link>
          </li>
          <li>
            <Link href="/professional/projects/">Projects</Link>
          </li>
          <li>
            <Link href="/blog/">Blog</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
