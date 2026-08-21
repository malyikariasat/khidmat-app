export default function SectorGridBackground({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`sector-grid-bg pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
