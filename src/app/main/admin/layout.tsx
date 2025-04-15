// app/admin/layout.tsx
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col w-full h-full p-6 bg-gray-100">
      <AdminHeader />
      {children}
    </div>
  );
}