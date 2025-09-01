'use client';

import Editor from '@monaco-editor/react';

interface JSONViewerProps {
  data: any;
  title?: string;
}

export function JSONViewer({ data, title }: JSONViewerProps) {
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className='w-full'>
      {title && <div className='mb-2 text-primary font-semibold'>{title}</div>}
      <Editor
        height='300px'
        defaultLanguage='json'
        value={jsonString}
        theme='vs-dark'
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 12,
          lineNumbers: 'off',
          folding: true,
          wordWrap: 'on',
          renderLineHighlight: 'none',
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          overviewRulerLanes: 0,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
