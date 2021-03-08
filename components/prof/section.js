export default function Sections({ children }) {
  return <div className="prof-sections">{children}</div>;
}

export function SectionTitle({ title }) {
  return (
    <div className="prof-section-title">
      <h2>{title}</h2>
    </div>
  );
}
