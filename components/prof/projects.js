import { SectionTitle } from "./section";

function open_proj_link(ele) {
  const anchor = ele.querySelector("a.proj-link");
  if (anchor !== null) {
    const dest = anchor.href;
    window.open(dest);
    return null;
  }
}


export default function Projects() {
  return (
    <div className="prof-section prof-projects">
      <div className="content">
        <SectionTitle title="Projects" />
        <div className="projects">
          <div className="proj-card proj1" onClick={(e) => open_proj_link(e.target)} >
            <div onClick={(e) => open_proj_link(e.target.parentElement)}>
              <h2 className="proj-title" onClick={(e) => open_proj_link(e.target.parentElement.parentElement)}>rcompare</h2>
            </div>
            <p onClick={(e) => open_proj_link(e.target.parentElement)}>
              File comparison tool optimized for hard-drives
            </p>
            <a className="proj-link" href="https://github.com/fvall/rcompare"></a>
          </div>
          <div className="proj-card proj2" onClick={(e) => open_proj_link(e.target)}>
            <div onClick={(e) => open_proj_link(e.target.parentElement)}>
              <h2 className="proj-title" onClick={(e) => open_proj_link(e.target.parentElement.parentElement)}>ClayDash</h2>
            </div>
            <p onClick={(e) => open_proj_link(e.target.parentElement)}>
              A simple statistics dashboard in Rust using clay and raylib
            </p>
            <a className="proj-link" href="https://github.com/fvall/claydash/"></a>
          </div>
          <div className="proj-card proj3" onClick={(e) => open_proj_link(e.target)}>
            <div onClick={(e) => open_proj_link(e.target.parentElement)}>
              <h2 className="proj-title" onClick={(e) => open_proj_link(e.target.parentElement.parentElement)}>ypi</h2>
            </div>
            <p onClick={(e) => open_proj_link(e.target.parentElement)}>
              A REST API implementation using yfinance and FastApi to source stock market data
            </p>
            <a className="proj-link" href="https://github.com/fvall/ypi"></a>
          </div>
          {/* <div className="proj-card proj4" onClick={(e) => open_proj_link(e.target)}> */}
          {/*   <div onClick={(e) => open_proj_link(e.target.parentElement)}> */}
          {/*     <h2 className="proj-title" onClick={(e) => open_proj_link(e.target.parentElement.parentElement)}>Project 4</h2> */}
          {/*   </div> */}
          {/*   <p onClick={(e) => open_proj_link(e.target.parentElement)}> */}
          {/*     Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil */}
          {/*     accusamus quo quia beatae, perferendis illum aperiam repellendus */}
          {/*     cupiditate ducimus ut vitae eveniet officiis odio dicta. Unde */}
          {/*     laboriosam aliquam velit facilis? */}
          {/*   </p> */}
          {/*   <a className="proj-link" href="https://www.google.com"></a> */}
          {/* </div> */}
          {/* <div className="proj-card proj5" onClick={(e) => open_proj_link(e.target)}> */}
          {/*   <div onClick={(e) => open_proj_link(e.target.parentElement)}> */}
          {/*     <h2 className="proj-title" onClick={(e) => open_proj_link(e.target.parentElement.parentElement)}>Project 5</h2> */}
          {/*   </div> */}
          {/*   <p onClick={(e) => open_proj_link(e.target.parentElement)}> */}
          {/*     Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil */}
          {/*     accusamus quo quia beatae, perferendis illum aperiam repellendus */}
          {/*     cupiditate ducimus ut vitae eveniet officiis odio dicta. Unde */}
          {/*     laboriosam aliquam velit facilis? */}
          {/*   </p> */}
          {/*   <a className="proj-link" href="https://www.theguardian.com"></a> */}
          {/* </div> */}
          {/* <div className="proj-card proj6" onClick={(e) => open_proj_link(e.target)}> */}
          {/*   <div onClick={(e) => open_proj_link(e.target.parentElement)}> */}
          {/*     <h2 className="proj-title" onClick={(e) => open_proj_link(e.target.parentElement.parentElement)}>Project 6</h2> */}
          {/*   </div> */}
          {/*   <p onClick={(e) => open_proj_link(e.target.parentElement)}> */}
          {/*     Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil */}
          {/*     accusamus quo quia beatae, perferendis illum aperiam repellendus */}
          {/*     cupiditate ducimus ut vitae eveniet officiis odio dicta. Unde */}
          {/*     laboriosam aliquam velit facilis? */}
          {/*   </p> */}
          {/*   <a className="proj-link" href="https://www.ft.com"></a> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
