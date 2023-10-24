import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Table, Modal, Button, Dropdown, Tooltip, Tag, Input, message} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, ExclamationCircleOutlined,  MoreOutlined
} from '@ant-design/icons';
import FilterForm from "@/components/FilterForm";
import { paginationConfig } from "@/config";
import { EDITOR, QUERY_FILE_LIST } from "@/config/url";
import request from '@/utils/request';
import styles from './index.module.scss';

export default () => {
    const initState = () => ({
            listData: [],
            listDataBak: [],
            loading: false,
            currentItem: {},
            type: location.pathname.substring(1),


            pageNo: 1,
            pageSize: 10,
            total: 0,
        }),
        [state, setState] = useState(initState),
        [modal, contextHolder] = Modal.useModal(),
        history = useHistory();

    // 请求列表数据
    const getListData = (type='') => {
        setState(o => ({...o, loading: true}));

        request(QUERY_FILE_LIST, {data: {type: type || state.type}}).then(response => {
            setState(o => ({...o, loading: false}));
            if(0 === response?.code) {
                let obj = response?.data || [];

                setState(o => ({
                    ...o,
                    total: obj?.length || 0,
                    listData: (obj || []).slice(0),
                    listDataBak: (obj || []).slice(0),
                }));
            }
        }).catch(e => {
            setState(o => ({...o, loading: false}));
        });
    };
    // 表格列
    const columns = () => {
        return ([
            {
                title: '标题',
                dataIndex: 'title',
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
                title: '摘要',
                dataIndex: 'abstract',
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
                title: '标签',
                dataIndex: 'tags',
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
                title: '创建人',
                dataIndex: 'author',
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
                title: '创建时间',
                dataIndex: 'created_at',
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
                dataIndex: 'updated_at',
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
    // 新建稿件
    const newNote = () => {
        let {type} = state;
        history.push(`${EDITOR}?type=${type}`);
    };
    // 请求接口删除
    const confirmDelete = (row) => {
        return new Promise((resolve, reject) => {
            let t = setTimeout(() => {
                clearTimeout(t);

                resolve()
            }, 3000)
        });
    }
    // 删除二次确认
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
    // 编辑条目
    const editItem = (record, e) => {
        e.stopPropagation();
    };
    // 表格操作项
    const menuClick = (record, {key, domEvent}) => {
        domEvent?.stopPropagation();

    };
    // 分页页面或pageSize改变后的回调
    const onPaginationChange = (page, pageSize) => {
        setState(o => ({...o, pageNo: page, pageSize}));

        getListData({pageNo: page, pageSize});
    }
    // 取消搜索
    const onCancelSearch = () => {
        let {listDataBak} = state;

        setState(o => ({...o, pageNo: 1, listData: listDataBak.slice(0), total: listDataBak.length}));
    };
    // 开始搜索
    const onOkSearch = (options={}) => {
        let {listDataBak} = state,
            keyword = options.keyword || '',
            btime = options.btime || '',
            etime = options.etime || '',
            listData = (listDataBak || []).filter(item => {
                if(!keyword) return true;

                return (item.title || '').indexOf(keyword) !== -1 || (item.abstract || '').indexOf(keyword) !== -1;
            }).filter(item => {
                let time = +new Date(item.created_at);

                if(btime && etime) {
                    return (+new Date(btime)) <= time && time <= (+new Date(etime));
                }

                return true;
            });

        setState(o => ({...o, pageNo: 1, listData, total: listData.length}));
    };

    // didMount生命周期
    useEffect(() => {
        getListData();

        let unListen = history.listen((params) => {
            let type = params.pathname.substring(1);
            getListData(type);
        });

        return () => {
            unListen();
        }
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['search-form']}>
                <FilterForm
                    formItems={[
                        {name: 'keyword', label: '关键字', placeholder: '输入关键字(标题、摘要)搜索', type: 'input'},
                        {name: 'created_at', label: '创建时间', type: 'rangePicker', format: 'YYYY-MM-DD HH:mm:ss', formField: ['btime', 'etime']},
                    ]}
                    onReset={onCancelSearch}
                    onConfirm={onOkSearch}
                />
            </div>
            {
                state.type === 'trash' ?
                    null
                    :
                    <div className={styles['operate']}>
                        <Button
                            type="primary"
                            onClick={newNote}
                            icon={<PlusOutlined />}
                        >
                            新建稿件
                        </Button>
                    </div>
            }
            <div className={styles['list']}>
                <div className={styles['list-content']}>
                    <div className={styles['table-content']}>
                        <div className={styles['table']}>
                            <Table
                                style={{ width: '100%' }}
                                columns={columns()}
                                size="small"
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

            {contextHolder}
        </div>
    );
}