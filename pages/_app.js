import "../styles/global.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { faClock, faCalendarAlt } from "@fortawesome/free-regular-svg-icons";

// See https://github.com/FortAwesome/react-fontawesome#integrating-with-other-tools-and-frameworks
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
library.add(faGithub, faLinkedin, faClock, faTag, faCalendarAlt);

export default function App({ Component, pageProps }) {
  return (
    <div id="__first_component">
      <Head>
        <link
          rel="shortcut icon"
          href={`${useRouter().basePath}/favicon.ico`}
        />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
