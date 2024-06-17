import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditorField.css'; 

export function EditorField({value,setValue}) {

  const [editorHtml, setEditorHtml] = useState('');

  useEffect(() => {
    setValue('html',editorHtml);
  }, [editorHtml]);

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'align'
  ];

  const placeholderText = 'Write something awesome...';

  return (
    <ReactQuill
      theme="snow"
      value={editorHtml}
      onChange={setEditorHtml}
      modules={modules}
      formats={formats}
      placeholder={placeholderText}
      className="custom-quill"
    />
  );
}
