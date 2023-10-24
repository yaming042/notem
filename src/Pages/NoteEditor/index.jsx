import React, { useEffect, useState, useRef } from 'react';
import {connect} from 'react-redux';
import { Input, Button, Collapse, message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { EditorRender, useEditor } from '@gitee/tide';
import { StarterKit } from '@gitee/tide-starter-kit';
import dayjs from 'dayjs';
import {getParameterByName} from '@/utils';
import request from '@/utils/request';
import {QUERY_FILE_INFO, SAVE_NOTE, SAVE_MEMO} from '@/config/url';
import Tags from '@/components/Tags';
import Loading from '@/components/Layout/Suspense';

import '@gitee/tide/dist/style.css';
import 'highlight.js/styles/default.css';

import styles from './index.module.scss';

const NoteEditor = (props) => {
    const initState = () => ({
            loading: true,
            submitting: false,
            content: [],
            activeKey: [],
            title: '',
            abstract: '',
            tags: '',
            author: props.userInfo?.login || '',
            type: getParameterByName('type'),
            id: getParameterByName('id'),
            configSha: '',
            configData: [],
            fileSha: '',

            // 标签相关数据
            memoConfig: [],
            currentMemo: {},
            memoSha: '',
        }),
        [state, setState] = useState(initState),
        history = useHistory(),
        editorRef = useRef(null);

    const getConfig = (type, id) => {
        return request(`${QUERY_FILE_INFO}?path=${encodeURIComponent(`${type}/config.json`)}`)
    };
    const getNoteContent = (type, id) => {
        if(!id) {
            return Promise.resolve();
        }

        let path = `${type}/${id}.json`;
        return request(`${QUERY_FILE_INFO}?path=${encodeURIComponent(path)}`);
    };
    const getMemoContent = (type, id) => {
        let path = `memo.json`;

        return request(`${QUERY_FILE_INFO}?path=${encodeURIComponent(path)}`);
    };

    const initEditor = () => {
        let {type, id} = state;

        if(!type) {
            getMemoContent(id).then((response) => {
                setState(o => ({...o, loading: false}));

                if(0 === response?.code) {
                    let data = response?.data || {},
                        config = decodeURIComponent(escape(atob(data?.content ||''))),
                        memoSha = data?.sha || '',
                        memoConfig = [],
                        currentMemo = {};

                    try{
                        memoConfig = JSON.parse(config);
                        currentMemo = (memoConfig || []).find(i => i.id+'' === id+'') || {};
                    }catch(e){}

                    setState(o => ({
                        ...o,
                        memoConfig,
                        content: currentMemo?.content || [],
                        memoSha,
                        currentMemo,
                    }));

                    editorRef.current && editorRef.current.setContent(currentMemo?.content || []);
                }else{
                    message.error(response?.message || '');
                }
            }).catch(e => {
                setState(o => ({...o, loading: false}));
                message.error(e?.message || '');
            })

            return;
        }

        Promise.all([
            getConfig(type, id),
            getNoteContent(type, id),
        ]).then(([configResponse, noteResponse]) => {
            setState(o => ({...o, loading: false}));

            if(0 === noteResponse?.code) {
                let data = noteResponse?.data || {},
                    content = decodeURIComponent(escape(atob(data?.content ||''))),
                    fileSha = data?.sha || '';

                try{
                    content = JSON.parse(content);
                }catch(e){}

                setState(o => ({
                    ...o,
                    content,
                    fileSha,
                }));

                editorRef.current && editorRef.current.setContent(content);
            }
            if(0 === configResponse?.code) {
                let data = configResponse?.data || {},
                    content = decodeURIComponent(escape(atob(data?.content ||''))),
                    currentNote = {};

                try{
                    content = JSON.parse(content);
                    currentNote = content.find(i => i.id+'' === id+'') || {};
                }catch(e){}

                setState(o => ({
                    ...o,
                    configData: content,
                    configSha: data?.sha || '',
                    title: currentNote?.title || '',
                    abstract: currentNote?.abstract || '',
                    tags: currentNote?.tags || '',
                    author: currentNote?.author || state.author || '',
                }));
            }
        }).catch(e => {
            setState(o => ({...o, loading: false}));
        })
    };

    const editorOnChange = (doc) => {
        // console.log('onChange', doc);
        let content = doc?.content || [],
            heading = (content.find(i => i.type === 'heading')?.content || [])[0]?.text || '',
            cont = content.filter(i => i.type === 'paragraph').slice(0, 5).map(i => (i.content || [])[0]?.text || '').join(',');

        setState(o => ({...o, title: heading, abstract: cont.substring(0, 120), tags: cont.slice(0,5).split(''), content}));

    };

    editorRef.current = useEditor({
        extensions: [StarterKit],
        content: '',
        onChange: editorOnChange,
    });

    const getBaseInfoItems = () => {
        let panelStyle = {
            marginBottom: 24,
            background: '#F3FFF7',
            borderRadius: 4,
            border: 'none',
        };
        let ele = <div className={styles['list']}>
            <div className={styles['title']}>
                <Input value={state.title} placeholder='请输入稿件标题' showCount maxLength={64} onChange={e => setState(o => ({...o, title: e.target.value}))} />
            </div>
            <div className={styles['abstract']}>
                <Input.TextArea value={state.abstract} placeholder='请输入稿件摘要' showCount maxLength={128} style={{ height: 120, resize: 'none' }} onChange={e => setState(o => ({...o, abstract: e.target.value}))} />
            </div>
            <div className={styles['tags']}>
                <Tags value={state.tags} onChange={v => setState(o => ({...o, tags: v}))} />
            </div>
            <div className={styles['author']}>
                <Input value={state.author} placeholder='创建人' showCount maxLength={32} onChange={e => setState(o => ({...o, author: e.target.value}))} />
            </div>
        </div>;

        return [{
            key: '1',
            label: '基础信息',
            children: ele,
            style: panelStyle,
        }];
    };

    // 笔记保存
    const submit = () => {
        let {title, abstract, tags, author, content, type, id, configSha, configData, fileSha} = state,
            currentConfig = configData.find(i => i.id+'' === id+''),
            postData = {},
            now = dayjs().format('YYYY-MM-DD HH:mm:ss');

        if(id) {
            postData = {
                title,
                abstract,
                tags,
                author,
                content,
                type,
                created_at: currentConfig?.created_at || now,
                updated_at: now,
                id: currentConfig.id,
                configSha,
                configData,
                fileSha,
            };
        }else{
            postData = {
                title,
                abstract,
                tags,
                author,
                content,
                type,
                created_at: now,
                id: +new Date(),
                configSha,
                configData,
            }
        };

        setState(o => ({...o, submitting: true, loading: true}));
        request(SAVE_NOTE, {
            method: id ? 'put' : 'post',
            data: postData,
        }).then(response => {
            setState(o => ({...o, loading: false}));
            if(response?.code === 0) {
                message.success(`${id ? '更新' : '新建'}成功`);

                let t = setTimeout(() => {
                    clearTimeout(t);

                    history.push(`${BASEDIR}/${type}`);
                }, 1200);
            }else{
                setState(o => ({...o, submitting: false}));
                message.error(response?.message || `${id ? '更新' : '新建'}失败`)
            }
        }).catch(e => {
            setState(o => ({...o, submitting: false, loading: false}));
            message.error(e?.message || `${id ? '更新' : '新建'}失败。`)
        });
    };
    // 便签保存
    const submitMemo = () => {
        let {title, abstract, tags, author, content, id, memoSha, memoConfig, currentMemo} = state,
            postData = {memoSha, content: [], id},
            now = dayjs().format('YYYY-MM-DD HH:mm:ss');

        if(id) {
            postData['content'] = (memoConfig || []).map(item => {
                if(item.id+'' === id+'') {
                    return ({
                        id,
                        title,
                        abstract,
                        tags,
                        author,
                        content,
                        created_at: currentMemo.created_at || now,
                        updated_at: now,
                    });
                }

                return item;
            });
        }else{
            postData['content'] = [{
                id: +new Date(),
                title,
                abstract,
                tags,
                author,
                content,
                created_at: now,
                updated_at: now,
            }].concat(memoConfig);
        };

        setState(o => ({...o, submitting: true, loading: true}));
        request(SAVE_MEMO, {
            method: 'put',
            data: postData,
        }).then(response => {
            setState(o => ({...o, loading: false}));
            if(response?.code === 0) {
                message.success(`${id ? '更新' : '新建'}成功`);

                let t = setTimeout(() => {
                    clearTimeout(t);

                    history.push(`${BASEDIR}/scratch`);
                }, 1200);
            }else{
                setState(o => ({...o, submitting: false}));
                message.error(response?.message || `${id ? '更新' : '新建'}失败`)
            }
        }).catch(e => {
            setState(o => ({...o, submitting: false, loading: false}));
            message.error(e?.message || `${id ? '更新' : '新建'}失败。`)
        });
    };

    useEffect(() => {
        initEditor();

        return () => {
            editorRef.current = null;
        };
    }, []);
    useEffect(() => {
        setState(o => ({...o, author: props.userInfo?.login || '' }));
    }, [props.userInfo])

    return (
        <div className={styles['container']}>
            {state.loading ? <Loading position="absolute" tip="稍等片刻..." /> : null}

            <EditorRender
                editor={editorRef.current}
                className={styles['note-editor']}
                menuClassName={styles['note-editor-menu']}
                contentClassName={styles['note-editor-content']}
            />

            {
                state.type ?
                    <div className={styles['base-info']}>
                        <Collapse
                            bordered={false}
                            activeKey={state.activeKey}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                            style={{
                                background: '#CCFFE2',
                            }}
                            items={getBaseInfoItems()}
                            onChange={k => setState(o => ({...o, activeKey: k}))}
                        />
                    </div>
                    :
                    null
            }
            <div className={styles['submit']}>
                <Button type="primary" loading={state.submitting && state.loading} disabled={state.submitting} onClick={() => state.type ? submit() : submitMemo()}>提交</Button>
            </div>
        </div>
    );
}

const mapStateToProps = ({main}) => main;
const mapDispatchToProp = (dispatch) => {
    return {dispatch}
};
export default connect(mapStateToProps, mapDispatchToProp)(NoteEditor);