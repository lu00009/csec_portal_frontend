// app/(main)/layout.tsx
import Sidebar from '@/components/layouts/Sidebar';
import TopHeader from '@/components/layouts/TopHeader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <div className="w-[250px] fixed h-full bg-gray-50">
        <Sidebar />
      </div>
      <div className="flex-1 ml-[250px]">
        <TopHeader />
        <main className="p-6 mx-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}