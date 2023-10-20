import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';
import {LOGIN} from '@/config/url';
import Cookies from 'js-cookie';

export default function request(url, options = {}) {
    let CancelToken = axios.CancelToken,
        source = CancelToken.source(),
        isUrlEncoded = options.contentType === 'application/x-www-form-urlencoded',
        isFormData = options.contentType === 'multipart/form-data',
        requestUrl = url;

    if((!options.method || options.method?.toUpperCase === 'GET') && options.data && Object.keys(options.data).length) {
        requestUrl += `?${qs.stringify(options.data || {})}`;
    }

    let ajaxOption = {
        url: requestUrl,
        method: options.method || 'GET', // 默认 get
        baseURL: ``, // baseURL 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
        headers: {
            'Content-Type': options.contentType || 'application/json'
        },
        data: isUrlEncoded ? qs.stringify(options.data || {}) : (isFormData ? options.data : JSON.stringify(options.data || {})), // 'PUT', 'POST', 和 'PATCH'时body的参数
        timeout: options.timeout || 60000, // 超时时间 60秒
        responseType: options.responseType || 'json', // 表示服务器响应的数据类型
        cancelToken: source.token
    };

    return new Promise((resolve, reject) => {
        let defaultError = {code: 101, data: null, message: '请求异常'},
            responseError = {code: 102, data: null, message: '响应异常'},
            sessionError = {code: 103, data: null, message: '登录信息过期或身份未认证'};

        axios(ajaxOption)
            .then((response) => {
                // data就是后端接口返回的整体
                let {data=defaultError, status: responseStatus} = response || {},
                    {code, message: msg} = data;

                if(200 === responseStatus) {
                    if(code !== 0 && typeof data !== 'string') {
                        source.cancel(`请重新登录`);
                        if(code === -2){ // 登录信息过期或身份未认证，如果已经是login页那就不用跳了
                            if(location.pathname != LOGIN) {
                                // 未登录，且不是登录页，就跳转到登录页
                                // return window.location.href = `${LOGIN}?redirect=${encodeURIComponent(location.href)}`;
                                Cookies.remove('userId');
                                return window.location.href = LOGIN;
                            }else{
                                // 已经是登录页了，就不做任何处理
                                return reject(data);
                            }
                        }else{
                            message.error(msg || '异常');
                        }

                        // code ！== 0，说明后端正确处理了，直接返回后端的数据
                        return reject(data);
                    }

                    resolve(data);
                }else{
                    message.error(`[${url}]: 响应异常`);
                    reject(responseError);
                }
            })
            .catch(error => {
                source.cancel(`网络请求错误`);
                message.error(`${url} : ${error.message || '请求异常，请检查网络后重试'}`);
                reject(defaultError);
            });
    });
}
