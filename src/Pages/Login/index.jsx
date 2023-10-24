import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import request from '@/utils/request';
import {getParameterByName} from '@/utils';

import styles from './index.module.scss';


export default (props) => {
    const initState = () => ({
            code: '',
        }),
        [state, setState] = useState(initState);

    const toLogin = () => {
        let client_id = '18c2c94ee9c6ceb11646',
            redirect_uri = 'http://localhost:5713/login',
            scope = encodeURIComponent('repo user'),
            sta = 'lo98w0er4',
            url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${sta}`

        location.href = url;
        // window.open(url, '_blank', 'height=300,width=600');
    };

    const getToken = () => {
        let {code} = state;

        if(code) {
            let client_id = '18c2c94ee9c6ceb11646',
                client_secret = 'f3714a4cb1c017a2e37218442213a4dd506cf2e2',
                query = encodeURIComponent(`client_id=${client_id}&client_secret=${client_secret}&code=${code}`),
                url = `https://github.com/login/oauth/access_token?${query}`;
                
            request(`/api/gh/authorize?code=${code}`).then(response => {
                console.log(response)
            }).catch(e => {
                console.log(e);
            });
        }
    };

    useEffect(() => {
        let code = getParameterByName('code');
        code && setState(o => ({...o, code}));
    }, [])

    return (
        <div className={styles['container']}>
            <div className={styles['login-form']}>
                <div className={styles['form-left']}>
                    <div className={styles['logo']}>
                        <img src={`${BASEDIR}/images/logo.png`} alt="" />
                        NOTE<sup>m</sup>
                    </div>
                    <div className={styles['display-img']}>
                        <img src={`${BASEDIR}/images/login-left.png`} alt="" />
                    </div>
                </div>
                <div className={styles['form-right']}>
                    <div className={styles['h2']}>欢迎使用</div>
                    <div className={styles['h3']}>我的笔记</div>
                    <div className={styles['form']}>
                        <Button type="primary" onClick={toLogin}>GitHub登录</Button>
                    </div>

                    {state.code ? <Button type="primary" onClick={getToken}>获取token</Button> : null}
                </div>
            </div>
        </div>
    );
};