import React, { useState } from 'react';
import { Box, Typography, Divider, TextField, Button } from '@mui/material';
import { useCommentCreateMutation, useCommentDeleteMutation, useCommentUpdateMutation } from '../features/board/boardApi';
import { useCmDialog } from './CmDialogUtil';
const CmComment = ({ comments, user, boardId, refetchComments }) => {
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [parentCommentId, setParentCommentId] = useState(0); // 부모 댓글 ID
  
    // 댓글 생성, 삭제, 수정 훅
    const [createComment] = useCommentCreateMutation();
    const [deleteComment] = useCommentDeleteMutation();
    const [updateComment] = useCommentUpdateMutation();
    const { showAlert, showConfirm } = useCmDialog();
    // 댓글 등록
    const handleCommentSubmit = async () => {
      if (!commentText.trim()) return;
  
      try {
        const commentData = { boardId, content: commentText };
        if (parentCommentId) {
          commentData.parentCommentId = parentCommentId; // 부모 댓글 ID가 있으면 포함
        } else {
          commentData.parentCommentId = 0; // 부모 댓글 ID 없으면 0으로 설정
        }
        await createComment(commentData);
        setCommentText('');  // 댓글 입력창 초기화
        setParentCommentId(null); // 댓글 등록 후 부모 댓글 ID 초기화
        if (refetchComments) refetchComments(); // 댓글 목록 새로 고침
      } catch (error) {
        showAlert('댓글 등록 실패');
      }
    };
  
    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
      showConfirm('정말 삭제하시겠습니까?',async ()=>
        { 
          try {
            await deleteComment({ commentId });
            if (refetchComments) refetchComments(); // 댓글 목록 새로 고침
          } catch (error) {
            showAlert('댓글 삭제 실패');
          } 
       }
     );
      
     
    };
  
    // 댓글 수정 시작
    const handleEditComment = (commentId, content) => {
      setEditingCommentId(commentId);
      setEditCommentText(content);  // 수정할 댓글의 내용을 설정
    };
  
    // 댓글 수정 취소
    const handleEditCancel = () => {
      setEditingCommentId(null);  // 수정 모드 종료
      setEditCommentText('');  // 수정된 내용 초기화
    };
  
    // 댓글 수정 제출
    const handleCommentUpdate = async () => {
      if (!editCommentText.trim()) return;
  
      try {
        await updateComment({ commentId: editingCommentId, content: editCommentText });
        setEditingCommentId(null);  // 수정 모드 종료
        setEditCommentText('');  // 수정된 내용 초기화
        if (refetchComments) refetchComments(); // 댓글 목록 새로 고침
      } catch (error) {
        showAlert('댓글 수정 실패');
      }
    };
  
    // 자식 댓글 작성 모드로 전환
    const handleReplyComment = (commentId) => {
      setParentCommentId(commentId);  // 부모 댓글 ID를 설정하여 자식 댓글 작성 모드로 전환
    };
  
    // 댓글을 재귀적으로 렌더링하는 함수
    const renderComments = (commentsList, parentId = 0, depth = 0) => {
      return commentsList
        .filter(comment => comment.parentCommentId === parentId) // 부모 댓글 ID 기준으로 필터링
        .map((comment) => (
          <Box
            key={comment.commentId}
            sx={{
              p: 1,
              borderBottom: parentId === 0 ? '1px solid #eee' : 'none', // 깊이가 0일 때만 줄 긋기
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginLeft: '20px',
            }}
          >
            <Box>
              {/* 댓글 수정 상태인 경우 */}
              {editingCommentId === comment.commentId ? (
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    autoFocus
                  />
                  <Button size="small" onClick={handleCommentUpdate}>
                    수정 완료
                  </Button>
                  <Button size="small" onClick={handleEditCancel} color="error">
                    수정 취소
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography>{comment.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {comment.createId} | {comment.createDt}
                  </Typography>
                </Box>
              )}
            </Box>
  
            {/* 사용자 본인 댓글만 삭제/수정 버튼 표시 */}
            {user?.userId === comment.createId && (
              <Box>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteComment(comment.commentId)}
                >
                  삭제
                </Button>
                <Button
                  size="small"
                  onClick={() => handleEditComment(comment.commentId, comment.content)}
                >
                  수정
                </Button>
              </Box>
            )}
  
            {/* 자식 댓글 작성 버튼 */}
            {user && !parentCommentId && (
              <Button size="small" onClick={() => handleReplyComment(comment.commentId)}>
                답글 달기
              </Button>
            )}
  
            {/* 자식 댓글 작성 필드 */}
            {parentCommentId === comment.commentId && user && (
              <Box mt={2} display="flex" gap={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="답글을 입력하세요"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button variant="contained" onClick={handleCommentSubmit}>
                  답글 
                </Button>
                <Button size="small" onClick={() => setParentCommentId(null)} color="error">
                  취소
                </Button>
              </Box>
            )}
  
            {/* 자식 댓글 표시 (재귀 호출) */}
            {renderComments(commentsList, comment.commentId, depth + 1)} {/* 부모 ID를 기준으로 자식 댓글 렌더링 */}
          </Box>
        ));
    };
  
    return (
      <Box mt={4}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>댓글</Typography>
  
        {comments.length === 0 && (
          <Typography color="text.secondary">댓글이 없습니다.</Typography>
        )}
  
        {/* 댓글 입력 */}
        {user && !parentCommentId && (
          <Box mt={2} display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button variant="contained" onClick={handleCommentSubmit}>
              등록
            </Button>
          </Box>
        )}
        {renderComments(comments)} {/* 최상위 댓글 렌더링 */}
      </Box>
    );
  };
  
  export default CmComment;
  
  