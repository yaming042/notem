import { useState, useEffect } from "react";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MessageOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import {SUBMIT_LOGIN_PHONE, SEND_CAPTCHA} from '@/config/url';
import styles from './index.module.scss';

// 倒计时
function startCountdown(totalSeconds, callback) {
    let remainingSeconds = totalSeconds;

    function updateCountdown() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            callback(remainingSeconds);
            setTimeout(updateCountdown, 1000); // 每秒更新一次
        } else {
            callback(0); // 倒计时结束，传递0给回调函数
        }
    }

    updateCountdown(); // 开始倒计时
}
export default (props) => {
    const timeLimit = 60,
        [time, setTime] = useState(timeLimit),
        [sending, setSending] = useState(false),
        [counting, setCounting] = useState(false),
        [loading, setLoading] = useState(false),
        [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        request(SUBMIT_LOGIN_PHONE, {method: 'post', data: values}).then(response => {
            setLoading(false);

            if(response?.code === '0') {
                Cookies.set('_login', true);
                location.href = BASEDIR+'/';
            }else{
                console.log(response?.message || '失败');
            }
        }).catch(e => {
            setLoading(false);
        });
    };

    const sendCaptcha = () => {
        let phone = form.getFieldValue('phone');
        if(!phone) {
            message.warning(`请填写手机号`);
            return;
        }
        if(sending || counting) return;

        setSending(true);

        request(SEND_CAPTCHA, {method:'post', data: {phone}}).then(response => {
            if(response?.code === '0') {
                setSending(false);
                setCounting(true);

                startCountdown(timeLimit, (v) => {
                    setTime(v || timeLimit);

                    if(!v) {
                        setTime(timeLimit);
                        setCounting(false);
                    }else{
                        setTime(v);
                    }
                });
            }else{
                setSending(false);
                setCounting(false);
                message.warning(response?.message);
            }
        }).catch(e => {
            setSending(false);
            setCounting(false);
        });
    }

    return (
        <Form
            form={form}
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
        >
            <Form.Item
                name="phone"
                rules={[
                    {
                        required: true,
                        message: '请填写手机号码',
                    },
                    { validator: (_, value) => {
                        if(value && !mobileReg.test(value)) {
                            return Promise.reject(`请填写正确的手机号`);
                        }
                        return Promise.resolve();
                    }},
                ]}
            >
                <Input prefix={<MobileOutlined className="site-form-item-icon" />} placeholder="请填写手机号码" />
            </Form.Item>
            <Form.Item
                name="smsCode"
                rules={[
                    {
                        required: true,
                        message: '请输入验证码',
                    },
                ]}
            >
                <Input
                    prefix={<MessageOutlined className="site-form-item-icon" />}
                    addonAfter={
                        <div className={styles['getCode']} onClick={sendCaptcha}>
                            {sending ? '发送中...' : ''}
                            {counting ? `${time}s 后重试` : ''}
                            {!sending && !counting ? '获取验证码' : ''}
                        </div>
                    }
                    placeholder="请输入验证码"
                />
            </Form.Item>
            <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Form.Item>
        </Form>
    );
}