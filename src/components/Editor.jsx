import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, theme }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('young-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
      }
    });
  };

  return (
    <div className="editor-container">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={onChange}
        theme={theme === 'dark' ? 'young-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          wordWrap: 'on',
          automaticLayout: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
