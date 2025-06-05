import React from 'react';

const CommonComboBox = ({ options, value, onChange, placeholder = '선택하세요', disabled = false }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default CommonComboBox;