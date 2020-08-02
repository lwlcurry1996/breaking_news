$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    $('#file').on('change', function (e) {
        var file = e.target.files[0];
        //用原生js的方法 在内存中生成一个图片路径
        var newImgURL = URL.createObjectURL(file)
        //把裁剪的图片渲染到裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    
    //更换头像 上传到服务器
    $('#btnUpload').on('click', function () {
        //获取base64的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //ajax
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                //返回校验
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('头像上传成功')
                window.parent.getUserInfo()
            }
        })
    })


})