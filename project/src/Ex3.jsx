
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Ex3 = () => {
    const array = ["하나", "둘", "셋"];
    const navigate = useNavigate();
    return (
        <>
        <ul>
        {
        array.map((item, index) => (
            <li>{item}</li>

        ))
        }    
        </ul>
        <button onClick={() => navigate('/ex4')} >ex4</button>
        </>
    );
}



export default Ex3;
