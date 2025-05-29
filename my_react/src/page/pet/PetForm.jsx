import React, { useState } from 'react';
import { useCreatePetMutation } from '../../features/animal/animalApi';
import { TextField, Button, Box, Typography, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { useNavigate } from 'react-router-dom';

const PetForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        adoptionDate: '',
        birthDate: '',
        gender: '',
        notes: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [createPet] = useCreatePetMutation();
    const cmDialog = useCmDialog();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        if (imageFile) data.append('profileImage', imageFile);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            await createPet(data).unwrap(); // unwrap()은 에러 핸들링을 쉽게 도와줌
            cmDialog.alert('등록 성공!');
            navigate('/pet-list'); // 등록 후 이동할 경로
        } catch (err) {
            cmDialog.alert('등록 실패: ' + (err?.data?.message || '오류가 발생했습니다.'));
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Typography variant="h5">반려동물 등록</Typography>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <TextField name="name" label="이름" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="species" label="종류" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="adoptionDate" type="date" fullWidth margin="normal" onChange={handleChange} InputLabelProps={{ shrink: true }} label="입양일" />
        <TextField name="birthDate" type="date" fullWidth margin="normal" onChange={handleChange} InputLabelProps={{ shrink: true }} label="생일" />

        <FormLabel component="legend">성별</FormLabel>
        <RadioGroup row name="gender" onChange={handleChange}>
            <FormControlLabel value="암컷" control={<Radio />} label="암컷" />
            <FormControlLabel value="수컷" control={<Radio />} label="수컷" />
        </RadioGroup>

        <TextField
            name="notes"
            label="특이사항"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            onChange={handleChange}
        />

        <Button type="submit" variant="contained" color="primary">동물 등록</Button>
        </Box>
    );
};

export default PetForm;