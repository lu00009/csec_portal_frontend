'use client';
import { InputHTMLAttributes } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  iconClassName?: string;
  inputClassName?: string;
  onSearch: (term: string) => void;
}

const Search = ({
  containerClassName = '',
  iconClassName = '',
  inputClassName = '',
  onSearch,
  ...inputProps
}: SearchProps) => {
  return (
    <div className={`flex ${containerClassName}`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <FiSearch className={`absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2 ${iconClassName}`} />
          <input
            {...inputProps}
            onChange={(e) => onSearch(e.target.value)}
            className={`pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;