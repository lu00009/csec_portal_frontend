'use client';
import { FiSearch } from "react-icons/fi";

const Search = () => {
    return (
        <div className='flex'>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}

export default Search;
