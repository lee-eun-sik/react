import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import 'react-calendar/dist/Calendar.css';
import '../../css/calendar.css';
import pet from '../../image/animalFootPrintBrown.png';
import plant from '../../image/plantGreen.png'
import { useCalendarAnimalsQuery, useCalendarDotQuery, useCalendarLogQuery, useCalendarPlantsQuery } from '../../features/calendar/calendarApi';

const CalendarComponent = () => {
  const [value, setValue] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const usersId = useSelector((state) => state.user.usersId);

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return (
        date.getMonth() !== activeStartDate.getMonth() ||
        date.getFullYear() !== activeStartDate.getFullYear()
      );
    }
    return false;
  };

  const { data, isLoading, refetch } = useCalendarDotQuery({
    year: activeStartDate.getFullYear(),
    month: activeStartDate.getMonth() + 1,
  });

  useEffect(() => {
    refetch();
  }, [activeStartDate]);

  const [filterType, setFilterType] = useState('all');
  const [filterName, setFilterName] = useState('all');
  const [nameList, setNameList] = useState([]);

  const { data: logData, isLoading: isLogLoading, refetch: refetchLog } = useCalendarLogQuery({
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    day: value.getDate(),
  });

  const { data: animalList } = useCalendarAnimalsQuery();
  const { data: plantList } = useCalendarPlantsQuery();

  useEffect(() => {
    if (filterType === "animal") {
      setNameList(animalList?.map(d => d.name) || []);
    } else if (filterType === "plant") {
      setNameList(plantList?.map(d => d.name) || []);
    } else {
      setNameList([]);
    }
  }, [filterType, animalList, plantList]);

  useEffect(() => {
    setFilterName("all");
  }, [filterType, value]);

  const logs = logData || [];

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    if (log.type !== filterType) return false;
    if (filterName === 'all') return true;
    return log.name === filterName;
  });

  const categoryToUrl = {
    병원진료: (id) => `/pet/petFormHospital.do?animalId=${id}`,
    훈련: (id) => `/pet/petFormTrainingAndAction.do?animalId=${id}`,
    산책: (id) => `/pet/walk.do?animalId=${id}`,
    물주기: (id) => `/PlantWatering.do?plantId=${id}`,
    병충해: (id) => `/PlantPest.do?plantId=${id}`,
    분갈이: (id) => `/PlantRepotting.do?plantId=${id}`,
    일조량: (id) => `/PlantSunlighting.do?plantId=${id}`
  };

  const navigate = useNavigate();
  const handleLogClick = (log) => {
    const urlBuilder = categoryToUrl[log.category];
    if (!urlBuilder) return;
    let url = log.category === '산책' ? urlBuilder(log.id, log.walkId) : urlBuilder(log.id);
    navigate(url);
  };

  return (
    <Box sx={{ maxWidth: 380, width: "100%", mx: "auto" }}>

      <Calendar
        onChange={setValue}
        value={value}
        onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
        tileDisabled={tileDisabled}
        calendarType="gregory"
        formatDay={(locale, date) => String(date.getDate())}
        tileContent={({ date, view }) => {
          if (view !== 'month' || !data) return null;
          const key = date.toLocaleDateString('sv-SE');
          const todayKey = new Date().toLocaleDateString('sv-SE');
          const isToday = key === todayKey;
          const filteredData = data?.filter(d => d.logDate === key) || [];
          const animalCount = filteredData.find(d => d.type === 'animal')?.totalCount || 0;
          const plantCount = filteredData.find(d => d.type === 'plant')?.totalCount || 0;

          const renderDots = (count, colorClass) => {
            const visible = Math.min(count, 3);
            const remaining = count - visible;
            return (
              <div className="dot-line">
                {Array.from({ length: visible }).map((_, i) => (
                  <div className={`log-dot ${colorClass}`} key={i} />
                ))}
                {remaining > 0 && <span className="dot-count">+{remaining}</span>}
              </div>
            );
          };

          return (
            <div className="dot-wrapper-vertical">
              {isToday && <div style={{ marginBottom: '-4px', marginLeft: '30px', fontSize: '6px', color: 'gray' }}>오늘</div>}
              {renderDots(animalCount, 'animal-dot')}
              {renderDots(plantCount, 'plant-dot')}
            </div>
          );
        }}
      />

      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '320px',
        justifyContent: 'space-between',
        margin: '30px 20px 20px 20px'
      }}>
        <Typography sx={{ display: 'flex', fontWeight: '500', alignItems: 'center', marginLeft:'-10px'}}>
          {dayjs(value.toLocaleDateString('ko-KR')).format('YYYY.MM.DD')} 기록
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* 이름 필터 */}
          {filterType !== 'all' && (
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              >
                <MenuItem value="all">전체</MenuItem>
                {Array.from(new Set(
                  (logs || [])
                    .filter((log) => filterType === 'all' || log.type === filterType)
                    .map((log) => log.name)
                )).map((name, i) => (
                  <MenuItem key={i} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* 타입 필터 */}
          <FormControl size="small" sx={{ minWidth: 80, marginRight: '-25px' }}>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="animal">동물</MenuItem>
              <MenuItem value="plant">식물</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box>
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, i) => {
            const isSameAsPrev = i > 0 && log.name === filteredLogs[i - 1].name;
            const isSameAsNext = i < filteredLogs.length - 1 && log.name === filteredLogs[i + 1].name;

            return (
              <div key={i} className='log-list'>
                <img
                  className='log-icon'
                  src={log.type === 'animal' ? pet : plant}
                  alt={log.type}
                  style={{ width: '30px', height: '30px' }}
                />
                <div
                  className={`log-icon-wrap ${isSameAsPrev ? 'top-line' : ''} ${isSameAsNext ? 'bottom-line' : ''}`}
                />
                <div className='log-content' onClick={() => handleLogClick(log)}>
                  <span>{log.name} {log.category}</span>
                </div>
              </div>
            );
          })
        ) : (
          <li>
            {filterName !== 'all'
              ? `${filterName}에 해당하는 기록이 없습니다.`
              : `기록이 없습니다.`}
          </li>
        )}
      </Box>
    </Box>
  );
};

export default CalendarComponent;