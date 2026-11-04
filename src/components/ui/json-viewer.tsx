'use client'

import Editor from '@monaco-editor/react'

interface JSONViewerProps {
    data: unknown
    title?: string
}

export function JSONViewer({ data, title }: JSONViewerProps) {
    const jsonString = JSON.stringify(data, null, 2)

    // Custom Monaco theme to match the debug page background exactly
    const customTheme = {
        base: 'vs-dark' as const,
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#09090b', // Very dark grey to match bg-background
            'editor.foreground': '#e4e4e7', // Light grey text
            'editor.lineHighlightBackground': '#09090b', // Match background exactly
            'editor.selectionBackground': '#3f3f46', // Subtle selection
            'editor.inactiveSelectionBackground': '#27272a', // Subtle inactive selection
            'editorGutter.background': '#09090b', // Ensure gutter matches
            'editorWidget.background': '#09090b', // Ensure widgets match
            'editorSuggestWidget.background': '#09090b', // Ensure suggestions match
        },
    }

    return (
        <div className='w-full'>
            {title && (
                <div className='mb-2 text-primary font-semibold'>{title}</div>
            )}
            <div className='p-4'>
                <Editor
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme('custom-dark', customTheme)
                    }}
                    defaultLanguage='json'
                    height='300px'
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
                    theme='custom-dark'
                    value={jsonString}
                />
            </div>
        </div>
    )
}
