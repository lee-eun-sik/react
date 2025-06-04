import React from 'react';

const CommonComboBox = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        left: -7,
        top: -14,
        position: 'relative',
        backgroundColor: '#e0e0e0',
        border: 'none',
        borderRadius: '12px',
        height: '32px',
        padding: '0 16px',
        fontSize: '14px',
        color: value ? '#000' : '#888',
        textAlignLast: 'center', // 옵션 텍스트 중앙 정렬 (Chrome/Edge)
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        backgroundImage:
          'url("data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '20px',
        cursor: 'pointer',
        minWidth: '143px',
      }}
    >
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