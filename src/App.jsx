import React, {useEffect, useState, Suspense, lazy} from 'react';
import {message} from 'antd';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Layout from './components/Layout';
import SuspenseLoading from './components/Layout/Suspense';
import request from '@/utils/request';
import {VALIDATE} from '@/config/url';
import {SET_USER_INFO} from '@/utils/constant';

const Login = lazy(() => import('@/Pages/Login'));
const Home = lazy(() => import('@/Pages/Home'));
const FileList = lazy(() => import('@/Pages/FileList'));
const Account = lazy(() => import('@/Pages/Account'));
const NotFound = lazy(() => import('@/Pages/NotFound'));
const NoteEditor = lazy(() => import('@/Pages/NoteEditor'));

function App(props) {
    const initState = () => ({
            loading: false,
            errorMsg: '',
        }),
        [state, setState] = useState(initState),
        dispatch = props.dispatch;

    // 校验用户状态，有效就返回用户信息及权限；无效则去登录
    const validate = () => {
        request('/api/gh/user').then(response => {
            if(response?.code === 0) {
                let result = response?.data || {};
                // 记录用户信息
                dispatch({
                    type: SET_USER_INFO,
                    value: result
                });

                setState(o => ({...o, loading: false}));
            }else{
                message.error(response?.message || '应用异常');
                setState(o => ({...o, errorMsg: response?.message || '应用异常'}));
            }
        }).catch(e => {
            setState(o => ({...o, errorMsg: e?.message || '应用异常'}));
        });
    };

    // 这是入口文件，页面间切换不会触发，只有应用首次加载时才会触发
    useEffect(() => {
        // validate();
    }, []);

    return (
        !state.loading ?
            <Router>
                <Layout>
                    <Suspense fallback={<SuspenseLoading/>}>
                        <Switch>
                            <Route exact path={`${BASEDIR}/login`} component={Login} />
                            <Route exact path={`${BASEDIR}/scratch`} component={Home} />
                            <Route exact path={`${BASEDIR}/notes`} component={FileList} />
                            <Route exact path={`${BASEDIR}/favorites`} component={FileList} />
                            <Route exact path={`${BASEDIR}/trash`} component={FileList} />

                            <Route exact path={`${BASEDIR}/folder/:id`} component={FileList} />

                            <Route exact path={`${BASEDIR}/account`} component={Account} />
                            <Route exact path={`${BASEDIR}/editor`} component={NoteEditor} />
                            <Redirect from={BASEDIR || '/'} to={`${BASEDIR}/scratch`} />
                            <Route component={NotFound} />
                        </Switch>
                    </Suspense>
                </Layout>
            </Router>
            :
            <SuspenseLoading tip={state.errorMsg || '初始化中...'} />
    );
}


function mapDispatchToProp(dispatch) {
    return {
        dispatch
    }
}
export default connect(null, mapDispatchToProp)(App);


