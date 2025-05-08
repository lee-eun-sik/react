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
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", "제목");
        formData.append("content", "내용");
        formData.append("viewCount", 0);

        const res = await newBoardCreate(formData).unwrap();
        if (res.success) {
            alert("게시글 생성 성공했습니다.");
            refetch();
        } else {
            alert("게시글 생성 실패했습니다.");
        }
    };
    
    const rowsWithId = (data?.data?.list || []).map((row) => ({
        ...row,
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
            {data?.data?.list && data?.data?.list.map((board, index) => {
                <li key={board.boardId}>{board.title}:{board.createDt}</li>
            })}
        </>
    );
};