// 页面
export const NOTFOUND = `${BASEDIR}/404`;
export const FORBIDDEN = `${BASEDIR}/403`;
export const LOGIN = `${BASEDIR}/login`;
export const HOME = `${BASEDIR}/`;
export const EDITOR = `${BASEDIR}/editor`;


export const API_PREFIX = `/api`;
// 接口
export const VALIDATE = `${API_PREFIX}/gh/user`; // 获取用户信息/判断用户是否已经登录
export const QUERY_FILE_LIST = `${API_PREFIX}/gh/filelist`; // 获取文件夹下文件列表
export const SAVE_NOTE = `${API_PREFIX}/gh/file`; // 保存稿件
export const SAVE_MEMO = `${API_PREFIX}/gh/memofile`; // 保存便签
export const TRANSFORM_SCRATCH = `${API_PREFIX}/gh/file`; // 保存便签 - 逻辑和保存稿件放在一起了
export const QUERY_FILE_INFO = `${API_PREFIX}/gh/file`; // 获取指定路径的文件内容
export const DELETE_SCRATCH = `${API_PREFIX}/gh/memo`; // 更新memo.json内容，删除时其实就是更新memo.json的过程


export const LOGOUT = ``; // 退出登录