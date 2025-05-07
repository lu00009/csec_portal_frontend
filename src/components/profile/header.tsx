import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';

interface ProfileHeaderProps {
  fullName: string;
  role: string;
  profilePicture?: string;
  lastSeen?: string;
  isOwnProfile: boolean;
  id: string;
}

// Generate robohash URL for missing profile pictures
const getRobohashUrl = (id: string) => {
  return `https://robohash.org/${id}?set=set3&size=300x300`;
};

// Clean Cloudinary URL to prevent concatenation issues
const cleanCloudinaryUrl = (url: string | undefined) => {
  if (!url) return null;
  // If the URL already contains the full Cloudinary URL, return it as is
  if (url.startsWith('https://res.cloudinary.com')) {
    return url;
  }
  // If it's just the path, return null to use robohash
  return null;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  id,
  fullName,
  role,
  profilePicture,
  lastSeen,
  isOwnProfile,
}) => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeenTime, setLastSeenTime] = useState<string>('');
  const [bgImageSrc, setBgImageSrc] = useState<string>(getRobohashUrl(id));

  useEffect(() => {
    // Update online status and last seen time
    const updateLastSeen = () => {
      if (lastSeen) {
        const lastSeenDate = new Date(lastSeen);
        const now = new Date();
        const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
        // Online if lastSeen within 2 minutes
        setIsOnline(diffInMinutes < 2);
        if (diffInMinutes < 1) {
          setLastSeenTime('Just now');
        } else if (diffInMinutes < 60) {
          setLastSeenTime(`${Math.floor(diffInMinutes)} minutes ago`);
        } else if (diffInMinutes < 1440) { // Less than 24 hours
          const hours = Math.floor(diffInMinutes / 60);
          setLastSeenTime(`${hours} hour${hours > 1 ? 's' : ''} ago`);
        } else {
          setLastSeenTime(lastSeenDate.toLocaleDateString());
        }
      } else {
        setIsOnline(false);
        setLastSeenTime('No activity yet');
      }
    };
    updateLastSeen();
    const interval = setInterval(updateLastSeen, 60000); // Update every minute
    return () => {
      clearInterval(interval);
    };
  }, [lastSeen]);

  useEffect(() => {
    const cleanedUrl = cleanCloudinaryUrl(profilePicture);
    setBgImageSrc(cleanedUrl || getRobohashUrl(id));
  }, [profilePicture, id]);

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

  const cleanedProfilePicture = cleanCloudinaryUrl(profilePicture);

  return (
    <div className="relative bg-blue-950 dark:bg-gray-900 rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20 blur-sm">
        <Image 
          src={bgImageSrc}
          alt="background" 
          fill
          className="object-cover"
          onError={() => setBgImageSrc(getRobohashUrl(id))}
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
      
      <div className="relative flex items-end">
        <Avatar className="border-6 border-white shadow-lg w-32 h-32">
          <AvatarImage 
            src={cleanedProfilePicture || getRobohashUrl(id)}
            alt={fullName}
            className="rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getRobohashUrl(id);
            }}
          />
          <AvatarFallback className="bg-gray-100 dark:bg-gray-700">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 right-0 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md">
          {/* Online status indicator */}
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>
      </div>
        
      <div className="ml-6 mb-4">
        <h2 className="text-3xl font-bold text-white dark:text-gray-100">{fullName}</h2>
        <div className="flex items-center mt-2 space-x-4">
          <span className="text-lg text-white dark:text-gray-300 bg-blue-900 dark:bg-gray-800 px-3 py-1 rounded-full">
            {role}
          </span>
          <span className={`text-sm px-2 py-1 rounded flex items-center gap-2 ${isOnline ? 'text-green-500' : 'text-white dark:text-gray-300'} bg-blue-900 dark:bg-gray-800`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            {isOnline ? 'Online' : `Last seen: ${lastSeenTime}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;