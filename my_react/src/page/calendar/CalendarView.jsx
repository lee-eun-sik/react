// CalendarView.jsx 
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ selectedDate, onDateChange, filter }) {
    const [markedDates, setMarkedDates] = useState([]);

    useEffect(() => {
        fetch(`/api/activities/dates?filter=${filter}`)
            .then(response => response.json())
            .then(data => setMarkedDates(data))
            .catch(error => console.error('날짜 불로오기 오류:', error));
    }, [filter]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            if (markedDates.includes(dateStr)) {
                return <div style={{ color: 'green', fontSize: '1.2rem' }}>•</div>;
            }
        }
        return null;
    };

    return (
        <Calendar
            onChange={onDateChange}
            value={selectedDate}
            tileContent={tileContent}
        />
    );
}