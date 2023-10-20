本地启动
npm run dev

构建生产版本
npm run build


#### 权限处理逻辑
在 入口文件 中做登录状态的请求，顺便也可以请求回用户权限相关的信息



#### 菜单权限
菜单权限通过props传递进组件，到底是store还是父组件props传递都可以




## 开始
1. 页面浏览器icon，自行在 index.html 中配置即可
2. 页面的TDK在index.html中已经占位，具体值可以在环境变量文件中配置，注意区分环境
3. 修改布局
    1. src/App.jsx 修改入口文件 布局 文件的引用源
    2. 新增对应的 布局 组件，比如src/App.jsx中 import Layout from '@/component/Layout2'，那么就在components新增Layout2文件夹，代码参考现有布局修改就行
4. 应用使用了 react-router-cache-route ，其实就是支持路由缓存 src/App.jsx 中渲染路由的时候 when={p => false} 不启用缓存，如果有需要缓存的路由，可以修改这里，when及cacheKey的用法参照官方文档即可 https://github.com/CJY0208/react-router-cache-route/blob/master/README_CN.md ，另外使用这个组件会默认多一个 div 元素，默认这个div的类名是 route-container ，当然也可以自定义