import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Table, Modal, Button, Dropdown, Tooltip, Tag, Input, message} from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, ExclamationCircleOutlined,  MoreOutlined
} from '@ant-design/icons';
import FilterForm from "@/components/FilterForm";
import { paginationConfig } from "@/config";
import { QUERY_QUOTATION_LIST_PAGE } from "@/config/url";
import request from '@/utils/request';
import {STATUS} from './config';
import styles from './index.module.scss';

export default () => {
    const initState = () => ({
            listData: [],
            loading: false,
            currentItem: {},


            pageNo: 1,
            pageSize: 10,
            total: 0,
        }),
        [state, setState] = useState(initState),
        [modal, contextHolder] = Modal.useModal(),
        history = useHistory();

    const getListData = (option={}) => {
        setState(o => ({...o, loading: true}));

        let defaultData = {
            projectName: '',
            status: '',
            pageNo: 1,
            pageSize: 10,
        };

        request(QUERY_QUOTATION_LIST_PAGE, {data: {...defaultData, ...option}}).then(response => {
            setState(o => ({...o, loading: false}));
            if(response?.code === '0') {
                let obj = response?.data || {};

                setState(o => ({...o, total: obj?.total || 0, listData: [{id:1, name:'汤姆', dept:'研发项目组', email:'tom***@qq.com', mobile:'132****2533', create_time:'2020-12-12 12:12:12', update_time:'2020-12-12 12:12:12', status:1}]}))
            }
        }).catch(e => {
            setState(o => ({...o, loading: false}));
        });
    };
    const columns = () => {
        return ([
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: '用户名',
                dataIndex: 'name',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => (
                    <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>
                ),
            },
            {
                title: '部门',
                dataIndex: 'dept',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => (
                    <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>
                ),
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => (
                    <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>
                ),
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => (
                    <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>
                ),
            },
            {
                title: '状态',
                dataIndex: 'status',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 180,
                /*
                    Safari 下 new Date('2020-11-16 12:12:12').getTime()会返回NaN
                    原因：Safari不支持 YYYY-MM-DD HH:MM:SS 这个时间格式，需要将此转换成 YYYY/MM/DD HH:MM:SS格式然后在进行转换
                */
                sorter: (a, b) => {
                    return (
                        +new Date(b.createTime.replace(/-/g, '/')) -
                        +new Date(a.createTime.replace(/-/g, '/'))
                    );
                },
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                width: 180,
                sorter: (a, b) => {
                    return (
                        +new Date(b.updateTime.replace(/-/g, '/')) -
                        +new Date(a.updateTime.replace(/-/g, '/'))
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'opt',
                className: 'table-ope',
                width: 110,
                fixed: 'right',
                render: (text, record, index) => {
                    let status = record.status,
                        optItem = [];

                    return (
                        <div className={styles['opt-td-btn']}>
                            <Tooltip title={'编辑'}><Button size="small" shape="circle" type="primary" onClick={editItem.bind(null, record)}>
                                <EditOutlined />
                            </Button></Tooltip>
                            <Dropdown
                                menu={{
                                    items: optItem,
                                    onClick: menuClick.bind(null, record),
                                }}
                                placement="bottomRight"
                            >
                                <Button size="small" shape="circle" onClick={e => e.stopPropagation()}>
                                    <MoreOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                    );
                },
            },
        ])
    }

    const confirmDelete = (row) => {
        return new Promise((resolve, reject) => {
            let t = setTimeout(() => {
                clearTimeout(t);

                resolve()
            }, 3000)
        });
    }
    const checkDelete = (record, e) => {
        e.stopPropagation();

        modal.confirm({
            title: `是否确认删除报价单 - ${record.name}?`,
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '是',
            cancelText: '否',
            onOk: () => confirmDelete(record),
            autoFocusButton: null,
        });
    }
    const editItem = (record, e) => {
        e.stopPropagation();
    };



    const menuClick = (record, {key, domEvent}) => {
        domEvent?.stopPropagation();

    };
    // 分页页面或pageSize改变后的回调
    const onPaginationChange = (page, pageSize) => {
        setState(o => ({...o, pageNo: page, pageSize}));

        getListData({pageNo: page, pageSize});
    }

    const onCancelSearch = () => {
        setState(o => ({...o, pageNo: 1}));
        getListData({pageNo: 1});
    };
    const onOkSearch = (options={}) => {
        setState(o => ({...o, pageNo: 1}));
        getListData({...options, pageNo: 1});
    };

    // didMount生命周期
    useEffect(() => {
        getListData();
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['search-form']}>
                <FilterForm
                    formItems={[
                        {name: 'projectName', label: '项目名称', placeholder: '输入项目名称搜索', type: 'input'},
                        {name: 'createTime', label: '创建时间', type: 'rangePicker', format: 'YYYY-MM-DD HH:mm:ss', formField: ['createTimeStart', 'createTimeEnd']},
                        {name: 'clientName', label: '客户名', placeholder: '输入客户名搜索', type: 'input'},
                        {name: 'status', label: '状态', placeholder: '选择状态搜索', type: 'select', options: STATUS},
                    ]}
                    onReset={onCancelSearch}
                    onConfirm={onOkSearch}
                />
            </div>
            <div className={styles['operate']}>
                <Button
                    type="primary"
                    onClick={() => {}}
                    icon={<PlusCircleOutlined />}
                >
                    新增笔记
                </Button>
            </div>
            <div className={styles['list']}>
                <div className={styles['list-content']}>
                    <div className={styles['table-content']}>
                        <div className={styles['table']}>
                            <Table
                                style={{ width: '100%' }}
                                columns={columns()}
                                dataSource={ state.listData || [] }
                                rowKey={i => i.id}
                                pagination={{
                                    ...paginationConfig,
                                    total: state?.total || 0,
                                    current: state.pageNo,
                                    pageSize: state.pageSize,
                                    onChange: onPaginationChange,
                                }}
                                scroll={{
                                    x: 1200,
                                }}
                                loading={state.loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}