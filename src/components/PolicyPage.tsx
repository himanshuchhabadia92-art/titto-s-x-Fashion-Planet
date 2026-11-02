import { POLICY_UPDATED } from "@/lib/site";

/** Shared layout for the Contact / policy pages. Children are plain h2, p, ul and li elements. */
export default function PolicyPage({
  title,
  showUpdated = true,
  children,
}: {
  title: string;
  showUpdated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">{title}</h1>
      {showUpdated && <p className="text-sm text-gray-500 mt-2">Last updated: {POLICY_UPDATED}</p>}
      <div className="mt-8 text-gray-700 leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1 [&_a]:underline [&_a]:font-semibold">
        {children}
      </div>
    </div>
  );
}
