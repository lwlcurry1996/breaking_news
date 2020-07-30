//设置路径
var baseURL = 'http://ajax.frontend.itheima.net'

//拦截/过虐每一次ajax请求没配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;
    console.log(options.url);
})