$(function () {
    var form = layui.form
    var layer = layui.layer
    //渲染文章分类
    initCate();
    // 初始化富文本编辑器
    initEditor()

    //渲染文章分类封装
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //重新渲染form数据域页面同步 
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //确定发布状态
    var state = "已发布";
    $('#btnSave2').click(function () {
        state = '草稿';
    })

    $("#form-add").on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append('state', state);
        // console.log(...fd);
        //base64是字符串 生成了二进制图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(...fd);
                //ajax要放到回调函数里面生成问件事异步的操作,所以必须保证发送ajax的时候图片已经生成所以要放到回调函数中
                //调用
                publishArticle(fd)
                window.parent.document.getElementById('a2').className = 'layui-this';
                window.parent.document.getElementById('a3').className = '';
                // window.parent.document.querySelector('#a2 a').click()
            })
    })

    //发起Ajax请求实现发布文章的功能
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'

            }
        })
    }

})