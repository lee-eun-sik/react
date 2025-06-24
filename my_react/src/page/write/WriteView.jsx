import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import { useWriteViewQuery } from "../../features/write/writeApi";
import CmComment from "../../cm/CmComment";
import back from "../../image/back.png";
import edit from "../../image/editBlack.png";

const WriteView = () => {
  const [searchParams] = useSearchParams();
  const writingId = searchParams.get("writingId");

  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
  const { data, isLoading, error, isSuccess, refetch } = useWriteViewQuery({
    writingId: writingId,
  });

  const [writing, setWriting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setWriting(data?.data);
    }
  }, [isSuccess, data]);

  return (
    <Box sx={{padding: "20px"}}>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">게시글을 불러오는 데 실패했습니다.</Alert>
      ) : writing ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mb: "10px",
            }}
          >
            {/*뒤로가기 버튼*/}
            <Button
              onClick={() => window.history.back()}
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "10px",
                height: "35px",
                minWidth: "0",
                width: "35px",
                "&:hover": {
                  backgroundColor: "#363636",
                },
                backgroundColor: "rgba(54, 54, 54, 0.4)",
              }}
            >
              <img src={back} alt="" ></img>
            </Button>
            <Typography variant="h5"
            sx={{mt:"3px", ml:"2px"}}>
              {writing.writingTitle}
            </Typography>
            {/*게시글 수정 버튼*/}
            <Box display="flex">
              {user?.usersId === writing?.createId && (
                <Button
                  onClick={() =>
                    navigate(`/write/update.do?id=${writing.writingId}`, {
                      state: { reset: true },
                    })
                  }
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(194, 194, 194, 0.4)",
                    },
                  }}
                >
                  <img src={edit} alt=""></img>
                </Button>
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            gap="10px"
            color="text.secondary"
            fontSize={14}
          >
            <span>{writing.createId}</span>
            <span>{writing.createDt?.substring(0, 10)}</span>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Paper>
            {writing.postFiles && writing.postFiles.length > 0 && (
              <>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    overflowX: "auto",
                    gap: 2,
                    padding: 1,
                    "&::-webkit-scrollbar": {
                      height: "5px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#ccc",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {writing.postFiles.map((file, index) => (
                    <Box
                      key={file.postFileId ?? index}
                      sx={{
                        position: "relative",
                        minWidth: 140,
                        height: 140,
                        borderRadius: "5px",
                        overflow: "hidden",
                        backgroundColor: "#ccc",
                        scrollSnapAlign: "start",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${file.postFileId}`}
                        alt={`preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Paper>

          <Box>

            <Paper
              sx={{
                p: 2,
                minHeight: "200px",
                maxHeight: "500px",
                overflow: "auto",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: writing.writingContent }}
              />
            </Paper>
            <CmComment
              comment={data?.data?.comments || []}
              user={user}
              writingId={writing.writingId}
              refetchComments={refetch}
            />
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default WriteView;
