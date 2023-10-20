import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, LockOutlined, MobileOutlined, MessageOutlined } from '@ant-design/icons';
import AccountImage from '@/assets/account_login.png';
import WxImage from '@/assets/wx_login.png';
import MobileImage from '@/assets/mobile_login.png';
import {SUBMIT_LOGIN, VALIDATE, SEND_CAPTCHA, SUBMIT_LOGIN_PHONE, GET_AUTHOR_TOKEN} from '@/config/url';
import request from '@/utils/request';
import Cookies from 'js-cookie';
import {mobileReg} from '@/utils';

// 账号登录表单
import AccountForm from './AccountLogin';
// 手机验证码登录表单

import styles from './index.module.scss';


export default (props) => {
    const initState = () => ({
            code: '',
        }),
        [state, setState] = useState(initState);

    const toLogin = () => {
        let appKey = 'SVbKFCPzGzDDAfEZMcciMak9DPmLu0DX';
        let redirect_uri = 'oob';
        let appId = '41419500';
        let url = `http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=${appKey}&redirect_uri=${redirect_uri}&scope=basic,netdisk&device_id=${appId}`

        window.open(url)
    };

    const getToken = () => {
        let {code} = state;

        if(code) {
            request(`${GET_AUTHOR_TOKEN}?code=${code}`).then(response => {
                console.log(response)
            }).catch(e => {
                console.log(e);
            });
        }
    };

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
                        <Button onClick={toLogin}>去登录</Button>

                        <Input placeholder='填入code' onChange={e => setState(o => ({...o, code: e.target.value}))}/>
                        <Button onClick={getToken}>获取token</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};