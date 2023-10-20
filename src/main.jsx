import React from 'react';
import ReactDOM from 'react-dom/client';

import {Provider} from 'react-redux';
import store from '@/store';

import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn'); // 全局使用简体中文

import App from './App';
import './index.css';



ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider
        locale={zhCN}
        theme={{
            token: {
                colorPrimary: '#007BFF',
            },
            components: {
                Menu: {
                    itemBg: '#000000',
                    itemColor: '#fff',
                    subMenuItemBg: '#141414',
                    itemSelectedColor: '#fff',
                    itemActiveBg: '#007BFF',
                    itemSelectedBg: '#007BFF',
                    itemHoverBg: '#007BFF',
                    itemHoverColor: '#fff',

                    darkItemBg: '#000000',
                    darkItemColor: '#fff',
                    darkSubMenuItemBg: '#141414',
                    darkItemHoverBg: '#007BFF',
                }
            }
        }}
    >
        <Provider store={store}>
            <App />
        </Provider>
    </ConfigProvider>
)
