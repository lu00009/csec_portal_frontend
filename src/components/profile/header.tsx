import Image from 'next/image';
import defaultAvatar from '../../assets/henok.svg';

interface ProfileHeaderProps {
  fullName: string;
  role: string;
  imageUrl?: string;
  lastSeen?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  role,
  imageUrl,
  lastSeen = 'Last seen recently',
}) => {
  return (
    <div className="relative bg-blue-950 rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 blur-sm">
        <Image src={defaultAvatar} alt="background" layout="fill" objectFit="cover" />
      </div>
      <div className="relative z-10 p-6 flex items-end h-[200px]">
        <Image
          src={imageUrl || defaultAvatar}
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
