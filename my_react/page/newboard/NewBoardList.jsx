
import { TextField, Button, Box } from "@mui/material";
import { CmUtil } from "../../cm/CmUtil";
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useBoardListQuery } from "../../features/board/boardApi"; //RTK Query 사용 시
import { DataGrid } from "@mui/x-data-grid";
import { Pagination } from '@mui/material';
const NewBoardList = () => {
    const [search, setSearch] = useState({
        searchText: '',
        startDate: CmUtil.addDate(CmUtil.getToday(), {months:-3}),
        endDate: CmUtil.getToday(),
    });
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const searchTextRef = useRef(null);

    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ field: 'create_dt', order: 'desc'});
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

    
    const handleSortChange = (model) => {
        const {field, sort} = model[0];
        const colDef = columns.find((col) => col.field === field);
        const sortField = colDef?.dbName || field;

        console.log('정렬 필드:', sortField, '| 정렬 방향:', sort);

        setSort({ field: sortField, order: sort });
    };

    const navigate = useNavigate();

    useEffect(() => { //변경시 바로 refetch실행한다.await를 비동기를 동기로 만듬. 비동기는 실행하고 넘어감.
        refetch();
    }, [refetch, page, search]); // 셋팅해서 새로운 주소값을 넘겨줌

    const columns = [
        {field: 'rn', headerName: '번호', width: 90, sortable: false },
        {field: 'title', headerName: '제목', width: 300, dbName: "title"},
        {field: 'createId', headerName: '작성자', width: 150, dbName:"create_id"},
        {field: 'viewCount', headerName: '조회수', width: 100, dbName:"view_count"},
        {field: 'createDt', headerName: '작성일', width: 180, dbName:"create_dt"},
        {
            field: 'action',
            headerName: '상세보기',
            width: 100,
            renderCell: (params) => (
                <Button onClick={(e) => navigate(`/newBoard/view.do?id=${params.row.boardId}`)}>보기</Button>
            ),
            sortable: false
        },
    ];


    return (
        <Box sx={{ p: 3}}>
            <h2>게시판 목록</h2>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <TextField
                label="검색어"
                inputRef={searchTextRef}
                value={search.searchText}
                onChange={(e) => setSearch({ ...search, searchText: e.target.value })} //새로운 것이 들어가서 화면에 새로그린다.
                />
                <TextField
                  label="시작일"
                  type="date"
                  value={search.startDate}
                  inputRef={startDateRef}
                  onChange={(e) => ScreenSearchDesktop({...search, startDate: e.target.value })}
                />
                <TextField
                  lable="종료일"
                  type="date"
                  value={search.endDate}
                  inputRef={endDateRef}
                  onChange={(e) => setSearch({...search, endDate: e.target.value})}
                />  
                <Button variant="contained">검색</Button>
            </Box>
            <DataGrid
            rows={rowsWithId}
            columns={columns}
            disableColumnFilter={true}
            disableColumnMenu={true}
            hideFooter={true}
            loading={isLoading}

            sortingMode='server'
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortChange}
            />
            <Box sx={{ width: '100%' , display: 'flex', justifyContent: 'center'}}></Box>
            <Pagination variant="outlined" shape="rounded"
            count={data?.data?.board?.totalPages || 1}
            page={page}
            showFirstButton
            showLastButton
            onChange={(e, value) => setPage(value)}
            />
        </Box>
    );
}
export default NewBoardList;