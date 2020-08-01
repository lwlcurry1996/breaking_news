$(function () {
    //获取layui提供的成员
    var form = layui.form;
    //自定义form验证规则
    form.verify({
        //密码长度
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //新密码和旧密码不能相同
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与旧密码相同!'
            }
        },
        //密码二次验证
        rePwd: function (value) {
            if (value !== $('[name=oldPwd]').val()) {
                return '两次输入的密码不一致'
            }
        }

    })
    //修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                } else {
                    layui.layer.msg('密码修改成功!即将跳转到登录页重新登陆');
                    setTimeout(function () {
                        window.parent.href()
                    }, 3000)
                    $('.layui-form')[0].reset()

                }
            }

        })
    })

})