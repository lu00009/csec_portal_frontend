import { 
  FiClock 
} from 'react-icons/fi';
import henok from '../../assets/henok.svg'
import Image from 'next/image';
const Profilebg = () =>{
  return(
    <div className="relative bg-[#001C5DCC] rounded-lg shadow-sm mb-6 overflow-hidden">
  <div className="absolute inset-0 z-0 opacity-20 blur-sm">
    <Image src={henok} alt="henok" layout="fill" objectFit="cover" />
  </div>
  <div className="relative z-10 p-6 flex items-end h-[200px]">
    <Image src={henok} alt="henok" className="w-32 h-32 rounded-full border-4 border-white shadow-md" />
    <div className="ml-6">
      <h2 className="text-xl font-bold text-white">Henok Assefa</h2>
      <div className="flex items-center mt-1">
        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full mr-2">UI/UX DESIGNER</span>
        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Full-Stack-Developer</span>
      </div>
      <div className="flex items-center mt-2 text-white text-sm">
        <FiClock className="mr-1" />
        <span>Last Seen 2h 30m ago</span>
      </div>
    </div>
  </div>
</div>
  )
 
}

export default Profilebg