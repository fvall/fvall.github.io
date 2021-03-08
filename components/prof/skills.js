import Link from "next/link";
import { SectionTitle } from "./section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Skills() {
  return (
    <div className="prof-section prof-skills">
      <SectionTitle title={"My skills"} />
      <div className="skills">
        <div className="skill">
          <div className="icon">
            <FontAwesomeIcon icon={["fas", "square-root-alt"]} size="3x" />
          </div>
          <h4>Mathematics</h4>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt ea
            reiciendis quos iste amet commodi hic quisquam? Aliquid ratione at
            neque animi hic nobis reiciendis!
          </p>
        </div>
        <div className="skill">
          <div className="icon">
            <FontAwesomeIcon icon={["fas", "file-invoice-dollar"]} size="3x" />
          </div>
          <h4>Finance</h4>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt ea
            reiciendis quos iste amet commodi hic quisquam? Aliquid ratione at
            neque animi hic nobis reiciendis!
          </p>
        </div>
        <div className="skill">
          <div className="icon">
            <FontAwesomeIcon icon={["fas", "laptop-code"]} size="3x" />
          </div>
          <h4>Coding</h4>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt ea
            reiciendis quos iste amet commodi hic quisquam? Aliquid ratione at
            neque animi hic nobis reiciendis!
          </p>
        </div>
      </div>
      <div id="cv-link">
        <Link href="#">Curriculum Vitae</Link>
      </div>
    </div>
  );
}
