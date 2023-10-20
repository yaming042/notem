import { useState, useEffect } from "react";
import { Table, Modal, Button, Dropdown, Tooltip, Tag, Input, message} from "antd";
import {QUERY_FILE_LIST} from '@/config/url';
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
        request(QUERY_FILE_LIST).then(response => {
            setState(o => ({...o, loading: false, listData: (response?.data?.list || [])}));
        }).catch(e => {
            setState(o => ({...o, loading: false}));
        })
    };

    useEffect(() => {
        getFileList();
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['search-container']}>

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