
import React, { useState, useEffect } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  label,
  className = ""
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val === '') {
       // Allow clearing the input entirely for better UX
       return;
    }

    const numeric = parseFloat(val);
    if (!isNaN(numeric)) {
      if (numeric > max) onChange(max);
      else if (numeric < min) onChange(min);
      else onChange(numeric);
    }
  };

  const handleBlur = () => {
    if (inputValue === '' || isNaN(parseFloat(inputValue))) {
      setInputValue(min.toString());
      onChange(min);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-xs text-slate-400 mb-1">{label}</label>}
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        step={step}
        className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full text-center text-lg font-bold"
      />
    </div>
  );
};

export default NumberInput;
