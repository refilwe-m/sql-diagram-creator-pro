
import React from 'react';
import AceEditor from 'react-ace';

// Import ace editor themes and modes
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange }) => {
  return (
    <div className="h-full overflow-hidden p-4 flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">SQL Editor</h2>
        <div className="text-xs text-muted-foreground">
          Write or paste your SQL schema here
        </div>
      </div>
      <AceEditor
        mode="mysql"
        theme="github"
        value={value}
        onChange={onChange}
        name="sql-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        placeholder={`-- Example:
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  title VARCHAR(200),
  content TEXT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`}
        className="flex-grow"
        width="100%"
        fontSize={14}
      />
    </div>
  );
};

export default SqlEditor;
