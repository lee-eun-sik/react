import React, { useMemo, forwardRef, useState, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useImgUploadMutation } from "../features/file/fileApi";

const CmTinyMCEEditor = forwardRef(({ value, setValue, editorStyle, max = 4000 }, ref) => {
  const [imgUpload] = useImgUploadMutation();
  const [editorCnt, setEditorCnt] = useState(value ? value.length : 0);

  // 입력 제한 및 상태 변경 최적화
  const handleEditorChange = useCallback((content, editor) => {
    const textLength = editor.getContent({ format: 'text' }).length;

    if (textLength <= max) {
      if (content !== value) {
        setValue(content);
        setEditorCnt(textLength);
      }
    } 
  }, [max, setValue, value]);

  // 에디터 옵션 설정
  const editorOptions = useMemo(() => ({
    height: 300,
    min_height: 200,
    max_height: 500,
    menubar: false,
    plugins: ['image', 'link', 'lists', 'code'],
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | code',
    autosave_ask_before_unload: false,
    autosave: false,
    cache_suffix: Math.random().toString(),
    setup: (editor) => {
      // ref 연결
      if (ref && typeof ref === 'object') {
        ref.current = editor;
      }

      // 에디터 초기화 시 값 설정
      editor.on('init', () => {
        const content = editor.getContent();
        const textLength = editor.getContent({ format: 'text' }).length;
        setEditorCnt(textLength);
        setValue(content);
      });
    },
    file_picker_callback: (callback, value, meta) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);
        formData.append('boardId', '0');
        formData.append('userId', 'system');
        formData.append('basePath', 'commonImg');

        const res = await imgUpload(formData);
        const imageUrl = res.data?.data?.url;
        if (imageUrl) callback(imageUrl, { title: file.name });
      };

      input.click();
    },
  }), [imgUpload, setValue, ref]);

  return (
    <>
      <Editor
        apiKey="t21bdvpu3429txt68453piyx714ym6twcsy0ush3vimghhl1"
        value={value}
        init={editorOptions}
        onEditorChange={handleEditorChange}
        style={editorStyle}
        placeholder="내용을 입력해주세요."
        onInit={(evt, editor) => {
          // ref에 직접 editor 인스턴스를 넣어야 getContent() 가능
          if (ref && typeof ref === 'object') {
            ref.current = editor;
          }
          editor.setContent(value); // 이게 필요
        }}
      />
      <div style={{ textAlign: 'right', color: editorCnt > max ? 'red' : 'inherit', fontSize:"12px" }}>
        ({editorCnt}/{max})
      </div>
    </>
  );
});
//  link image 

export default CmTinyMCEEditor;
