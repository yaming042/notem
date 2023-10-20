import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Dropdown, Badge, Button, message} from 'antd';
import { LogoutOutlined, UserOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';
import { ACCOUNT, LOGOUT, LOGIN } from '@/config/url';
import request from '@/utils/request';
import ResetPwd from './ResetPwd';
import styles from './index.module.scss';


const HeaderBar = (props) => {
    const [userInfo, setUserInfo] = useState({});
    const [pwdOpen, setPwdOpen] = useState(false);
    const history = useHistory();

    const accountDropdownItems = () => {
        let name = userInfo?.baidu_name || '',
            char = name.charAt().toUpperCase();

        return [
            {
                key: '1',
                className: styles['text'],
                label: (<div className={styles['user-name']}>
                    <span>
                        {
                            userInfo?.avatar_url ? <img src={userInfo?.avatar_url || ''} />:char
                        }
                    </span>
                    <div>{name}</div>
                </div>)
            },
            {
                type: 'divider'
            },
            {
                key: 'account',
                label: (<div className={styles['menu-item-content']}>
                    <UserOutlined />
                    个人中心
                </div>),
            },
            {
                key: 'resetPwd',
                label: (<div className={styles['menu-item-content']}>
                    <LockOutlined />
                    重置密码
                </div>),
            },
            {
                key: 'logout',
                label: (<div className={styles['menu-item-content']}>
                    <LogoutOutlined />
                    退出登录
                </div>),
            }
        ]
    }

    const logout = () => {
        request(LOGOUT).then(response => {
            if(response?.code === '-2') {
                window.location.href = LOGIN;
            }else{
                message.error(response?.message || '退出失败')
            }
        });
    }

    const accountMenuClick = ({key}) => {
        if('account' === key){
            history.push(ACCOUNT);
        }else if('logout' === key){
            console.log(`退出登录`);
            logout();
        }else if('resetPwd' === key) {
            setPwdOpen(true);
        }
    };

    useEffect(() => {
        setUserInfo(props.userInfo || {});
    }, [props.userInfo]);

    return (
        <div className={styles['header']}>
            <div className={styles['logo']}>
                <a href={BASEDIR}>NOTE<sup>m</sup></a>
            </div>
            <div className={styles['operation']}>
                <div className={styles['account']}>
                    <Dropdown
                        menu={{
                            items: accountDropdownItems(),
                            onClick: accountMenuClick
                        }}
                        placement="bottomRight"
                        arrow
                    >
                        <Badge>
                            <div className={styles['avatar']}>
                                {
                                    userInfo?.avatar_url ?
                                        <img src={userInfo?.avatar_url || ''} />
                                        :
                                        (userInfo?.baidu_name || '').charAt().toUpperCase()
                                }
                            </div>
                        </Badge>
                    </Dropdown>
                </div>
            </div>


            <ResetPwd
                open={pwdOpen}
                userInfo={userInfo}
                onCancel={() => setPwdOpen(false)}
                onOk={() => {location.href = LOGIN}}
            />
        </div>
    );
};

const mapStateToProps = ({main}) => main;
const mapDispatchToProp = (dispatch) => {
    return {dispatch}
};

export default connect(mapStateToProps, mapDispatchToProp)(HeaderBar);