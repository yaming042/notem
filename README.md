本地启动
npm run dev

构建生产版本
npm run build

需要一个环境配置文件，格式如下
NODE_ENV='development'
VITE_BASEDIR=''
VITE_PROXY='[{"src":"/api","target":"http://localhost:3333"}]'
VITE_GH_CLIENT_ID=''

VITE_WEB_TITLE=''
VITE_WEB_DESCRIPTION=''
VITE_WEB_KEYWORDS=''
