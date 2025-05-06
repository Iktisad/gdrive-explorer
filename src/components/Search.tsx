import React from "react";
import searchIcon from "../assets/search.svg";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <img src={searchIcon} alt="Search" className="w-10 h-10 opacity-15" />
      </div>
      <input
        type="text"
        placeholder="Search PDFs..."
        className="w-full pl-15 pr-4 py-3 bg-slate-50 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
