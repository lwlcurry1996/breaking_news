$(function () {
    var form = layui.form
    var q = {
        pagenum: 1, //页码值 默认第一页
        pagesize: 4, //每页显示的数据
        cate_id: '', //文章分类id
        state: '', //发布的状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable()
    initCate()

    //为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        //获取表单中选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //查询参数为对象 p中的属性赋值
        q.cate_id = cate_id
        q.state = state

        //根据最新的筛选条件,重新渲染表格中的数据
        initTable()
    })

    //分类选项封装
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                //调用模板引擎分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染表单中的ui结构
                form.render()
            }
        })
    }

    //分装获取文章列表数据的函数
    // var layer = layui.layer
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // console.log(res);
                //使用模板渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }







})