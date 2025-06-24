import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import CmDataGrid from '../../cm/CmDataGrid'; // 경로는 상황에 맞게 조정
import { useUserListQuery } from '../../features/user/userApi'; // RTK Query 사용 시
import { useToggleMutation } from '../../features/user/userApi'; // RTK Query 사용 시
import { useNavigate } from 'react-router-dom';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';  

const AdminUserManage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState({
    searchText: '',
    startDate: CmUtil.addDate(CmUtil.getToday(),{months:-3}),
    endDate: CmUtil.getToday() ,
  });
  const [sort, setSort] = useState({ field: 'create_dt', order: 'desc' });
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const { data, isLoading, refetch } = useUserListQuery({  //쿼리로 불러온 것들은 객체이고, data를 가져와야 한다. 
    ...search,                                             //refetch는 화면을 다시 불러오는 역할을 해준다
    page, //페이지네이션을 하기 위해 가져온다
    sortField: sort.field,
    sortOrder: sort.order
  });
  const [toggle] = useToggleMutation (); //배열이기 때문에 구조분해 할당을 한다

  const userManage = async (userId, delYn) => { //비동기함수 async 기다려줘야 하기 때문에 await를 쓴다
    const res = await toggle({ userId: userId, delYn:delYn }).unwrap();
    if (res.success) {
      showAlert("회원상태 수정에 성공하셨습니다.", () => refetch());
    } else {
      showAlert("회원상태 수정에 실패했습니다.");
    }
  };


  const rowsWithId = (data?.data?.list || []).map((row) => ({
    ...row,
    id: row.userId,
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
    { field: 'userId', headerName: '사용자', width: 100, dbName:"userId"},  //db네임은 db에 넣을 값을 만들기 위해 만들었다
    { field: 'username', headerName: '사용자명', width: 150, dbName:"username"},
    { field: 'email', headerName: '이메일', width: 300, dbName:"email"},
    { field: 'createDt', headerName: '가입일', width: 100, dbName:"createDt"},
    { field: 'action1',
        headerName: '상세보기',
        width: 100,
        renderCell: (params) =>( 
          <Button onClick={(e)=>navigate(`/user/view.do?id=${params.row.userId}`)}>보기</Button>
        ),
        sortable: false 
      },
    { field: 'action2',
      headerName: '회원관리',
      width: 100,
      renderCell: (params) => {
        return params.row.delYn ===  "Y" ?
        (<Button onClick={(e)=>userManage(params.row.userId, "N")}>복구</Button>):
        (<Button onClick={(e)=>userManage(params.row.userId, "Y")}>탈퇴</Button>);
      },
      sortable: false 
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <h2>회원 정보</h2>
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
      </Box>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmDataGrid
          rows={rowsWithId || []}
          columns={columns}
          loading={isLoading}
          sortS={handleSortChange}
          pageCount={data?.data?.user?.totalPages || 1}
          page={page}
          onPageChange={(value) => setPage(value)} 
        >
      
        </CmDataGrid>
      )}
    </Box>
  );
};

export default AdminUserManage;
