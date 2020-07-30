$(function () {
    // alert('11');
    //点击事件注册页面显示
    //点击去注册按钮,登录框隐藏,
    $('#link_reg').on('click', function () {
        $('.link_box').hide()
        $('.reg-box').show()
    })

    //点击去登录,注册隐藏,
    $('#link_login').on('click', function () {
        $('.link_box').show()
        $('.reg-box').hide()
    })

    //定义表单的验证规则利用layui
    var form = layui.form
    form.verify({
        //密码正则
        pwd: [/^\S{6,12}$/, '密码为6-12位,不能有空格特殊字符'],
        //确认密码正则
        repwd: function (value) {
            var paw = $('#reg-pwd').val()
            if (paw !== value) {
                return '两次密码输入不一样'
            }
        }
    })

    //注册功能
    var layer = layui.layer

    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            // data: $('#form_reg').serialize(),
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                //注册失败提示
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //注册成功提示
                layer.msg(res.message);
                //切换到a连接 跳转到登录页
                $('#link_login').click()
                //清空注册表单
                $('#form_reg')[0].reset()
            }
        })
    })

    //登录功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                //注册失败提示
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //注册成功提示
                layer.msg(res.message);
                //保存token
                localStorage.setItem('token', res.token)
                //跳转到后台首页
                location.href = "/index.html"
            }
        })
    })
})