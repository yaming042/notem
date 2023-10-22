// 页面
export const NOTFOUND = `${BASEDIR}/404`;
export const FORBIDDEN = `${BASEDIR}/403`;
export const LOGIN = `${BASEDIR}/login`;
export const USER_MANAGE = `${BASEDIR}/user-list`;
export const RESET_PWD = ``;
export const ACCOUNT = ``;




export const VALIDATE = `/api/bdyp/validate`;
export const GET_AUTHOR_TOKEN = `/api/bdyp/token`;
export const QUERY_FILE_LIST = `/api/bdyp/list`;
export const NEW_DIR = `/api/bdyp/newdir`;
export const QUERY_DOC_LIST = `/api/bdyp/doclist`;
export const QUERY_DOC_INFO = `/api/bdyp/docinfo`;

// 接口
// 登录
export const SUBMIT_LOGIN = `/api/bdyp/login`;
export const SEND_CAPTCHA = `/api/admin/sms/login-send`;
export const SUBMIT_LOGIN_PHONE = `/api/admin/phone-login`;
export const UPDATE_PHONE = `/api/admin/updatePhone`;
export const UPDATE_PASSWORD = `/api/admin/updatePassword`;
export const LOGOUT = `/api/admin/logout`;
export const QUERY_USER_MODULE = `/api/admin/user/{userId}/modules`;


// 用户
export const ADD_USER = `/api/admin/user`;
export const QUERY_USER_LIST_PAGE = `/api/admin/user/users`;
export const QUERY_USER_LIST = `/api/admin/user/users`;
export const QUERY_USER_INFO = `/api/admin/loginUserInfo`;
export const UPDATE_USER = `/api/admin/user/{userId}`;

// 角色
export const QUERY_ROLE_LIST = `/api/admin/role/roles`;
export const QUERY_ROLE_LIST_PAGE = `/api/admin/role/pages`;
export const ADD_ROLE = `/api/admin/role`;
export const UPDATE_ROLE = `/api/admin/role/{roleId}`;
export const QUERY_ROLE_INFO = `/api/admin/role/{roleId}`;
export const UPDATE_ROLE_MODULES = `/api/admin/role/{roleId}/modules`;
export const QUERY_ROLE_MODULES = `/api/admin/role/{roleId}/modules`;
export const QUERY_ROLE_USERS = `/api/admin/role/{roleId}/users`;

// 权限
export const QUERY_MODULE_LIST = `/api/admin/module/modules`;
export const QUERY_MODULE_LIST_PAGE = `/api/admin/module/pages`;
export const ADD_MODULE = `/api/admin/module`;
export const UPDATE_MODULE = `/api/admin/module/{moduleId}`;
export const QUERY_MODULE_INFO = `/api/admin/module/{moduleId}`;

// 客户管理
export const QUERY_CUSTOMER_LIST = `/api/admin/client/clients`;
export const QUERY_CUSTOMER_LIST_PAGE = `/api/admin/client/pages`;
export const ADD_CUSTOMER = `/api/admin/client`;
export const QUERY_CUSTOMER_INFO = `/api/admin/client/{clientId}`;
export const UPDATE_CUSTOMER = `/api/admin/client/{clientId}`;
export const UPDATE_CUSTOMER_LEVEL = `/api/admin/client/{clientId}/auth-level`;
export const QUERY_CUSTOMER_LOG_LIST = `/api/admin/client/{clientId}/communication`;
export const ADD_CUSTOMER_LOG = `/api/admin/client/{clientId}/communication`;
export const DELETE_CUSTOMER_LOG = `/api/admin/client/communication/deleteById/{id}`;

// 供应商管理
export const QUERY_SUPPLIER_LIST = `/api/admin/supplier/suppliers`;
export const QUERY_SUPPLIER_LIST_PAGE = `/api/admin/supplier/pages`;
export const ADD_SUPPLIER = `/api/admin/supplier`;
export const QUERY_SUPPLIER_INFO = `/api/admin/supplier/{supplierId}`;
export const UPDATE_SUPPLIER = `/api/admin/supplier/{supplierId}`;

// 分类管理
export const QUERY_CATEGORY_TREE = `/api/admin/category/categoryTree`;
export const DELETE_CATEGORY = `/api/client/category/{categoryId}`;
export const ADD_CATEGORY = `/api/admin/category`;
export const QUERY_CATEGORY_INFO = ``;
export const UPDATE_CATEGORY = `/api/admin/category/{categoryId}`;
export const UPDATE_CATEGORY_SORT = `/api/admin/category/sort`;

// 产品管理
export const QUERY_PRODUCT_LIST_PAGE = `/api/admin/product/pages`;
export const ADD_PRODUCT = `/api/admin/product`;
export const QUERY_PRODUCT_INFO = `/api/admin/product/{productId}`;
export const UPDATE_PRODUCT = `/api/admin/product/{productId}`;
export const BATCH_EXPORT_PRODUCT = `/api/admin/export/product`;
export const BATCH_IMPORT_PRODUCT = `/api/admin/import/product`;
export const QUERY_PRODUCT_CATEGORY = `/api/admin/product/category/{categoryId}`; // 查询分类下所有商品
export const SWITCH_PRODUCT_STATUS = `/api/admin/product/{productId}/inclusionStatus/{inclusionStatus}`;

// 报价单管理
export const QUERY_QUOTATION_LIST_PAGE = `/api/admin/quotation/pages`;
export const ADD_QUOTATION = `/api/admin/quotation`;
export const QUERY_QUOTATION_INFO = `/api/admin/quotation/{quotationId}/quotation-detail`;
export const UPDATE_QUOTATION = `/api/admin/quotation`;
export const QUERY_PRODUCT_BY_CATEGORY_ID = `/api/admin/product/categorys`;
export const MONEY_CALC = `/api/admin/quotation/calc`;
export const SWITCH_QUOTATION_STATUS = `/api/admin/quotation/{quotationId}/status/{status}`;
export const GET_QUOTATION_ID = `/api/admin/quotation/code`;

// 文件上传
export const UPLOAD_FILE = `/api/admin/file`;