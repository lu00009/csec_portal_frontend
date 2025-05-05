import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiEdit } from 'react-icons/fi';

interface ProfileHeaderProps {
  fullName: string;
  role: string;
  imageUrl?: string;
  profilePicture?: string;
  lastSeen?: string;
  isOwnProfile: boolean;
  id: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  id,
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

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate robohash URL for missing profile pictures
  const getRobohashUrl = (id: string) => {
    return `https://robohash.org/${id}?set=set3&size=300x300`;
  };

  return (
    <div className="relative bg-blue-950 dark:bg-gray-900 rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20 blur-sm">
        <Image 
          src={profilePicture || getRobohashUrl(id)} 
          alt="background" 
          fill
          className="object-cover"
        />
      </div>
  
      {/* Edit Button */}
      {isOwnProfile && (
        <div
          className="absolute top-4 right-4 z-50 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
          onClick={handleEditClick}
        >
          <FiEdit className="text-white text-2xl" />
        </div>
      )}
      
      {/* Profile Content */}
      <div className="relative z-10 p-6 flex items-center h-[200px] pb-6">
        <div className="relative flex items-end">
          <Avatar className="border-6 border-white shadow-lg w-32 h-32">
            {profilePicture ? (
              <AvatarImage 
                src={profilePicture}
                alt={fullName}
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getRobohashUrl(id);
                }}
              />
            ) : (
              <AvatarImage 
                src={getRobohashUrl(id)}
                alt={fullName}
                className="rounded-full object-cover"
              />
            )}
            <AvatarFallback className="bg-gray-100 dark:bg-gray-700">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 right-0 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md">
            {/* Add any status indicator here if needed */}
          </div>
        </div>
        
        <div className="ml-6 mb-4">
          <h2 className="text-3xl font-bold text-white dark:text-gray-100">{fullName}</h2>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-lg text-white dark:text-gray-300 bg-blue-900 dark:bg-gray-800 px-3 py-1 rounded-full">
              {role}
            </span>
            <span className="text-white dark:text-gray-300 text-sm bg-blue-900 dark:bg-gray-800 px-2 py-1 rounded">
              Last active: {lastSeen}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;