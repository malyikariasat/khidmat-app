import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <p className="mono-tag text-signal-dark text-sm mb-2">404 — sector not found</p>
      <h1 className="font-display font-bold text-2xl text-ink mb-3">This page doesn't exist</h1>
      <p className="text-ink/70 mb-6">
        The provider, category, or page you're looking for isn't on the map.
      </p>
      <Link href="/" className="inline-block bg-ink text-paper rounded-md px-4 py-2.5 font-medium hover:bg-signal-dark">
        Back to home
      </Link>
    </div>
  );
}
