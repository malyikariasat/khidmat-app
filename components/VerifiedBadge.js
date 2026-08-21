export default function VerifiedBadge({ type }) {
  if (!type) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-signal-dark bg-signal-light border border-signal/30 rounded-full px-2 py-0.5">
      ✓ {type}
    </span>
  );
}
