import Image from "next/image";

export default function Hero() {
  return (
    <div className="prof-section prof-hero">
      <h2 id="hero-intro">
        Hi, <br />
        <span>I am Felipe</span>
      </h2>
      <p id="hero-desc">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil accusamus
        quo quia beatae, perferendis illum aperiam repellendus cupiditate
        ducimus ut vitae eveniet officiis odio dicta. Unde laboriosam aliquam
        velit facilis?
      </p>
      <img src="/me.jpeg" alt="profile picture" />
    </div>
  );
}