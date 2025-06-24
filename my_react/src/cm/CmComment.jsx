import React, { useState } from "react";
import { Box, Typography, Divider, TextField, Button } from "@mui/material";
import {
  useCommentCreateMutation,
  useCommentDeleteMutation,
  useCommentUpdateMutation,
} from "../features/write/writeApi";
import { useCmDialog } from "./CmDialogUtil";

const CmComment = ({ comment, user, writingId, refetchComments }) => {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [parentCommentsId, setParentCommentsId] = useState(0); // 부모 댓글 ID

  // 댓글 생성, 삭제, 수정 훅
  const [createComment] = useCommentCreateMutation();
  const [deleteComment] = useCommentDeleteMutation();
  const [updateComment] = useCommentUpdateMutation();
  const { showAlert, showConfirm } = useCmDialog();

  // 댓글 등록
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const commentData = { writingId, content: commentText };
      if (parentCommentsId) {
        commentData.parentCommentsId = parentCommentsId; // 부모 댓글 ID가 있으면 포함
      } else {
        commentData.parentCommentsId = 0; // 부모 댓글 ID 없으면 0으로 설정
      }
      const response = await createComment(commentData).unwrap();
      console.log("댓글 등록 성공 응답:", response);
      setCommentText(""); // 댓글 입력창 초기화
      setParentCommentsId(0); // 댓글 등록 후 부모 댓글 ID 초기화
      if (refetchComments) refetchComments(); // 댓글 목록 새로 고침
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      showAlert("댓글 등록 실패");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentsId) => {
    showConfirm("정말 삭제하시겠습니까?", async () => {
      try {
        await deleteComment({ commentsId });
        if (refetchComments) refetchComments(); // 댓글 목록 새로 고침
      } catch (error) {
        showAlert("댓글 삭제 실패");
      }
    });
  };

  // 댓글 수정 시작
  const handleEditComment = (commentsId, content) => {
    setEditingCommentId(commentsId);
    setEditCommentText(content); // 수정할 댓글의 내용을 설정
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null); // 수정 모드 종료
    setEditCommentText(""); // 수정된 내용 초기화
  };

  // 댓글 수정 제출
  const handleCommentUpdate = async () => {
    if (!editCommentText.trim()) return;

    try {
      await updateComment({
        commentsId: editingCommentId,
        content: editCommentText,
      });
      setEditingCommentId(null); // 수정 모드 종료
      setEditCommentText(""); // 수정된 내용 초기화
      if (refetchComments) refetchComments(); // 댓글 목록 새로 고침
    } catch (error) {
      showAlert("댓글 수정 실패");
    }
  };

  // 자식 댓글 작성 모드로 전환
  const handleReplyComment = (commentsId) => {
    setParentCommentsId(commentsId); // 부모 댓글 ID를 설정하여 자식 댓글 작성 모드로 전환
  };

  // 댓글을 재귀적으로 렌더링하는 함수
  const renderComments = (commentsList, parentId = 0, depth = 0) => {
    return commentsList
      .filter((comment) => comment.parentCommentsId === parentId) // 부모 댓글 ID 기준으로 필터링
      .map((comment) => (
        // This outer Box will control the horizontal layout for the entire comment block
        <Box key={comment.commentsId}>
          <Box
            sx={{
              p: 1,
              borderBottom: parentId === 0 ? "1px solid #eee" : "none", // 깊이가 0일 때만 줄 긋기
              display: "flex",
              flexDirection: "column", // Keep content and buttons stacked vertically
              // This is the indentation for the comment content
              marginLeft: depth > 0 ? `${20 * depth}px` : "0px",
            }}
          >
            {/* Comment Content and Edit/Cancel Buttons */}
            {editingCommentId === comment.commentsId ? (
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  autoFocus
                  variant="standard"
            sx={{
              mb:"10px",
              width: "100%",
              "& .MuiInput-root": {
                backgroundColor: "#f0f0f0",
                borderRadius: "20px",
                height: "40px",
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
                  padding: "0 10px",
                  flexGrow: 1,
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(0, 0, 0, 0.5)",
                opacity: 1,
              },
            }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "4px",
                    mt: 1,
                  }}
                >
                  {" "}
                  {/* Align edit buttons right within edit box */}
                  <Button
                    size="small"
                    onClick={handleCommentUpdate}
                    sx={{
                      color: "text.secondary",
                      padding: "0px 8px",
                      minWidth: "unset",
                      fontSize: "12px",
                    }}
                  >
                    수정 완료
                  </Button>
                  <Button
                    size="small"
                    onClick={handleEditCancel}
                    sx={{
                      color: "text.secondary",
                      padding: "0px 8px",
                      minWidth: "unset",
                      fontSize: "12px",
                    }}
                  >
                    수정 취소
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {comment.createId} | {comment.createDt}
                </Typography>
                <Typography>{comment.content}</Typography>

                {/* Action Buttons (Delete, Edit, Reply) - Always aligned to the far right of the *indented block* */}
                {user?.usersId === comment.createId && ( // Show only if user is owner
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end", // Aligns buttons to the right
                      gap: "4px", // Add a small gap between buttons
                      mt: 0.5, // Small margin-top to separate from comment content
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() => handleDeleteComment(comment.commentsId)}
                      sx={{
                        color: "text.secondary",
                        padding: "0px 8px",
                        minWidth: "unset",
                        fontSize: "12px",
                      }}
                    >
                      삭제
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleEditComment(comment.commentsId, comment.content)
                      }
                      sx={{
                        color: "text.secondary",
                        padding: "0px 8px",
                        minWidth: "unset",
                        fontSize: "12px",
                      }}
                    >
                      수정
                    </Button>
                    {user && !parentCommentsId && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleReplyComment(comment.commentsId)}
                          sx={{
                            color: "text.secondary",
                            padding: "0px 8px",
                            minWidth: "unset",
                            fontSize: "12px",
                          }}
                        >
                          답글 달기
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
          {/* Child Comment Reply Field - This part should still be indented */}
          {parentCommentsId === comment.commentsId && user && (
            <Box mt={2} gap={1} sx={{ marginLeft: `${20 * (depth + 1)}px` }}>
              {" "}
              {/* Indent reply field too */}
              <TextField
                fullWidth
                size="small"
                placeholder="답글을 입력하세요"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="standard"
                sx={{
                  width: "100%",
                  "& .MuiInput-root": {
                    backgroundColor: "#f0f0f0",
                    borderRadius: "20px",
                    height: "40px",
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
                      padding: "0 10px",
                      flexGrow: 1,
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(0, 0, 0, 0.5)",
                    opacity: 1,
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "end", mr: "10px", mt: "10px"  }}>
                <Button
                  onClick={handleCommentSubmit}
                  sx={{
                    color: "text.secondary",
                    padding: "0px 8px",
                    minWidth: "unset",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  답글
                </Button>
                <Button
                  sx={{
                    color: "text.secondary",
                    padding: "0px 8px",
                    minWidth: "unset",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  size="small"
                  onClick={() => setParentCommentsId(null)}
                  color="error"
                >
                  취소
                </Button>
              </Box>
            </Box>
          )}
          {/* Child Comments (Recursive Call) */}
          {renderComments(commentsList, comment.commentsId, depth + 1)}{" "}
        </Box>
      ));
  };

  return (
    <Box mt={4}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        댓글
      </Typography>
      {comment.length === 0 && (
        <Typography color="text.secondary">댓글이 없습니다.</Typography>
      )}
      {user && !parentCommentsId && (
        <Box mt={2} display="flex" gap={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="standard"
            sx={{
              mb:"10px",
              width: "80%",
              "& .MuiInput-root": {
                backgroundColor: "#f0f0f0",
                borderRadius: "20px",
                height: "40px",
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
                  padding: "0 10px",
                  flexGrow: 1,
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(0, 0, 0, 0.5)",
                opacity: 1,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            sx={{
              display: "flex",
              justifyContent: "center",
              borderRadius: "20px",
              height: "38px",
              width: "30px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#3B4C34",
              },
              backgroundColor: "#4B6044",
            }}
          >
            등록
          </Button>
        </Box>
      )}
      {renderComments(comment)} {/* 최상위 댓글 렌더링 */}
    </Box>
  );
};

export default CmComment;
