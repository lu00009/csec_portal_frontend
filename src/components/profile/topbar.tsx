import { IoPersonSharp } from "react-icons/io5";
import { RiHandbagFill } from "react-icons/ri";
import { TbNotes } from "react-icons/tb";


const ProfileTop  = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg mb-6 dark:border dark:border-gray-700">
      <div className="flex w-full">
        <button className="flex-1 flex items-center justify-center px-4 py-2 font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
          <IoPersonSharp className="mr-2" />
          Required Information
        </button>
        <button className="flex-1 flex items-center justify-center px-4 py-2 font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
          <RiHandbagFill className="mr-2" />
          Optional Information
        </button>
        <button className="flex-1 flex items-center justify-center px-4 py-2 font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
          <TbNotes className="mr-2" />
          Resources
        </button>
      </div>
    </div>
  )
}
 export default ProfileTop