import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import CmDataGrid from '../../cm/CmDataGrid';
import { useMemberListQuery } from '../../features/member/memberApi'; //RTK Query 사용 시
import { useNavigate, useParams } from 'react-router-dom'; 
import { CmUtil } from '../../cm/CmUtil';
import { useSelector } from 'react-redux';
import { useCmDialog } from '../../cm/CmDialogUtil';

const Memberlist = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState({
        searchText: '',
        startDate: CmUtil.addDate(CmUtil.getToday(), {months:-3}),
        endDate: CmUtil.getToday() ,
    });
    const [sort, setSort] = useState({ field: 'create_dt', order: 'desc' });
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
    const { data, isLoading, refetch } = useMemberListQuery({
      searchType: search.searchText ? 'userId' : null,  // 또는 user_id
      searchKeyword: search.searchText,
      startDate: search.startDate,
      endDate: search.endDate,
      page,
      pageSize: 10,
      sortField: sort.field,
      sortOrder: sort.order,
    });
    console.log('Member list data:', data);
    console.log("sortField:", sort.field, "sortOrder:", sort.order);
    const rowsWithId = (data?.data.list || []).map((row) => ({
      ...row,
      id: row.userId,
    }));
    console.log(rowsWithId.sort((a, b) => new Date(b.createDt) - new Date(a.createDt)));
    const { showAlert } = useCmDialog();
    useEffect(() => {
        refetch();
    }, [refetch, page, search, sort]);

    const handleSortChange = (model) => {
        const { field, sort } = model[0];
        const colDef = columns.find((col) => col.field === field);
        const sortField = colDef?.dbName || field;

        console.log('정렬 필드:', sortField, '| 정렬 방향:', sort);

        setSort({ field: sortField, order: sort });
    };

    const handleSearch = () => {
        console.log('search:', search);  // 콘솔 로그로 값이 어떻게 업데이트 되는지 확인

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

        setPage(1);  // 페이지를 1로 초기화
        refetch();   // refetch 호출하여 서버에 요청
    };
    const navigate = useNavigate();
    const columns = [
    { field: 'username', headerName: '이름', width: 90, dbName: "username"},
    { field: 'gender', headerName: '성별', width: 90, dbName: "gender"},
    { field: 'userId', headerName: '아이디', width: 100, dbName: "user_id"},
    { field: 'password', headerName: '비밀번호', width: 100, dbName: "password"},
    { field: 'phonenumber', headerName: '전화번호', width: 100, dbName: "phonenumber"},
    { field: 'email', headerName: '이메일', width: 150, dbName: "email"},
    { field: 'createDt', headerName: '가입일자', width: 100, dbName: "create_dt"},
    {
      field: 'actions',
      headerName: '관리',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
            <Button variant="contained" size="small" sx={{ mr: 1 }}>탈퇴</Button>
        </>
      ),
    },
    ];
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      } 
    };
    return (
        <Box sx={{ p: 3}}>
            <h2>회원목록</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <CmDataGrid
                  rows={rowsWithId}
                  columns={columns}
                  loading={isLoading}
                  sortS={handleSortChange}
                  pageCount={data?.data?.totalPages || 1}
                  page={page}
                  onPageChange={(value) => setPage(value)}
                >

                </CmDataGrid>
            )}
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <TextField
                  label="검색어"
                  value={search.searchText}
                  onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
                  onKeyPress={handleKeyPress}
                />
                <TextField
                  label="시작일"
                  type="date"  
                  value={search.startDate}
                  inputRef={startDateRef}
                  onChange={(e) => setSearch({ ...search, startDate: e.target.value})}
                  onKeyPress={handleKeyPress}
                />
                <TextField
                  label="종료일"
                  type="date"
                  value={search.endDate}
                  inputRef={endDateRef}
                  onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
                  onKeyPress={handleKeyPress}
                />
                <Button variant="contained" onClick={handleSearch}>검색</Button>
                {user && (
                    <Button
                    variant="contained"
                    onClick={() => navigate("/board/create.do")}
                    >
                        글쓰기
                    </Button>
                )}    
            </Box>  
        </Box>    
    );
};

export default Memberlist;