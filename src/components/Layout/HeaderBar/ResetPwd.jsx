import { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Select, Button, message } from "antd";
import request from '@/utils/request';
import {RESET_PWD} from '@/config/url';
import {mobileReg} from '@/utils';
import styles from './index.module.scss';

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
}

export default (props) => {
    const initState = () => ({
            open: props.open || false,
            userInfo: props.userInfo || {},
        }),
        [state, setState] = useState(initState),
        [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();

        props.onCancel && props.onCancel();
    };
    const onConfirm = () => {
        let {userInfo} = state;
        form.validateFields().then(values => {
            request(RESET_PWD, {method: 'post', data: {id: userInfo?.id, password: values.password}}).then(response => {
                if(response?.code === '0') {
                    message.success(`重置密码成功`);

                    form.resetFields();
                    props.onOk && props.onOk();
                }else{
                    console.log(response?.message);
                }
            })
        }).catch(e => {});
    };

    useEffect(() => {
        setState(o => ({ ...o, open: props.open, userInfo: props.userInfo || {} }));

    }, [props]);

    return (
        <Modal
            title={`重置密码`}
            open={state.open}
            onCancel={props.onCancel}
            className={styles['dialog']}
            footer={null}
        >
            <Form
                form={form}
                initialValues={{password: undefined, confirmPwd: undefined}}
                {...layout}
            >
                <Form.Item
                    name="phone"
                    label="手机号码"
                >
                    <div>{state.userInfo?.phone}</div>
                </Form.Item>
                <Form.Item
                    label="新密码"
                    name="password"
                    rules={[
                        {min: 6, max: 18, message: '请输入6 - 18位密码'}
                    ]}
                >
                    <Input.Password placeholder="请输入新密码" />
                </Form.Item>
                <Form.Item
                    label="再次输入密码"
                    name="confirmPwd"
                    dependencies={['password']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不同'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="请再次输入新密码" />
                </Form.Item>

                <div className={styles['submit']}>
                    <Button onClick={onReset}>取消</Button>
                    <Button onClick={onConfirm} type="primary">确定</Button>
                </div>
            </Form>
        </Modal>
    );
}