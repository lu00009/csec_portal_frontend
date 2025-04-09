import { IoPersonSharp } from "react-icons/io5";
import { RiHandbagFill } from "react-icons/ri";
import { TbNotes } from "react-icons/tb";


const ProfileTop  = () => {
  return(
    <div className="bg-white p-4 shadow-sm rounded-lg mb-6">
    <div className="flex w-full">
      <button className="flex-1 flex items-center justify-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
        <IoPersonSharp className="mr-2" />
        Required Information
      </button>
      <button className="flex-1 flex items-center justify-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
        <RiHandbagFill className="mr-2" />
        Optional Information
      </button>
      <button className="flex-1 flex items-center justify-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
        <TbNotes className="mr-2" />
        Resources
      </button>
    </div>
  </div>
  )


}
 export default ProfileTop