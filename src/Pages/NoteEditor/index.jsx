import React, { useEffect, useState, useRef } from 'react';
import { EditorRender, useEditor } from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/default.css';

import styles from './index.module.scss';

export default (props) => {
    const initState = () => ({
            content: '',
        }),
        [state, setState] = useState(initState);

    const editorOnChange = (doc) => {
        console.log('onChange', doc)
    };
    // Update editor content
    // editor.setContent('Changed content');

    const noteEditor = useEditor({
        extensions: [StarterKit],
        content: '',
        onChange: editorOnChange,
    });

    useEffect(() => {
    }, []);

    return (
        <div className={styles['container']}>
            <EditorRender
                editor={noteEditor}
                className={styles['note-editor']}
                menuClassName={styles['note-editor-menu']}
                contentClassName={styles['note-editor-content']}
            />
        </div>
    );
}