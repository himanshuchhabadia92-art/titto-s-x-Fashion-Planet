import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-gray-500 text-lg">We couldn&apos;t find that page.</p>
        <Link href="/" className="mt-6 inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
