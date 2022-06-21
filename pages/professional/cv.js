import Head from "next/head";
import Nav from "../../components/prof/nav";
import Title from "../../components/title";

export default function CV() {
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
      <div className="cv">
        <h1 className="name">Felipe de Souza Valladão, CFA</h1>
        <p className="profile">
          I am a Chartered Financial Analyst with extensive experience in
          quantitative finance and risk management. My passion is to solve
          challenging problems and explore new ideas. I combine my knowledge of
          Maths, Finance and Programming to simplify complex issues and find the
          optimal solution.
        </p>
        <Group title="Experience">
          <Entry
            position={"Senior Risk Analyst"}
            role="Quantitative Analyst"
            company={"Trading firm"}
            country="UK"
            city="London"
            from={"Oct/2018"}
            to={"Present"}
          >
            <ul>
              <li>Lead the development of Python projects in the Risk team</li>
              <li>
                Responsible for handling operational issues covering:
                <ul>
                  <li>Data extraction & cleaning</li>
                  <li>Analysis & reconciliation</li>
                  <li>Report monitoring & presentation</li>
                </ul>
              </li>
              <li>
                Develop and maintain in-house models, reports and tools with a
                diverse technological stack:
                <ul>
                  <li>Python (numpy, scipy, pandas)</li>
                  <li>SQL</li>
                  <li>Git</li>
                  <li>Docker</li>
                </ul>
              </li>
              <li>
                Collaborate with trading to optimize the firm capital allocation
              </li>
              <li>Execute FX hedges to manage balance sheet exposures</li>
              {/* <li>
                Review and approve, where appropriate, limit requests from the
                trading desks
              </li>
              <li>
                Monitor daily trading activity to ensure the desks are operating
                within limits
              </li>
              <li>Monitor daily regulatory reports and their limits</li> */}
              <li>Monitor trading limits and approve limit extensions</li>
            </ul>
          </Entry>
          <Entry
            position={"Associate Director"}
            role="Stress Testing Methodology"
            company={"UBS"}
            country="UK"
            city="London"
            from={"Feb/2016"}
            to={"Oct/2018"}
          >
            <ul>
              <li>
                Developed a stress market risk model in R and C++ with
                statistical techniques:
                <ul>
                  <li>Time series modelling</li>
                  <li>GARCH processes</li>
                  <li>Elliptical copulas</li>
                  <li>Monte Carlo simulation</li>
                </ul>
              </li>
              <li>
                This project was so successful it was the reason I was promoted
                from analyst to associate director.
              </li>
              <li>
                Created an interactive visualization tool with R (Shiny/ggplot2)
                to explain the model's results to senior management which
                facilitated understanding the outputs.
              </li>
              {/* <li>
                Responsible for enhancing the stress market risk RWA model used
                for CCAR/DFAST submissions.
              </li> */}
              <li>
                Executed model confirmation and documentation adhering to FED's
                guidance on model risk management (SR 11-7) and general
                regulatory requirements.
              </li>
              {/* <li>
                Helped develop of a Python-based tool to calculate the P&L of
                callable municipal bonds in stress scenarios.
              </li> */}
              {/* <li>
                Responsible for model documentation in compliance with
                regulatory and model validation requirements.
              </li> */}
              <li>
                Responsible for the team's market risk piece submission of the
                annual MAS Industry Wide Stress-Test.
              </li>
              <li>
                Collaborated with Tech teams in the development of new
                functionalities within the market risk infra-structure.
              </li>
            </ul>
          </Entry>
          <Entry
            position={"Market Risk Analyst"}
            role="Equity Derivatives"
            company={"Santander"}
            country="UK"
            city="London"
            from={"Dec/2014"}
            to={"Feb/2016"}
          >
            <ul>
              <li>Responsible for daily reporting</li>
              <li>
                Automated several processes bringing more efficiency to the
                team.
              </li>
              <li>Assisted with enquiries from audit and trading</li>
            </ul>
          </Entry>
          <Entry
            position={"Junior Analyst"}
            role="Market Risk"
            company={"Modal Asset Management"}
            country="Brazil"
            city="Rio de Janeiro"
            from={"Nov/2012"}
            to={"Sep/2013"}
          >
            <ul>
              <li>Developed a VaR model based on Extreme Value Theory</li>
              <li>
                Developed new spreadhseets to improve the information provided
                to the traders
              </li>
              {/* <li>Assisted with due diligence inquiries.</li> */}
              <li>
                Executed and optimized operational tasks with Excel and VBA
              </li>
            </ul>
          </Entry>
        </Group>
        {/* <Group title="Certifications">
          <div className="credentials">
            <ul>
              <li>CFA® charterholder, CFA Institute.</li>
            </ul>
          </div>
        </Group> */}
        <Group title="Education">
          <Entry
            position={"Msc in Finance"}
            company={"Grenoble Graduate School of Business"}
            country="UK"
            city="London"
            from={"2013"}
            to={"2015"}
          >
            <ul>
              <li>Dissertation: Bayesian Asset Allocation</li>
              <li>Graduated with distinction</li>
            </ul>
          </Entry>
          <Entry
            position={"Bsc in Applied Mathematics"}
            company={"Universidade Federal do Rio de Janeiro"}
            country="Brazil"
            city="Rio de Janeiro"
            from={"2008"}
            to={"2013"}
          >
            <ul>
              <li>GPA: 88%</li>
              <li>Research projects:</li>
              <ul>
                <li>The First Fundamental Theorem of Asset Pricing</li>
                <li>
                  Numerical Solutions of Stochastic Differential Equations
                </li>
              </ul>
            </ul>
          </Entry>
        </Group>
        <Group title="Skills">
          <SkillList name="Mathematics">
            <SkillDesc name="Probability" level="4" />
            <SkillDesc name="Time Series" level="4" />
            <SkillDesc name="Econometrics" level="3" />
            <SkillDesc name="Statistics" level="4" />
            <SkillDesc name="Linear Algebra" level="4" />
          </SkillList>
          <SkillList name="Finance">
            <SkillDesc name="Value at Risk" level="5" />
            <SkillDesc name="Stress testing" level="4" />
            <SkillDesc name="Derivatives" level="3" />
            <SkillDesc name="Equities" level="4" />
            <SkillDesc name="Fixed income" level="3" />
          </SkillList>
          <SkillList name="Programming">
            <SkillDesc name="Python" level="5" />
            <SkillDesc name="R" level="4" />
            <SkillDesc name="SQL" level="3" />
            <SkillDesc name="Excel" level="5" />
            <SkillDesc name="VBA" level="4" />
            <SkillDesc name="C++" level="2" />
            <SkillDesc name="Latex" level="2" />
          </SkillList>
        </Group>
      </div>
    </div>
  );
}

function GroupTitle({ title }) {
  return Title({ title: title, line: true });
}

function Group({ title, children }) {
  return (
    <div className={"group " + title}>
      <GroupTitle title={title} />
      {children}
    </div>
  );
}

function Entry({ position, role, company, country, city, from, to, children }) {
  return (
    <div className="cv-entry">
      <div className="left">
        <h2 className="title">{position}</h2>
        {role && <h2 className="role">{role}</h2>}
        <h3 className="company">{company}</h3>
        <div className="location">
          <h4>{city}</h4>
          <div className="line"></div>
          <h4>{country}</h4>
        </div>
        <div className="period">
          <h4>{from}</h4>
          <div className="line"></div>
          <h4>{to}</h4>
        </div>
      </div>
      <div className="right">{children}</div>
    </div>
  );
}

function FullSkill() {
  return (
    <svg
      className="skill-level"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="42" />
    </svg>
  );
}

function HollowSkill() {
  return (
    <svg
      className="skill-level"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="42" fill="none" />
    </svg>
  );
}

function SkillDesc({ name, level, maxLevel = 5 }) {
  let skills = [];
  for (let i = 1; i <= maxLevel; i++) {
    if (i <= level) {
      skills.push(FullSkill());
    } else {
      skills.push(HollowSkill());
    }
  }

  return (
    <div className="skill">
      <h4 className="skill-name">{name}</h4>
      {skills}
    </div>
  );
}

function SkillList({ name, children }) {
  return (
    <div className="skill-list">
      <h2 className="skill-section">{name}</h2>
      <div className="skills">{children}</div>
    </div>
  );
}
