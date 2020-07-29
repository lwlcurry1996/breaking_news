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

})