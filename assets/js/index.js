$(function () {
    //调用函数(获取用户信息)
    getUserInfo()

    //获取layer
    var layer = layui.layer
    //点击按钮实现退出功能
    $('#btnLogout').on('click', function () {
        //弹出提示框
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            //删除本地token 清除登录信息
            localStorage.removeItem('token')
            //清除完之后页面跳转
            location.href = '/login.html'

            layer.close(index);

        });
    })

    //封装获取用户信息函数
    function getUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            //jquery中的ajax 专门设置请求头的信息属性
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                //调用用户渲染函数
                renderUser(res.data)
            }
        })
    }

    //封装用户渲染函数
    function renderUser(user) {
        //渲染用户名
        var uname = user.nickname || user.username;
        $('#welcome').html('欢迎&nbsp;&nbsp;' + uname);
        //渲染用户头像
        if (user.user_pic !== null) {
            $('.layui-nav-img').show().attr('src', user.user_pic)
            $('.text-avatar').hide();
        } else {
            $('.layui-nav-img').hide()
            $('.text-avatar').show().html(uname[0].toUpperCase())
        }

    }
})