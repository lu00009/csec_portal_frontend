// app/(auth)/layout.tsx
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex gap-2">
        <div className="w-full dark:text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}