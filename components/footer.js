import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="pages">
          <h1>Links</h1>
          <ul>
            <li>
              <Link href="/blog/">Blog</Link>
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
          <h1>Social</h1>
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
      </div>
      <div className="copyright">
        <h1>Felipe de Souza Valladão</h1>
        <p>Copyright © 2020-2023</p>
        <p>All rights reserved</p>
        <div className="project-page">
          This website is maintained by{" "}
          <a
            className="decorated"
            href="https://github.com/fvall/fvall.github.io"
            aria-label="github-page"
            target="_blank"
          >
            fvall
          </a>
        </div>
      </div>
    </footer>
  );
}
