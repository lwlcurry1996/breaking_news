//设置路径
var baseURL = 'http://ajax.frontend.itheima.net'

//拦截/过滤每一次ajax请求没配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;
    // console.log(options.url);

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //所有的请求完成之后要进行身份验证
    options.complete = function (res) {
        var data = res.responseJSON;
        // console.log(data);
        if (data.status == 1 && data.message == '身份认证失败！') {
            //删除本地token
            localStorage.removeItem('token')
            //清除完之后页面跳转
            location.href = '/login.html'
        }
    }
})