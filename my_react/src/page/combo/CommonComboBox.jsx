// CommonComboBox.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


const CommonComboBox = ({ options, value, onChange, placeholder = '선택하세요', disabled = false, sx, label }) => {

  return (
    
    <FormControl fullWidth disabled={disabled}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        inputProps={{'aria-label':'Without label'}}
        label={label}
        sx={sx} 
      >
        <MenuItem value="" disabled>
         {placeholder}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CommonComboBox;