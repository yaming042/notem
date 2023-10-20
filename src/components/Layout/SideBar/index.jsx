import { useState, useEffect } from 'react';
import { Menu, Layout, Skeleton, theme } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { menuArray } from '@/config';
import { mapMenuWithKey, deepCopy } from '@/utils';
import styles from './index.module.scss';

const baseMenuItems = [
    {url: '/scratch', title: '便签', icon: ''},
    {url: '/notes', title: '笔记', icon: ''},
    {url: '/favorites', title: '收藏夹', icon: ''},
    {url: '/trash', title: '回收站', icon: ''},
];
export default (props) => {
    const initState = () => ({
            activeKey: '',
            folder: [],
        }),
        [state, setState] = useState(initState),
        {token} = theme.useToken(),
        history = useHistory();

    // 点击菜单条目
    const onMenuClick = ({ key }) => history.push(key);

    // 设置菜单的选中项和展开项
    const setMenuConfig = (pathname) => setState(o => ({...o, activeKey: pathname}));

    // 生命周期
    useEffect(() => {
        setMenuConfig(location.pathname);

        // 监听路由变化，重新设置菜单的选中项及展开项
        const unListen = history.listen((params) => {
            setMenuConfig(params.pathname);
        });

        let data = [
            {id: 1, name: '文件夹1', desc: '文件夹111111111', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
            {id: 2, name: '文件夹2', desc: '文件夹222222222', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
            {id: 3, name: '文件夹3', desc: '文件夹333333333', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
            {id: 4, name: '文件夹4', desc: '文件夹444444444', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
            {id: 5, name: '文件夹4', desc: '文件夹444444444', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
            {id: 6, name: '文件夹4', desc: '文件夹444444444', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
            {id: 7, name: '文件夹4', desc: '文件夹444444444', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
            {id: 8, name: '文件夹4', desc: '文件夹444444444', created_at: '2020-12-12 12:12:12', updated_at: '2020-12-12 12:12:12'},
        ];
        setState(o => ({...o, folder: data}));

        return () => {
            // 组件卸载
            unListen();
        }
    }, []);

    return (
        <>
            <div className={styles['menu-container']}>
                <div className={styles['menu-group']}>
                    <div className={styles['menu-title']}>
                        <div className={styles['label']}>我的笔记</div>
                    </div>
                    <div className={styles['menu-list']}>
                        {
                            baseMenuItems.map(item => {
                                return (
                                    <div
                                        key={item.url}
                                        className={`${styles['menu-item']}${state.activeKey === item.url ? ' active' : ''}`}
                                    >
                                        <Link to={item.url}>{item.title}</Link>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className={`${styles['menu-group']} ${styles['menu-group-grow']}`}>
                    <div className={styles['menu-title']}>
                        <div className={styles['label']}>文件夹</div>
                        <div className={styles['opt']}>+</div>
                    </div>
                    <div className={styles['menu-list']}>
                        {
                            (state.folder || []).map((item, index) => {

                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles['menu-item']}${state.activeKey === '/folder/'+item.id ? ' active' : ''}`}
                                    >
                                        <Link to={`/folder/${item.id}`}>
                                            <div className={styles['icon']}></div>
                                            <div className={styles['name']}>{item.name}</div>
                                            <div className={styles['opt']}></div>
                                        </Link>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
};