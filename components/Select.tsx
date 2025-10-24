import React from 'react';

interface SelectProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Select: React.FC<SelectProps> = ({ label, checked, onChange }) => {
  return (
    <label
      className={`flex items-center justify-center p-3 text-sm font-medium text-center rounded-md cursor-pointer transition-all duration-200 border
      ${
        checked
          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300 dark:ring-offset-slate-800'
          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'
      }`}
    >
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};