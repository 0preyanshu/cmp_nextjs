import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditorField.css'; 
import { useWatch } from 'react-hook-form';

export function EditorField({ setValue, control }) {
  const html = useWatch({
    control,
    name: 'html',
  });

  const handleChange = (content) => {
    setValue('html', content);  // Set the updated content in the form
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
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
      value={html}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder={placeholderText}
      className="custom-quill"
    />
  );
}
