// app/(auth)/layout.tsx
import ProfileHeader from '@/components/profile/header';
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
  <ProfileHeader/>
<div className='flex gap-2'>
  <div>      {children}
  </div></div> 
 
    </div>
  );
}