import React, { useState, useEffect } from 'react';
import { Button, Spin, message } from 'antd';
import request from '@/utils/request';
import {getParameterByName} from '@/utils';
import GitHubIcon from '@/assets/github.svg?react';
import styles from './index.module.scss';


export default (props) => {
    const initState = () => ({
            getTokening: false,
        }),
        [state, setState] = useState(initState);

    const toLogin = () => {
        let redirect_uri = location.origin + location.pathname,
            scope = encodeURIComponent('repo user'),
            sta = `notem_${+new Date()}`,
            url = `https://github.com/login/oauth/authorize?client_id=${GH_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}&state=${sta}`

        location.href = url;
    };

    const getToken = (code='', sta='') => {
        if(code && sta) {
            request(`/api/gh/authorize?code=${code}&state=${sta}`).then(response => {
                if(response?.code === 0) {
                    message.success(`授权成功，页面即将刷新`);
                    let t = setTimeout(() => {
                        clearTimeout(t);

                        location.href = `${BASEDIR}/scratch`;
                    }, 1200);
                }
            }).catch(e => {
                console.log(e);
            });
        }else{
            message.warning(`获取授权失败，请重试`);
            let t = setTimeout(() => {
                clearTimeout(t);

                location.href = `${BASEDIR}/login`;
            }, 1500);
        }
    };

    useEffect(() => {
        let code = getParameterByName('code'),
            sta = getParameterByName('state');

        if(code && sta) {
            setState(o => ({...o, getTokening: true}));
            getToken(code, sta)
        }
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
                        {
                            state.getTokening ?
                                <Spin className='spin' tip="因为github网络原因，会出现授权失败的情况，可以刷新页面重新授权">
                                    <div style={{width:200}}></div>
                                </Spin>
                                :
                                <>
                                    <div className="github">
                                        <GitHubIcon/>
                                    </div>
                                    <Button type="primary" block onClick={toLogin}>GitHub登录</Button>
                                </>
                        }
                    </div>

                    <div className={styles['footer']}>
                        <p>还没有GitHub账号？<a href="https://github.com/signup" target="_blank">立即注册GitHub</a></p>
                    </div>

                    {state.code ? <Button type="primary" onClick={getToken}>获取token</Button> : null}
                </div>
            </div>
        </div>
    );
};