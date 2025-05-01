import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
  fullName: string;
  role: string;
  imageUrl?: string;
  profilePicture?: string;
  lastSeen?: string;
  isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  role,
  profilePicture,
  lastSeen = 'Last seen recently',
  isOwnProfile,
}) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push('/main/profile/edit');
  };

  // Debugging log
  console.log('ProfileHeader render - isOwnProfile:', isOwnProfile);

  return (
    <div className="relative bg-blue-950 rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20 blur-sm">
        <Image 
          src={profilePicture} 
          alt="background" 
          fill
          className="object-cover"
        />
      </div>
      
   
      
      {/* Edit Button - Simplified for debugging */}
      {isOwnProfile && (
        <div
          className="absolute top-4 right-4 z-50 p-2 bg-red-500 rounded-full"
          onClick={handleEditClick}
        >
          <FiEdit className="text-white text-2xl" />
        </div>
      )}
      
      {/* Profile Content */}
      <div className="relative z-10 p-6 flex items-end h-[200px]">
        <Image
          src={profilePicture} 
          alt="profile"
          width={128}
          height={128}
          className="rounded-full border-4 border-white shadow-md"
        />
        <div className="ml-6">
          <h2 className="text-xl font-bold text-white">{fullName}</h2>
          <div className="flex items-center mt-1">
            <span className="text-white">{role}</span>
            <span className="ml-5 text-white text-sm">{lastSeen}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;