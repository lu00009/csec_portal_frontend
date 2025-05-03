'use client';

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Simple wrapper without HTML/Body tags
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}