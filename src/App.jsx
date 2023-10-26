import React, {useEffect, useState, Suspense, lazy} from 'react';
import {Modal, Button, Input, message} from 'antd';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Layout from './components/Layout';
import SuspenseLoading from './components/Layout/Suspense';
import request from '@/utils/request';
import {QUERY_USER_INFO, QUERY_REPO_INFO, CREATE_REPO} from '@/config/url';
import {SET_USER_INFO} from '@/utils/constant';
import Cookies from 'js-cookie';

const Login = lazy(() => import('@/Pages/Login'));
const Memo = lazy(() => import('@/Pages/Memo'));
const FileList = lazy(() => import('@/Pages/FileList'));
const NotFound = lazy(() => import('@/Pages/NotFound'));
const NoteEditor = lazy(() => import('@/Pages/NoteEditor'));

function App(props) {
    const initState = () => ({
            loading: location.pathname !== `${BASEDIR}/login`,
            errorMsg: '',
            showRepo: false,
            creating: false,
            waiting: false,
            repoDesc: '',
        }),
        [state, setState] = useState(initState),
        dispatch = props.dispatch;

    const delayToHome = () => {
        setState(o => ({...o, errorMsg: `应用异常，即将跳转至登录页`}));

        let t = setTimeout(() => {
            clearTimeout(t);

            location.href = `${BASEDIR}/login`;
        }, 1500);
    }

    const newRepo = () => {
        setState(o => ({...o, creating: true}));

        request(CREATE_REPO, {method: 'post'}).then(response => {
            setState(o => ({...o, creating: false, waiting: true}));

            if(response?.code === 0) {
                message.success(`创建成功，即将开启你的笔记之旅`);

                let t = setTimeout(() => {
                    clearTimeout(t);

                    setState(o => ({...o, showRepo: false, waiting: false}));
                }, 1500);
            }
        }).catch(e => {
            message.error(e?.message || `仓库创建失败，请稍后重试`);
            setState(o => ({...o, creating: false, waiting: false}));
        })
    };

    // 校验用户状态，有效就返回用户信息及权限；无效则去登录
    const validate = async () => {
        if(location.pathname === `${BASEDIR}/login`) {
            setState(o => ({...o, loading: false}));
            return;
        }

        try{
            let userResponse = await request(QUERY_USER_INFO);
            if(userResponse?.code === 0) {
                let result = userResponse?.data || {};

                // 记录用户信息
                dispatch({
                    type: SET_USER_INFO,
                    value: result
                });

                result?.login && Cookies.set('owner', result.login, {expires: 7});
            }else{
                delayToHome();
                return;
            }

            try{
                await request(QUERY_REPO_INFO);
                setState(o => ({...o, loading: false, showRepo: false}));
            }catch(e){
                if(e?.code === -404) {
                    setState(o => ({...o, loading: false, showRepo: true}));
                }
            }
        }catch(e){
            delayToHome();
        };
    };

    // 这是入口文件，页面间切换不会触发，只有应用首次加载时才会触发
    useEffect(() => {
        validate();
    }, []);

    return (
        !state.loading && !state.showRepo ?
            <Router>
                <Layout>
                    <Suspense fallback={<SuspenseLoading/>}>
                        <Switch>
                            <Route exact path={`${BASEDIR}/login`} component={Login} />
                            <Route exact path={`${BASEDIR}/scratch`} component={Memo} />
                            <Route exact path={`${BASEDIR}/notes`} component={FileList} />
                            <Route exact path={`${BASEDIR}/favorites`} component={FileList} />
                            <Route exact path={`${BASEDIR}/trash`} component={FileList} />

                            <Route exact path={`${BASEDIR}/editor`} component={NoteEditor} />
                            <Redirect from={BASEDIR || '/'} to={`${BASEDIR}/scratch`} />

                            <Route component={NotFound} />
                        </Switch>
                    </Suspense>
                </Layout>
            </Router>
            :
            (
                state.showRepo ?
                    <Modal
                        title="创建仓库"
                        maskClosable={false}
                        closable={false}
                        open={true}
                        footer={[
                            <Button disabled={state.waiting || state.loading} key="confirm" type="primary" loading={state.creating} onClick={newRepo}>
                                创建仓库
                            </Button>,
                            ]}
                    >
                        <p style={{marginBottom:12,fontSize:12,color:'#666'}}>您还未创建笔记仓库，点击下面「创建仓库」按钮创建仓库，仓库创建成功后即可开始你的笔记旅程</p>
                        <Input.TextArea
                            placeholder="给仓库加个简短的描述吧（默认描述：我的笔记）"
                            showCount
                            maxLength={128}
                            onChange={e => setState(o => ({...o, repoDesc: e.target.value.trim()}))}
                            style={{ height: 120, resize: 'none', marginBottom: 24 }}
                        />
                    </Modal>
                    :
                    <SuspenseLoading tip={state.errorMsg || '初始化中...'} />
            )
    );
}


function mapDispatchToProp(dispatch) {
    return {
        dispatch
    }
}
export default connect(null, mapDispatchToProp)(App);


