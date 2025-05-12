import { useNewBoardListQuery } from "../../features/newBoard/newBoardApi";

const Ex12 = () => {
    const { data, isLoading, refetch } = useNewBoardListQuery({
        searchText: '',
        startDate: "2025-02-07",
        endDate: "2025-05-07",
        page: 1,
        sortField: "create_dt",
        sortOrder: "desc",
    });

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

export default Ex12;