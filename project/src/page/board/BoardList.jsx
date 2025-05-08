import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import CmDataGrid from '../../cm/CmDataGrid'; // 경로는 상황에 맞게 조정
import { useBoardListQuery } from '../../features/board/boardApi'; // RTK Query 사용 시
import { useNavigate } from 'react-router-dom';
import { CmUtil } from '../../cm/CmUtil';
import { useSelector } from 'react-redux';
import { useCmDialog } from '../../cm/CmDialogUtil';  

const BoardList = () => {
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
  const { data, isLoading, refetch } = useBoardListQuery({
    ...search,
    page,
    sortField: sort.field,
    sortOrder: sort.order,
  });
  const rowsWithId = (data?.data?.list || []).map((row) => ({
    ...row,
    id: row.boardId,
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
    { field: 'rn', headerName: '번호', width: 90, sortable: false },
    { field: 'title', headerName: '제목', width: 300, dbName:"title"},
    { field: 'createId', headerName: '작성자', width: 150, dbName:"create_id" },
    { field: 'viewCount', headerName: '조회수', width: 100, dbName:"view_count" },
    { field: 'createDt', headerName: '작성일', width: 180, dbName:"create_dt" },
    {
      field: 'action',
      headerName: '상세보기',
      width: 100,
      renderCell: (params) => (
        <Button onClick={(e) => navigate(`/board/view.do?id=${params.row.boardId}`)}>보기</Button>
      ),
      sortable: false 
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

export default BoardList;
