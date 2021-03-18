import Link from "next/link";
import { SectionTitle } from "./section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Skills() {
  return (
    <div className="prof-section prof-skills">
      <div className="content">
        <SectionTitle title={"My skills"} />
        <div className="skills">
          <div className="skill">
            <div className="icon">
              <FontAwesomeIcon icon={["fas", "square-root-alt"]} size="3x" />
            </div>
            <h4>Mathematics</h4>
            <p>
              I am an applied mathematician with skills in both theoretical and
              practical topics. I always try to find a way to use math in my
              tasks to execute them efficiently.
            </p>
          </div>
          <div className="skill">
            <div className="icon">
              <FontAwesomeIcon
                icon={["fas", "file-invoice-dollar"]}
                size="3x"
              />
            </div>
            <h4>Finance</h4>
            <p>
              Over 5 years experience in the financial industry covering risk,
              modelling and quantitative analysis. I enjoy using my analytical
              skills to make better financial decisions. I am also a CFA
              charterholder.
            </p>
          </div>
          <div className="skill">
            <div className="icon">
              <FontAwesomeIcon icon={["fas", "laptop-code"]} size="3x" />
            </div>
            <h4>Coding</h4>
            <p>
              I have worked with a diverse tech stack over the years, which gave
              me the opportunity to build different projects. I also find it fun
              and rewarding to develop something from scratch.
            </p>
          </div>
        </div>
        <div id="cv-link">
          <Link href="/professional/cv/">Curriculum Vitae</Link>
        </div>
      </div>
    </div>
  );
}
