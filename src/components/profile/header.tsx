import Image from 'next/image';
import henok from '../../assets/henok.svg';

const ProfileHeader = () => {
return (
  <div>
    {/* Profile Header */}
    <div className="relative bg-blue-950 rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 blur-sm">
        <Image src={henok} alt="henok" layout="fill" objectFit="cover" />
      </div>
      <div className="relative z-10 p-6 flex items-end h-[200px]">
        <Image 
          src={henok} 
          alt="henok" 
          width={128}
          height={128}
          className="rounded-full border-4 border-white shadow-md" 
        />
        <div className="ml-6">
          <h2 className="text-xl font-bold text-white">Henok Assefa</h2>
          <div className="flex items-center mt-1">
            <span className="text-white">
              Full-Stack-Developer
            </span>
            <span className="font-light, ml-5, text-white,  text-sm">Last Seen 2h 30m ago</span>

          </div>
        </div>
      </div>
    </div>
  </div>
)

}
export default ProfileHeader