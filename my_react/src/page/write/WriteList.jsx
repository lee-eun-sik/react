import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // 돋보기 아이콘 임포트
import ClearIcon from "@mui/icons-material/Clear"; // X 아이콘 임포트

import { CmUtil } from "../../cm/CmUtil";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";


import React, { act, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { useWriteListQuery } from "../../features/write/writeApi";
import { DataGrid } from "@mui/x-data-grid";
import { Pagination, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";
import add from "../../image/add.png";
import "../../css/writeList.css";
import ToggleCombo from "../../page/combo/ToggleCombo";


const WriteList = () => {
  // 검색 조건을 관리하는 상태
  const [search, setSearch] = useState({
    searchText: "",
    startDate: CmUtil.addDate(CmUtil.getToday(), { months: -3 }),
    endDate: CmUtil.getToday(),
  });

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.user.user);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const searchTextRef = useRef(null);

  const [date, setDate] = useState(dayjs());

  // 게시글 분류(동식물))를 관리하는 상태. 초기값 동물
  const [writingSortation, setwritingSortation] = useState("N01");
  const [writingCategory, setWritingCategory] = useState("C02");

  // 탭 메뉴 활성 상태를 관리하는 상태. 초기값은 0번 인덱스 (첫 번째 탭)
  const [activeTab, setActiveTab] = useState(0);
  // 탭 메뉴의 데이터 (이름과 연결될 링크)
  const tabs = [
    { name: "일상", code: "C02" },
    { name: "정보", code: "C01" },
    { name: "질문", code: "C03" },
  ];

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ field: "create_dt", order: "desc" });

  const { data, isLoading, refetch } = useWriteListQuery({
    ...search,
    page,
    sortField: sort.field,
    sortOrder: sort.order,
    writingSortation: writingSortation,
    writingCategory: writingCategory,
  });

  // DataGrid의 정렬 모델이 변경될 때 호출되는 핸들러
  const handleSortChange = (model) => {
    const { field, sort: order } = model[0]; // 정렬 필드와 순서 추출
    const colDef = columns.find((col) => col.field === field);
    const sortField = colDef?.dbName || field;

    console.log("정렬 필드:", sortField, "| 정렬 방향:", order);

    setSort({ field: sortField, order: order });
  };

  const { showAlert } = useCmDialog();

  useEffect(() => {
    const paramsSortation = searchParams.get("sortation");
    const paramsCategory = searchParams.get("category");

    if(paramsSortation) {
      setwritingSortation(paramsSortation);
    }
    if(paramsCategory) {
      setWritingCategory(paramsCategory);
    }
    switch (writingCategory) {
            case "C02":
              setActiveTab(0);
              break;
            case "C01":
              setActiveTab(1);
              break;
            case "C03":
              setActiveTab(2);
              break;
            default:
              setActiveTab(1);   // 디폴트 배열0
          }
  },[location.search])

  useEffect(() => {
    refetch();
  },[writingSortation, writingCategory, activeTab])

  const rowsWithId = (data?.data?.list || []).map((row) => ({
    ...row,
    id: row.writingId,
  }));

  // 검색 버튼 클릭 시 호출되는 핸들러
  const handleSearch = () => {
    const { startDate, endDate } = search; // 현재 검색 상태에서 시작일과 종료일 가져오기

    if (startDate && !CmUtil.isValidDate(startDate)) {
      showAlert("시작일 형식이 잘못되었습니다 (YYYY-MM-DD).");
      startDateRef.current?.focus(); // 해당 입력 필드로 포커스 이동
      return; // 함수 실행 중단
    }

    if (endDate && !CmUtil.isValidDate(endDate)) {
      showAlert("종료일 형식이 잘못되었습니다 (YYYY-MM-DD).");
      endDateRef.current?.focus();
      return;
    }

    // 날짜 범위 유효성 검사 (시작일이 종료일보다 늦지 않도록)
    if (!CmUtil.isDateRangeValid(startDate, endDate)) {
      showAlert("시작일은 종료일보다 빠르거나 같아야 합니다.");
      startDateRef.current?.focus();
      return;
    }

    setPage(1); // 검색 조건 변경 시 페이지를 1로 초기화
    refetch(); // RTK Query 데이터 다시 가져오기 (변경된 검색 조건으로)
  };

  // 검색어 지우기 핸들러
  const handleClearSearch = () => {
    setSearch({ ...search, searchText: "" });
    // 필요하다면 검색어도 초기화 후 바로 검색을 다시 실행할 수 있습니다.
    // handleSearch();
  };

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch, page, writingSortation, writingCategory]); // 의존성 배열: 이 값들이 변경될 때마다 이펙트 실행

  // DataGrid의 컬럼 정의
  const columns = [
    {
      field: "writingTitle",
      headerName: "제목",
      width: 170,
      dbName: "writing_title",
      headerAlign: "center",
      align: "left",
    },
    {
      field: "createDt",
      headerName: "작성일",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        const dateStr = params.value;
        const date = dayjs(dateStr);
        return <span>{date.format("YY.MM.DD")}</span>;
      },
    },
    {
      field: "writingViewCount",
      headerName: "조회수",
      width: 65,
      dbName: "writing_view_count",
      headerAlign: "center",
      align: "center",
    },
  ];

  // ToggleCombo에서 값이 변경될 때 호출될 핸들러
  const handleWritingSortationChange = (newValue) => {
    setwritingSortation(newValue);
  };

  

  return (
    <Box sx={{ padding: "0 20px" }}>
      <Box className="write-top-section">
        <Typography variant="h4">커뮤니티</Typography>
        <Box className="write-top-section-button">
          {user && (
            <Button
              onClick={() =>
                navigate(
                  `/write/create.do?sortation=${writingSortation}&category=${writingCategory}`
                )
              }
              className="write-add-button"
              sx={{ p: 0, width: "38px", minWidth: "38px" }}
            >
              <img src={add} alt="" className="write-add"></img>
            </Button>
          )}
          <ToggleCombo
            onToggleChange={handleWritingSortationChange}
            defaultValue={writingSortation}
          />
        </Box>
      </Box>
      <Box className="tab-wrapper">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-buttons ${activeTab === index ? "active" : ""}`}
            onClick={() => {
              setActiveTab(index);
              setWritingCategory(tab.code);
            }}
          >
            <div className="under-line">{tab.name}</div>
          </button>
        ))}
      </Box>

      {/*검색창*/}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextField
          variant="standard"
          sx={{
            width: "80%",
            mt: 2,
            "& .MuiInput-root": {
              backgroundColor: "#f0f0f0",
              borderRadius: "20px",
              height: "40px",
              padding: "0 10px",
              "&::before": {
                borderBottom: "none !important",
              },
              "&::after": {
                borderBottom: "none !important",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "none !important",
              },
              "& .MuiInputBase-input": {
                padding: "0px",
                height: "auto",
                flexGrow: 1,
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(0, 0, 0, 0.5)",
              opacity: 1,
            },
          }}
          inputRef={searchTextRef}
          value={search.searchText}
          onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          fullWidth
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                {search.searchText && (
                  <IconButton
                    onClick={handleClearSearch}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton onClick={handleSearch} edge="end" size="small">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/*시작일, 종료일 */}
      <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "center" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            value={dayjs(search.startDate)}
            onChange={(newValue) => {
              setSearch({
                ...search,
                startDate: newValue.format("YYYY.MM.DD"),
              });
            }}
            format="YYYY.MM.DD"
            slotProps={{
              textField: {
                variant: "standard",
                inputRef: startDateRef,
                sx: {
                  width: "40%",
                  mt: 2,
                  "& .MuiInput-root": {
                    backgroundColor: "#f0f0f0",
                    borderRadius: "20px",
                    height: "35px",
                    padding: "0 10px",
                    "&::before": {
                      borderBottom: "none !important",
                    },
                    "&::after": {
                      borderBottom: "none !important",
                    },
                    "&:hover:not(.Mui-disabled):before": {
                      borderBottom: "none !important",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0px",
                      height: "auto",
                      flexGrow: 1,
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(0, 0, 0, 0.5)",
                    opacity: 1,
                  },
                },
              },
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <Typography sx={{ mt: 3 }}>-</Typography>
          <DatePicker
            value={dayjs(search.endDate)}
            onChange={(newValue) => {
              setSearch({ ...search, endDate: newValue.format("YYYY.MM.DD") });
            }}
            format="YYYY.MM.DD"
            slotProps={{
              textField: {
                variant: "standard",
                inputRef: endDateRef,
                sx: {
                  width: "40%",
                  mt: 2,
                  "& .MuiInput-root": {
                    backgroundColor: "#f0f0f0",
                    borderRadius: "20px",
                    height: "35px",
                    padding: "0 10px",
                    "&::before": {
                      borderBottom: "none !important",
                    },
                    "&::after": {
                      borderBottom: "none !important",
                    },
                    "&:hover:not(.Mui-disabled):before": {
                      borderBottom: "none !important",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0px",
                      height: "auto",
                      flexGrow: 1,
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(0, 0, 0, 0.5)",
                    opacity: 1,
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Box>

      {/*게시물 리스트*/}
      <DataGrid
        rows={rowsWithId}
        rowHeight={42}
        columns={columns}
        disableColumnFilter={true}
        disableColumnMenu={true}
        hideFooter={true}
        loading={isLoading}
        sortingMode="server"
        sortingOrder={["desc", "asc"]}
        onSortModelChange={handleSortChange}
        onRowClick={(params) =>
          navigate(`/write/view.do?writingId=${params.row.writingId}`)
        }
        sx={{
          // 전체 DataGrid 컨테이너의 테두리 둥글게 및 overflow 숨기기
          borderRadius: "16px", // 원하는 둥근 정도 (예: 16px)
          overflow: "hidden", // borderRadius 적용을 위해 overflow hidden 필수
          height: "479px",
          //헤더 섹션 (Header container) 스타일
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#e0e0e0",
            borderBottom: "1px solid #ccc",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          },
          // 로우 (각 행) 스타일
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
          // 컬럼 구분선 숨기기 (추가된 부분)
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },

          //셀 (각 칸) 스타일
          "& .MuiDataGrid-cell": {
            paddingLeft: "13px",
            paddingRight: "10px",
            
          },
          "& ::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "& ::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
          },
          "& ::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        }}
      />

      {/*페이지네이션 */}
      <Box
        sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          variant="outlined"
          shape="rounded"
          count={data?.data?.totalPages || 1}
          page={page}
          showFirstButton
          showLastButton
          onChange={(e, value) => setPage(value)}
          sx={{
            "& .MuiPagination-ul": {},

            "& .MuiPaginationItem-root": {
              border: "none",
              "&.Mui-selected": {
                backgroundColor: "#526B5C",
                color: "white",
                border: "none",
              },
              "&.MuiPaginationItem-outlined": {
                border: "none",
              },
              "&.MuiPaginationItem-outlinedPrimary": {
                border: "none",
              },
              "&:hover": {
                backgroundColor: "#6a8c75",
                color: "white",
              },
              "&.MuiPaginationItem-firstLast": {
                border: "none",
              },
              "&.MuiPaginationItem-previousNext": {
                border: "none",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default WriteList;
