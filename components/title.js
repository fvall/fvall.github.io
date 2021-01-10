export default function Title({ title, line }) {
  return (
    <div className="content-title">
      <h1>{title}</h1>
      {line ? <div className="header-line"></div> : ""}
    </div>
  );
}

Title.defaultProps = { line: true };
