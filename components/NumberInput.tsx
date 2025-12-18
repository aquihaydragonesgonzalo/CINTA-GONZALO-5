
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
    if (parseFloat(inputValue) !== value) {
      setInputValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val === '') return; // Permitir borrar todo el número

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
    } else {
      const numeric = parseFloat(inputValue);
      if (numeric > max) setInputValue(max.toString());
      else if (numeric < min) setInputValue(min.toString());
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-widest">{label}</label>}
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        step={step}
        className="bg-slate-900 text-white px-2 py-2 rounded-lg border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full text-center text-lg font-bold font-mono transition-all"
        placeholder="0"
      />
    </div>
  );
};

export default NumberInput;
