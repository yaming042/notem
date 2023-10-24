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
const Memo = lazy(() => import('@/Pages/Memo'));
const FileList = lazy(() => import('@/Pages/FileList'));
// const Account = lazy(() => import('@/Pages/Account'));
const NotFound = lazy(() => import('@/Pages/NotFound'));
const NoteEditor = lazy(() => import('@/Pages/NoteEditor'));

let userInfo = {
    "login": "yaming042",
    "id": 16408997,
    "node_id": "MDQ6VXNlcjE2NDA4OTk3",
    "avatar_url": "https://avatars.githubusercontent.com/u/16408997?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/yaming042",
    "html_url": "https://github.com/yaming042",
    "followers_url": "https://api.github.com/users/yaming042/followers",
    "following_url": "https://api.github.com/users/yaming042/following{/other_user}",
    "gists_url": "https://api.github.com/users/yaming042/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/yaming042/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/yaming042/subscriptions",
    "organizations_url": "https://api.github.com/users/yaming042/orgs",
    "repos_url": "https://api.github.com/users/yaming042/repos",
    "events_url": "https://api.github.com/users/yaming042/events{/privacy}",
    "received_events_url": "https://api.github.com/users/yaming042/received_events",
    "type": "User",
    "site_admin": false,
    "name": null,
    "company": null,
    "blog": "",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 51,
    "public_gists": 0,
    "followers": 0,
    "following": 0,
    "created_at": "2015-12-23T03:35:06Z",
    "updated_at": "2023-10-21T04:55:18Z",
    "private_gists": 0,
    "total_private_repos": 0,
    "owned_private_repos": 0,
    "disk_usage": 46399,
    "collaborators": 0,
    "two_factor_authentication": false,
    "plan": {
        "name": "free",
        "space": 976562499,
        "collaborators": 0,
        "private_repos": 10000
    }
};

function App(props) {
    const initState = () => ({
            loading: false,
            errorMsg: '',
        }),
        [state, setState] = useState(initState),
        dispatch = props.dispatch;

    // 校验用户状态，有效就返回用户信息及权限；无效则去登录
    const validate = () => {
        dispatch({
            type: SET_USER_INFO,
            value: userInfo
        });

        setState(o => ({...o, loading: false}));
        return;
        request(VALIDATE).then(response => {
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
        validate();
    }, []);

    return (
        !state.loading ?
            <Router>
                <Layout>
                    <Suspense fallback={<SuspenseLoading/>}>
                        <Switch>
                            <Route exact path={`${BASEDIR}/login`} component={Login} />
                            <Route exact path={`${BASEDIR}/scratch`} component={Memo} />
                            <Route exact path={`${BASEDIR}/notes`} component={FileList} />
                            <Route exact path={`${BASEDIR}/favorites`} component={FileList} />
                            <Route exact path={`${BASEDIR}/trash`} component={FileList} />

                            {/* <Route exact path={`${BASEDIR}/account`} component={Account} /> */}
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


