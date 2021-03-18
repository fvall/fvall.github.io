import Head from "next/head";
import Nav from "../../components/prof/nav";
import Hero from "../../components/prof/hero";
import About from "../../components/prof/about";
import Skills from "../../components/prof/skills";
import Contact from "../../components/prof/contact";
import Sections from "../../components/prof/section";
import Projects from "../../components/prof/projects";

export default function ProfessionalHome() {
  return (
    <div className="professional">
      <Head>
        <title>Felipe Valladão - work</title>
        <meta
          name="description"
          content="Felipe de Souza Valladão - personal website"
        />
      </Head>
      <Nav />
      <Sections>
        <Hero />
        <About />
        <Skills />
        {/* <Projects /> */}
        {/* <Contact /> */}
      </Sections>
    </div>
  );
}
