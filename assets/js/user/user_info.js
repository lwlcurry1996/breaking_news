$(function () {
    //定义校验规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入昵称不要超过6个字符'
            }
        }
    })

    //初始化用户信息
    initUserInfo();

    function initUserInfo() {
        //发送ajax请求
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //展示用户信息
                form.val('formUserInfo', res.data)
            }

        })
    }

    //重置 只接受click事件绑定
    $('#btnReset').on('click', function (e) {
        //取消表单功能
        e.preventDefault()
        //初始化用户信息
        initUserInfo()
    })

    //提交用户修改
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        //ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!')
                } else {
                    layer.msg('恭喜您.信息更新成功')
                    window.parent.getUserInfo()
                }
            }
        })
    })
})