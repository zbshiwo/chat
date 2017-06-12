/**
 * Created by 张博 on 2017/6/12.
 */
$(function () {
    var username, socket;

    $('#username').select().focus();
    $('#login').click(function () {
        if( $.trim($('#username').val()) == ''){
            alert('请输入用户名');
            return;
        }

        username = $.trim($('#username').val());
        socket = io.connect();

        socket.emit('login', username);

        socket.on('connect', function () {
            $("#divChat").html("与聊天服务器的连接已建立" + "<br>");
        });

        socket.on('login', function (name) {
            $('#divChat').html($('#divChat').html() + '欢迎用户' + name + '进入聊天室' + '<br>');
        });

        socket.on('usernames', function (usernames) {
            var str = "用户列表" + "<br>";
            $.each(usernames, function (index, name) {
                str += name + "<br>";
            })
            $('#divRight').html(str);
        });

        socket.on("duplicate", function () {
            alert("该用户名已被使用");
            $("#login").attr("disabled", false);
            $("#logout").attr("disabled", true);
            $("#post").attr("disabled", true);
        });

        socket.on('chat', function (data) {
            $('#divChat').html($('#divChat').html() + data.username + '说：' + data.message + '<br>');
        });

        socket.on('logout', function (name) {
            $('#divChat').html($('#divChat').html() + '用户' + name + '退出聊天室' + '<br>');
        });

        $('#login').attr('disabled', true);
        $('#logout').attr('disabled', false);
        $('#post').attr('disabled', false);


    });

    $('#post').click(function () {
        if($.trim($('#Msg').val()) == ""){
            alert('请输入内容');
            return;
        }
        socket.emit('chat', {username:username, message:$.trim($('#Msg').val()) });
        $('#Msg').val("");
    });

    $("#logout").click(function () {
        socket.emit("logout", username);
        socket.disconnect();
        socket.removeAllListeners();
        io.sockets = {};
        $('#login').attr('disabled', false);
        $('#logout').attr('disabled', true);
        $('#post').attr('disabled', true);
        $("#divChat").html($("#divChat").html() + "用户"+ username + "退出聊天" + "<br>");
        $("#divRight").html("用户列表" + "<br>");
    });

})