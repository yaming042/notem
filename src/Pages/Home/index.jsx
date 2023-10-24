import { useState, useEffect } from "react";
import { Table, Modal, Button, Dropdown, Tooltip, Tag, Input, message} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EDITOR, QUERY_FILE_LIST } from '@/config/url';
import { useHistory } from 'react-router-dom';
import request from '@/utils/request';
import dayjs from "dayjs";
import styles from './index.module.scss';


export default () => {
    const initState = () => ({
        listData: [],
        loading: true,
        currentItem: {},
        type: location.pathname.substring(1),

        pageNo: 1,
        pageSize: 10,
        total: 0,
    }),
    [state, setState] = useState(initState),
    [modal, contextHolder] = Modal.useModal(),
    history = useHistory();

    const getUserInfo = () => {
        request('/api/gh/user');
    };
    const getRepoInfo = () => {
        request('/api/gh/repo?owner=yaming042');
    };
    const newRepo = () => {
        request('/api/gh/repo', {
            method: 'post',
            data: {
                owner: 'yaming042',
                desc: '测试API新建仓库'
            },
        });
    };
    const getDirList = () => {
        request('/api/gh/dirlist');
    };
    const getFileList_1 = () => {
        request('/api/gh/filelist');
    };
    const getFile = () => {
        request('/api/gh/file');
    };
    const updateFile = () => {
        request('/api/gh/file', {method:'put'});
    };
    const newFile = () => {
        request('/api/gh/file', {method:'post'});
    };
    const deleteFile = () => {
        request('/api/gh/file', {method:'delete'});
    };
    const newDir = () => {
        request('/api/gh/dir', {method:'post'})
    };
    const updateDir = () => {
        request('/api/gh/dir', {method:'put'})
    };
    const deleteDir = () => {
        request('/api/gh/dir', {method:'delete'})
    };

    // 新建稿件
    const newNote = () => {
        let {type} = state;
        history.push(`${EDITOR}?type=${type}`);
    };
    // 获取指定分类下的稿件列表
    const getFileList = (type='') => {
        request(`${QUERY_FILE_LIST}?type=${type}`).then(response => {
            setState(o => ({...o, loading: false}));
            if(0 === response?.code) {
                setState(o => ({...o, listData: response?.data || []}));
            }else{
                message.error(response?.message || '获取数据失败');
            }
        }).catch(e => {
            setState(o => ({...o, loading: false}));
        });
    };

    useEffect(() => {
        let {type} = state;
        getFileList(type);
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['new']}>
                <Button type="primary" icon={<PlusOutlined />} onClick={newNote}>新建便签</Button>
            </div>
            <div className={styles['search-container']}></div>
            <div className={styles['file-container']}>

                {
                    (state.listData || []).map((item, index) => {

                        return (
                            <div
                                key={item.id}
                                className={styles['file-item']}
                                onClick={() => history.push(`${EDITOR}?type=${state.type}&id=${item.id}`)}
                            >
                                <div className={styles['header']}>{item.title || ''}</div>
                                <div className={styles['body']}>
                                    <div className={styles['time']}>{item.created_at}</div>
                                    <div className={styles['content']}>{item.abstract || ''}</div>
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