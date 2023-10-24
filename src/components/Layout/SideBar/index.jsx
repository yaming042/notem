import { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import styles from './index.module.scss';

import Scratch from '@/assets/scratch.svg?react';
import Notes from '@/assets/notes.svg?react';
import Favorites from '@/assets/favorites.svg?react';
import Trash from '@/assets/trash.svg?react';


const baseMenuItems = [
    {url: '/scratch', title: '便签', icon: <Scratch />},
    {url: '/notes', title: '笔记', icon: <Notes />},
    {url: '/favorites', title: '收藏夹', icon: <Favorites />},
    {url: '/trash', title: '回收站', icon: <Trash />},
];
export default (props) => {
    const initState = () => ({
            activeKey: '',
            folder: [],
        }),
        [state, setState] = useState(initState),
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

        let data = [];
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
                                        <Link to={item.url} className={item.url.substring(1)}>
                                            {item.icon || null}
                                            {item.title}
                                        </Link>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                {
                    false ?
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
                        :
                        null
                }
            </div>
        </>
    );
};