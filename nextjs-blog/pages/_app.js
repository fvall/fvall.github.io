import "../styles/global.scss";

import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

// See https://github.com/FortAwesome/react-fontawesome#integrating-with-other-tools-and-frameworks
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
library.add(faGithub, faLinkedin);

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
