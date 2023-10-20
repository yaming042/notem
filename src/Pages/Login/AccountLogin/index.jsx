import { useState, useEffect } from "react";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MessageOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import {SUBMIT_LOGIN} from '@/config/url';
import styles from './index.module.scss';

export default (props) => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        request(SUBMIT_LOGIN, {method: 'post', data: values}).then(response => {
            setLoading(false);

            if(response?.code === '0') {
                location.href = BASEDIR+'/';
            }else{
                message.error(response?.message || '失败');
            }
        }).catch(e => {
            setLoading(false);
        });
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="请输入密码"
                />
            </Form.Item>
            <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Form.Item>
        </Form>
    );
}