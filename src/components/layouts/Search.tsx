'use client';
import { FiSearch } from "react-icons/fi";

const Search = () => {
    return (
        <div className='flex'>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 dark:text-gray-300 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-400"
                    />
                </div>
            </div>
        </div>
    );
}

export default Search;