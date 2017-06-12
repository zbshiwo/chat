/**
 * Created by 张博 on 2017/6/11.
 */
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const jada = require('jade');
var names = [];

app.set('view engine', 'jade');
app.set('views', './view');
//app.set('view options', { layout: false });
//app.setDefaults({cache:false});

app.use('/public', express.static('./public'));

app.get('/', function (req, res) {
    res.render('index');
});

io.sockets.on('connection', function (socket) {
    //socket.emit('connection', names);
    //有用户登录，判断用户名是否存在，不存在，将用户名加入到names数组中，然后向所有的客户端发送login事件
   socket.on('login', function (name) {
        for (let i = 0; i < name.length; i++){
            if(names[i] == name){
                socket.emit('duplicate');
                return;
            }
        }
        names.push(name);
        io.sockets.emit('login', name);
        io.sockets.emit('usernames', names);
   });

    socket.on('chat', function (data) {
        io.sockets.emit('chat',data);
    });

    socket.on('logout',function (name) {
        for(let i=0;i<names.length;i++){
            if(names[i]==name){
                names.splice(i,1);
                break;
            }
        }
        socket.broadcast.emit('logout',name);
        io.sockets.emit('usernames',names);
    });

});

server.listen(1337);