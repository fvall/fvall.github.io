import { SectionTitle } from "./section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Contact() {
  return (
    <div className="prof-section prof-contact">
      <div className="content" id="contact">
        <SectionTitle title="Contact" />
        <p>You can contact me using the social links below.</p>
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
    </div>
  );
}
