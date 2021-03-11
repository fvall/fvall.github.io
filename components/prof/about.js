import { SectionTitle } from "./section";

export default function About() {
  return (
    <div className="prof-section prof-about">
      <div className="content">
        <SectionTitle title={"About me"} />
        <p className="description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
          accusamus quo quia beatae, perferendis illum aperiam repellendus
          cupiditate ducimus ut vitae eveniet officiis odio dicta. Unde
          laboriosam aliquam velit facilis?
        </p>
        <ul>
          <li>a</li>
          <li>b</li>
          <li>c</li>
        </ul>
      </div>
    </div>
  );
}
