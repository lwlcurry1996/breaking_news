$(function () {
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1, //页码值 默认第一页
        pagesize: 2, //每页显示的数据
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
                //文章分页
                renderPage(res.total)
            }
        })
    }

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize,
            curr: q.pagenum,
            //分页发生切换的时候,触发jump的回调(有两种方式)
            //1.点击页码的时候 会触发jump回调
            //2.只要调用了laypage.render()方法,就会出发jump回调

            //自己定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8],

            jump: function (obj, first) {
                //obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的

                // console.log(first);
                // console.log(obj.curr);

                // 把最新的页码值，赋值到 q 这个查询参数对象
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //通过代理的形式,为删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })

    //编辑按钮的点击事件(事件委托)
    $('tbody').on('click', ".btn-edit", function () {
        // alert('11');
        var Id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?id=' + Id

    })


})