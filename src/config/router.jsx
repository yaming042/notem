import {lazy} from 'react';
import * as URL from './url';

const UserList = lazy(() => import('@/Pages/UserList'));

/*
    1. url 必须，没有url的话那key就得必须
    2. auth 不是必须，只有 array 才是有效的值，非数组都等效于不需要权限，空数组会永远没有权限，针对数组值，可以是url也可以是约定好的key
    3. menuHidden 不是必须，true - 不需要在菜单展示
    4. layout 不是必须，null === layout时不应用任何布局，其余应用默认布局
*/
export default [
    {
        url: URL.ACCOUNT,
        icon: '',
        label: '个人中心',
        component: UserList,
        menuHidden: true, // 是否在菜单中隐藏
        // auth: [], // [key1, key2]
    },
    {
        url: URL.LOGIN,
        icon: '',
        label: '登录页',
        component: UserList,
        menuHidden: true,
        layout: null,
    },
    {
        url: URL.NOTFOUND,
        icon: '',
        label: '404',
        component: UserList,
        menuHidden: true,
        // layout: null,
    },
    {
        url: URL.FORBIDDEN,
        icon: '',
        label: '403',
        component: UserList,
        menuHidden: true,
        // layout: null,
    },
    {
        url: URL.USER_MANAGE,
        icon: '',
        label: '用户列表',
        component: UserList,
    },
    // {
    //     key: 'rygl',
    //     url: '',
    //     icon: '',
    //     label: '人员管理',
    //     children: [
    //         {
    //             url: URL.CUSTOMER_MANAGE,
    //             icon: '',
    //             label: '客户管理',
    //             component: UserList,
    //         },
    //         {
    //             url: URL.USER_MANAGE,
    //             icon: '',
    //             label: '用户管理',
    //             component: UserList,
    //         },
    //     ]
    // },
    // {
    //     key: 'xtgl',
    //     url: '',
    //     icon: '',
    //     label: '系统管理',
    //     children: [
    //         {
    //             url: URL.ROLE_MANAGE,
    //             icon: '',
    //             label: '角色管理',
    //             component: UserList,
    //         },
    //         {
    //             url: URL.AUTH_MANAGE,
    //             icon: '',
    //             label: '权限管理',
    //             component: UserList,
    //         },
    //     ],
    // },
]