import { useState, useEffect } from "react";
import { Table, Modal, Button, Dropdown, Tooltip, Tag, Input, message} from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { EDITOR, TRANSFORM_SCRATCH, QUERY_FILE_INFO, DELETE_SCRATCH } from '@/config/url';
import { useHistory } from 'react-router-dom';
import request from '@/utils/request';
import dayjs from "dayjs";
import Loading from '@/components/Layout/Suspense';
import styles from './index.module.scss';

export default () => {
    const initState = () => ({
            listData: [],
            loading: true,
            memoSha: '',
            memoConfig: [],
        }),
        [state, setState] = useState(initState),
        [modal, contextHolder] = Modal.useModal(),
        history = useHistory();

    // 获取配置文件嘻嘻
    const getConfig = (type) => {
        return request(`${QUERY_FILE_INFO}?path=${encodeURIComponent(`${type}/config.json`)}`)
    };
    // 新建稿件
    const newNote = () => {
        history.push(`${EDITOR}`);
    };
    // 获取标签配置文件，也就是标签列表
    const getMemoList = () => {
        request(`${QUERY_FILE_INFO}?path=memo.json`).then(response => {
            setState(o => ({...o, loading: false}));
            if(0 === response?.code) {
                let data = response?.data || {},
                    content = decodeURIComponent(escape(atob(data?.content ||''))),
                    listData = [],
                    memoSha = data?.sha || '';

                try{
                    listData = JSON.parse(content);
                }catch(e){}

                setState(o => ({...o, listData, memoConfig: listData.slice(0), memoSha}));
            }else{
                message.error(response?.message || '获取数据失败');
            }
        }).catch(e => {
            setState(o => ({...o, loading: false}));
        });
    };

    // 请求接口删除
    const confirmDelete = (row) => {
        let {memoConfig, memoSha} = state,
            id = row.id,
            postData = {
                memoConfig: memoConfig.filter(i => i.id+'' !== id+''),
                memoSha,
                id,
            };

        return new Promise((resolve, reject) => {
            request(DELETE_SCRATCH, {
                method: 'put',
                data: postData,
            }).then(response => {
                if(response?.code === 0) {
                    message.success(`已删除便签 - ${row.title || ''}`);

                    // 重新拉取列表
                    getMemoList();
                    resolve();
                }else{
                    message.error(response?.message || `操作失败`);
                    reject();
                }
            }).catch(e => {
                message.error(e?.message || `操作失败。`);
                reject();
            });
        });

    }
    // 删除二次确认
    const checkDelete = (record, e) => {
        modal.confirm({
            title: `删除便签 - ${record.title}?`,
            icon: <ExclamationCircleOutlined />,
            content: '此删除操作会直接删除源数据，请谨慎操作',
            okText: '删除',
            cancelText: '取消',
            onOk: () => confirmDelete(record),
            autoFocusButton: null,
            okButtonProps: {
                danger: true,
            }
        });
    }

    // 保存稿件
    const saveNote = (item, type, configSha, configData) => {
        let {memoConfig, memoSha} = state,
            {title, abstract, tags, author, content, created_at} = item,
            postData = {},
            now = dayjs().format('YYYY-MM-DD HH:mm:ss');

        postData = {
            title,
            abstract,
            tags,
            author,
            content,
            type,
            created_at,
            updated_at: now,
            id: +new Date(),
            configSha,
            configData,

            memoConfig: (memoConfig || []).filter(i => i.id+'' !== item.id+''),
            memoSha,
        };

        setState(o => ({...o, loading: true}));
        request(TRANSFORM_SCRATCH, {
            method: 'post',
            data: postData,
        }).then(response => {
            setState(o => ({...o, loading: false}));
            if(response?.code === 0) {
                message.success(`已保存至${type === 'notes' ? '笔记' : '收藏夹'}`);

                // 重新拉取列表
                getMemoList();
            }else{
                message.error(response?.message || `操作失败`)
            }
        }).catch(e => {
            setState(o => ({...o, loading: false}));
            message.error(e?.message || `操作失败。`)
        });
    };

    const saveToNote = (item, e) => {
        e.stopPropagation();

        getConfig('notes').then(configResponse => {
            if(0 === configResponse?.code) {
                let data = configResponse?.data || {},
                    content = decodeURIComponent(escape(atob(data?.content || ''))),
                    configSha = data?.sha || '',
                    configData = [];

                try{
                    configData = JSON.parse(content);
                }catch(e){}

                saveNote(item, 'notes', configSha, configData);
            }
        }).catch(e => {
        });
    };
    const saveToLike = (item, e) => {
        e.stopPropagation();

        getConfig('favorites').then(configResponse => {
            if(0 === configResponse?.code) {
                let data = configResponse?.data || {},
                    content = decodeURIComponent(escape(atob(data?.content ||''))),
                    configSha = data?.sha || '',
                    configData = [];

                try{
                    configData = JSON.parse(content);
                }catch(e){}

                saveNote(item, 'favorites', configSha, configData);
            }
        }).catch(e => {

        });
    };
    const saveToTrash = (item, e) => {
        e.stopPropagation();

        // 便签是直接删除的，不进回收站
        checkDelete(item);
    };

    useEffect(() => {
        getMemoList();
    }, []);

    return (
        <div className={styles['container']}>
            {state.loading ? <Loading position="absolute" tip="稍等片刻..." /> : null}

            <div className={styles['new']}>
                <Button type="primary" icon={<PlusOutlined />} onClick={newNote}>新建便签</Button>
            </div>
            <div className={styles['file-container']}>

                {
                    (state.listData || []).map((item, index) => {

                        return (
                            <div
                                key={item.id}
                                className={styles['file-item']}
                                onClick={() => history.push(`${EDITOR}?id=${item.id}`)}
                            >
                                <div className={styles['icon']}>
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                        <path d="M396.8 839.111111c-45.511111 0-89.6-17.066667-123.733333-51.2-32.711111-32.711111-51.2-76.8-51.2-123.733333 0-46.933333 18.488889-91.022222 51.2-123.733334l197.688889-199.111111c11.377778-11.377778 28.444444-11.377778 39.822222 0 11.377778 11.377778 11.377778 28.444444 0 39.822223L312.888889 578.844444c-22.755556 22.755556-35.555556 52.622222-35.555556 83.911112s12.8 61.155556 35.555556 83.911111c46.933333 46.933333 122.311111 46.933333 167.822222 0l285.866667-285.866667c14.222222-14.222222 22.755556-34.133333 22.755555-55.466667s-8.533333-41.244444-22.755555-55.466666c-31.288889-31.288889-81.066667-31.288889-110.933334 0L403.911111 601.6c-15.644444 15.644444-15.644444 41.244444 0 56.888889s41.244444 15.644444 56.888889 0L654.222222 465.066667c11.377778-11.377778 28.444444-11.377778 39.822222 0 11.377778 11.377778 11.377778 28.444444 0 39.822222L500.622222 698.311111c-38.4 38.4-99.555556 38.4-136.533333 0-38.4-38.4-38.4-99.555556 0-136.533333l251.733333-251.733334c52.622222-52.622222 137.955556-52.622222 192 0 25.6 25.6 39.822222 59.733333 39.822222 95.288889s-14.222222 69.688889-39.822222 95.288889L521.955556 787.911111c-34.133333 34.133333-79.644444 51.2-125.155556 51.2z" fill="#27e76c"></path>
                                    </svg>
                                </div>
                                <div className={styles['header']}>{item.title || ''}</div>
                                <div className={styles['body']}>
                                    <div className={styles['time']}>{item.created_at}</div>
                                    <div className={styles['content']}>{item.abstract || ''}</div>
                                </div>
                                <div className={styles['opt-btn']}>
                                    <Tooltip title="保存至笔记">
                                        <Button type="dashed" size="small" onClick={saveToNote.bind(null, item)}>
                                            <img src="/images/notes.png" alt="" style={{width:13,height:12}} />
                                            笔记
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="保存至收藏夹">
                                        <Button type="dashed" size="small" onClick={saveToLike.bind(null, item)}>
                                            <img src="/images/favorites.png" alt="" style={{width:13,height:12}} />
                                            收藏
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="删除">
                                        <Button type="dashed" size="small" onClick={saveToTrash.bind(null, item)}>
                                            <img src="/images/trash.png" alt="" style={{width:13,height:12}} />
                                            删除
                                        </Button>
                                    </Tooltip>
                                </div>
                            </div>
                        );
                    })
                }

            </div>

            {contextHolder}
        </div>
    );
};