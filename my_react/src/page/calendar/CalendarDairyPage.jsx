import CalendarView from '../calendar/CalendarView';
import ActivitYList from '../calendar/ActivityList';
import FilterBar from '../calendar/FilterBar';
import { useState } from 'react';
export default function CalendarDairyPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState("all");

    return (
        <div>
            <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} filter={filter} />
            <FilterBar filter={filter} onChange={setFilter} />
            <ActivitYList selectedDate={selectedDate} filter={filter} />
        </div>
    );
}