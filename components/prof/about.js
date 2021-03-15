import { SectionTitle } from "./section";

export default function About() {
  return (
    <div className="prof-section prof-about">
      <SectionTitle title={"About me"} />
      <div className="content">
        <p className="description">
          I am passionate about mathematics and finance, and my drive is to
          solve complex problems. My curiosity pushes me to explore interesting
          ideas and new approaches best suited to a particular project. I have
          the natural initiative to accomplish my tasks, however I prefer to
          work in teams as I believe collaboration is the key to get the best
          outcome to any problem. Quoting LINUX
        </p>
        <blockquote>All of us are smarter than any one of us</blockquote>
        <p className="description">
          To find the optimal solution is important to bring new ideas to the
          table. This requires an open mind to experiment and the ability to
          explain complex topics in a simple way so everybody can understand and
          contribute. I strongly believe this is the recipe to overcome
          challenges and that is how I work the best.
        </p>
      </div>
    </div>
  );
}
