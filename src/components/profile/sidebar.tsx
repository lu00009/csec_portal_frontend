import {  
  FiUser as FiProfile, 
  
} from 'react-icons/fi';
import { IoMdPerson } from 'react-icons/io';
import { useState } from 'react';
import { MdEventAvailable } from 'react-icons/md';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { LuClipboardList } from 'react-icons/lu';



const ProfileNav = () =>{
  const [clicked, setClicked] = useState(false);

  return(
  <div className="w-full lg:w-1/4 space-y-6">
    {/* Left Side - Navigation */}
  <div className="bg-white rounded-lg shadow-sm p-4">
    <h3 className="font-bold text-gray-800 mb-4">Navigation</h3>
    <div className="space-y-2">
    <button
      onClick={() => setClicked(!clicked)}
      className="w-full flex items-center px-4 py-2 font-medium text-blue-600 bg-blue-50 rounded-lg"
    >
      {clicked ? <IoMdPerson className="mr-2" /> : <FiProfile className="mr-2" />}
      Profile
    </button>
      <button className="w-full flex items-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
        <MdEventAvailable className="mr-2" />
        Attendance
      </button>
      <button className="w-full flex items-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
        <HiOutlineDocumentText className="mr-2" />
        Progress
      </button>
      <button className="w-full flex items-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
        <LuClipboardList className="mr-2" />
        Heads up!
      </button>
    </div>
  </div>
</div>
  )
        
}
 
export default ProfileNav 