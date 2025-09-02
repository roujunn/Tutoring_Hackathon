import React from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block mb-3 w-full">
      <div className="text-sm text-gray-800 mb-1 font-medium">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900 placeholder-gray-400"
      />
    </label>
  );
}
