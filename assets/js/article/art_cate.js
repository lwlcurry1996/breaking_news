$(function () {
    var form = layui.form
    var layer = layui.layer
    // alert('111');
    initArtCateList()

    //封装获取文章列表的的函数
    function initArtCateList() {
        //ajax请求
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    //添加文章分类
    $('#btnAddCate').on('click', function () {
        layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //添加文章分类
    var index = null;
    $('body').on('submit', '#boxAddCate', function (e) {
        console.log($(this).serialize());
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章分类失败')
                }
                //新增成功之后重新渲染
                initArtCateList()
                layui.layer.msg('新增文章分类成功')

                //关闭添加区域
                layui.layer.close(index)
            }
        })
    })

    //通过代理的形式.为btn-edit按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章数据',
            content: $('#dialog-edit').html()
        })

        //渲染
        var id = $(this).attr('data-id')
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // alert(res);
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })

    })


    //修改的数据追加到页面
    $('tbody').on('submit', "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                leyer.msg('更新成功!')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //删除文章
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')

        //提示用户
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
                    layer.msg('删除成功')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });
    })
})