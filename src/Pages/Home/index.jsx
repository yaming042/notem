import { useState, useEffect } from "react";
import { Table, Modal, Button, Dropdown, Tooltip, Tag, Input, message} from "antd";
import {QUERY_FILE_LIST, QUERY_DOC_LIST, QUERY_DOC_INFO} from '@/config/url';
import request from '@/utils/request';
import dayjs from "dayjs";
import styles from './index.module.scss';


export default () => {
    const initState = () => ({
        listData: [],
        loading: true,
        currentItem: {},


        pageNo: 1,
        pageSize: 10,
        total: 0,
    }),
    [state, setState] = useState(initState),
    [modal, contextHolder] = Modal.useModal();

    const getFileList = () => {
        request('/api/gh/repo?owner=yaming042').then(response => {
            
        }).catch(e => {
            
        });
    };

    const newRepo = () => {
        request('/api/gh/repo', {
            method: 'post',
            data: {
                owner: 'yaming042',
                desc: '测试API新建仓库'
            },
        }).then(response => {

        }).catch(e => {

        });
    };

    const initRepo = () => {
        request('/api/gh/init', {
            method: 'put',
        }).then(response => {

        }).catch(e => {

        });
    };
    const getMainSha = () => {
        request('/api/gh/test')
    };
    const newDir = () => {
        request('/api/gh/dir', {method:'post'})
    };

    useEffect(() => {
        // getFileList();
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['search-container']}>
                <Button type="primary" onClick={newRepo}>新建仓库</Button>
                <Button type="primary" onClick={initRepo}>初始化仓库</Button>
                <Button type="primary" onClick={getMainSha}>获取主分支Sha值</Button>
                <Button type="primary" onClick={newDir}>新建文件夹</Button>
            </div>
            <div className={styles['file-container']}>

                {
                    (state.listData || []).map((item, index) => {

                        return (
                            <div
                                key={item.fs_id}
                                className={styles['file-item']}
                            >
                                <div className={styles['header']}>{item.server_filename || ''}</div>
                                <div className={styles['body']}>
                                    <div className={styles['time']}>{dayjs(item.server_mtime*1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                                    <div className={styles['content']}></div>
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