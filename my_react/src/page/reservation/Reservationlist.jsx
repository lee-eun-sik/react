import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import CmDataGrid from '../../cm/CmDataGrid'; // 경로는 상황에 맞게 조정
import { useReservationListQuery } from '../../features/reservation/reservationApi'; // RTK Query 사용 시
import { useNavigate } from 'react-router-dom';
import { CmUtil } from '../../cm/CmUtil';
import { useSelector } from 'react-redux';
import { useCmDialog } from '../../cm/CmDialogUtil';  

const Reservationlist = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState({
    searchText: '',
    startDate: CmUtil.addDate(CmUtil.getToday(),{months:-3}),
    endDate: CmUtil.getToday() ,
  });
  const [sort, setSort] = useState({ field: 'create_dt', order: 'desc' });
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
  const { data, isLoading, refetch } = useReservationListQuery({
    ...search,
    page,
    sortField: sort.field,
    sortOrder: sort.order,
  });
  const rowsWithId = (data?.data?.list || []).map((row) => ({
    ...row,
    id: row.reservationId,
  }));
  const { showAlert } = useCmDialog();
  useEffect(() => {
    refetch();
    
  }, [refetch, page, search]); 

  const handleSortChange = (model) => {
    const { field, sort } = model[0];
    const colDef = columns.find((col) => col.field === field);
    const sortField = colDef?.dbName || field;
  
    console.log('정렬 필드:', sortField, '| 정렬 방향:', sort);
  
    setSort({ field: sortField, order: sort });
  };

  const handleSearch = () => {
    const { startDate, endDate } = search;

    if (startDate && !CmUtil.isValidDate(startDate)) {
      showAlert("시작일 형식이 잘못되었습니다 (YYYY-MM-DD).");
      startDateRef.current?.focus();
      return;
    }
  
    if (endDate && !CmUtil.isValidDate(endDate)) {
      showAlert("종료일 형식이 잘못되었습니다 (YYYY-MM-DD).");
      endDateRef.current?.focus();
      return;
    }
  
    if (!CmUtil.isDateRangeValid(startDate, endDate)) {
      showAlert("시작일은 종료일보다 빠르거나 같아야 합니다.");
      startDateRef.current?.focus();
      return;
    }

    setPage(1);
    refetch();
  };
  const navigate = useNavigate();
  const columns = [
  { field: 'reservationId', headerName: '아이디', width: 90 , dbName: "reservation_id"},
  { field: 'reservationDate', headerName: '날짜', width: 180, dbName: "reservation_date" },
  { field: 'address', headerName: '주소', width: 250, dbName: "address" },
  { field: 'variety', headerName: '품종', width: 100, dbName: "variety" },
  { field: 'petName', headerName: '펫이름', width: 100, dbName: "pet_name" },
  { field: 'phoneNumber', headerName: '전화번호', width: 150, dbName: "phonenumber" },
  { field: 'sitter', headerName: '펫시터', width: 100 , dbName: "sitter"},
  { field: 'price', headerName: '입금', width: 100, type: 'number', dbName: "price" },
  {
    field: 'actions',
    headerName: '관리',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <>
        <Button variant="contained" size="small" sx={{ mr: 1 }}>수정</Button>
        <Button variant="contained" color="error" size="small">삭제</Button>
      </>
    ),
  },
];

  return (
    <Box sx={{ p: 3 }}>
      <h2>게시판 목록</h2>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="검색어"
          value={search.searchText}
          onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
        />
        <TextField
          label="시작일"
          type="date"
          value={search.startDate}
          inputRef={startDateRef}
          onChange={(e) => setSearch({ ...search, startDate: e.target.value })}
        />
        <TextField
          label="종료일"
          type="date"
          value={search.endDate}
          inputRef={endDateRef}
          onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
        />
        <Button variant="contained" onClick={handleSearch}>검색</Button>
        {user && (
           <Button
            variant="contained"
            onClick={() => navigate(`/board/create.do`)}
          >
           글쓰기
         </Button>
          )}
      </Box>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmDataGrid
          rows={rowsWithId || []}
          columns={columns}
          loading={isLoading}
          sortS={handleSortChange}
          pageCount={data?.data?.board?.totalPages || 1}
          page={page}
          onPageChange={(value) => setPage(value)} 
        >
      
        </CmDataGrid>
      )}
    </Box>
  );
};

export default Reservationlist;
