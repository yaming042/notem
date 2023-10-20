import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { Button, Spin, Upload, Input, Row, Col, Form, message } from 'antd';
import { QUERY_USER_INFO, UPDATE_USER, UPLOAD_FILE, LOGIN } from '@/config/url';
import FileUpload from "@/components/FileUpload";
import request from '@/utils/request';
import {deepCopy, mobileReg, string2Hash} from '@/utils';
import {SET_USER_INFO} from '@/utils/constant';
import styles from './index.module.scss';
import Cookies from 'js-cookie';

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

const getImageObj = (images = '') => {
    return (images || '').split(',').filter(Boolean).map((item, index) => {
        let uuid = string2Hash(item);

        return ({
            uid: uuid,
            name: `${index}_image`,
            status: 'done',
            url: item,
        });
    });
};
const getFormValue = (userData = {}) => {
    return {
        username: userData.username || undefined,
        name: userData.name || undefined,
        phone: userData.phone || undefined,
        avatar: getImageObj(userData.avatar || ''),
    }
};

const Account = (props) => {
    const initState = () => ({
            loading: true,
            submitting: false,

            username: '',
            isEdit: false,
            uploading: false,
            userInfo: {},
            form: {},
        }),
        [state, setState] = useState(initState),
        [messageApi, contextHolder] = message.useMessage(),
        [form] = Form.useForm();

    const getUserInfo = () => {
        request(QUERY_USER_INFO).then(response => {
            setState(o => ({ ...o, loading: false }));
            if (response?.code === '0') {
                setState(o => ({ ...o, userInfo: response?.data || {} }));
            }
        }).catch(e => {
            setState(o => ({ ...o, loading: false }));
        })
    }

    const cancelEdit = () => {
        form.resetFields();
        setState(o => ({ ...o, isEdit: false }));
    }
    const confirmEdit = () => {
        let {userInfo} = state;

        form.validateFields().then(values => {
            setState(o => ({ ...o, submitting: true }));

            let postData = deepCopy(values),
                url = UPDATE_USER.replace(/\{userId\}/, userInfo.id || '');

            postData['avatar'] = (postData['avatar'] || []).map(i => i.url).join(',');

            request(url, { method: 'post', data: postData }).then(response => {
                setState(o => ({ ...o, submitting: false }));
                if (response?.code === '0') {
                    message.success(`更新成功`);
                    setState(o => ({ ...o, isEdit: false }));

                    props.dispatch && props.dispatch({
                        type: SET_USER_INFO,
                        value: {...state.userInfo, ...postData},
                    });
                }
            }).catch(e => {
                setState(o => ({ ...o, submitting: false }));
            })
        }).catch(e => {
            console.log(e);
        })
    }

    useEffect(() => {
        getUserInfo();
    }, []);
    useEffect(() => {
        let formData = getFormValue(state.userInfo);
        setState(o => ({ ...o, form: formData }));
        form.setFieldsValue(formData);
    }, [state.userInfo]);

    return (
        <div className={styles['container']}>
            <div className={styles['title']}>基本设置</div>
            <div className={styles['content']}>
                <Row>
                    <Col span={10}>
                        <div className={styles['left']}>
                            <Form
                                disabled={!state.isEdit}
                                form={form}
                                initialValues={state.form}
                                {...layout}
                            >
                                <Form.Item
                                    label="账户ID"
                                >
                                    <div>{state?.userInfo?.id || '--'}</div>
                                </Form.Item>
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    rules={[
                                        {required: true, message: '请输入用户名'}
                                    ]}
                                >
                                    <Input placeholder="请输入用户名(登录时使用)" />
                                </Form.Item>
                                <Form.Item
                                    label="姓名"
                                    name="name"
                                    rules={[
                                        {required: true, message: '请输入真实姓名'}
                                    ]}
                                >
                                    <Input placeholder="请输入真实姓名" />
                                </Form.Item>
                                <Form.Item
                                    label="手机号码"
                                    name="phone"
                                    rules={[
                                        {required: true, message: '请输入手机号码'},
                                        { validator: (_, value) => {
                                            if(value && !mobileReg.test(value)) {
                                                return Promise.reject(`请填写正确的手机号`);
                                            }
                                            return Promise.resolve();
                                        }},
                                    ]}
                                >
                                    <Input placeholder="请输入手机号码" />
                                </Form.Item>
                                <Form.Item
                                    name="avatar"
                                    label="头像"
                                >
                                    <FileUpload
                                        multiple={true}
                                        limit={1}
                                        action={UPLOAD_FILE}
                                        accept="image/*"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="注册时间"
                                >
                                    <div>{state?.userInfo?.createTime || '--'}</div>
                                </Form.Item>
                            </Form>
                            <div className={styles['submit']}>
                                {
                                    state.isEdit ?
                                        <>
                                            <Button onClick={cancelEdit}>取消</Button>
                                            <Button type="primary" onClick={confirmEdit}>保存</Button>
                                        </>
                                        :
                                        <Button type="primary" onClick={() => setState((o) => ({ ...o, isEdit: true }))}>编辑</Button>
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

function mapDispatchToProp(dispatch) {
    return {
        dispatch
    }
}
function mapStateToProp({main}) {
    return {
        collapsed: main.collapsed,
    }
}
export default connect(mapStateToProp, mapDispatchToProp)(Account);