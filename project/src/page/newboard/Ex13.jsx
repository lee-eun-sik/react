import { useNewBoardListQuery } from "../../features/newBoard/newBoardApi";
import { useNewBoardCreateMutation } from "../../features/newBoard/newBoardApi";
const Ex13 = () => {
    const { data, isLoading, refetch } = useNewBoardListQuery({
        searchText: '',
        startDate: "2025-02-07",
        endDate: "2025-05-07",
        page: 1,
        sortField: "create_dt",
        sortOrder: "desc",
    });

    const [newBoardCreate] = useNewBoardCreateMutation();
    const handleSummit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", "제목");
        formData.append("content", "내용");
        formData.append("viewCount", 0);

        const res = await newBoardCreate(formData).unwrap(); //원하는 타이밍에 실행함. 던지고 안기다림 async, await기다려서 처리함.
        if (res.success) {
            alert("게시글 생성 성공했습니다.");
            refetch(); // 데이터 추가 다시 조회해서 목록보임. 조회하는 것을 다시그림
        } else {
            alert("게시글 생성 실패했습니다.");
        }
    };
    
    const rowsWithId = (data?.data?.list || []).map((row) => ({
        ...row, // 객체의 모든것을 넣어라 
        id: row.boardId,
    }));
    if(isLoading) {
        return isLoading && (
            <>
            로딩중...
            </>
        );
    }

    return (
        <>
            {data?.data?.list && data?.data?.list.map((board, index) => { // 하나가 갱신
                <li key={board.boardId}>{board.title}:{board.createDt}</li>
            })}
        </>
    );
};

export default Ex13;