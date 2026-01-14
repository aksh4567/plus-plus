export const defineMonacoTheme = (monaco) => {
    monaco.editor.defineTheme('leetcode-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#1a1a1a', // Matches lc-body
            'editor.lineHighlightBackground': '#282828',
            'editorLineNumber.foreground': '#808080',
            'editor.selectionBackground': '#3e3e3e',
        },
    });

    monaco.editor.defineTheme('leetcode-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#ffffff',
            'editor.lineHighlightBackground': '#f7f9fa',
            'editorLineNumber.foreground': '#3c3c4399',
        },
    });
};