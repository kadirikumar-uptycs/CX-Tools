import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.min.css'



export default function CodeHighlighter({ data }) {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <pre id="json-container" style={{ maxHeight: '400px', overflowY: 'auto', whiteSpace: 'pre-line' }}>
            <code className="language-json">{JSON.stringify(data, null, 4)}</code>
        </pre>
    );
}
