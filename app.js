let express = require("express")
let body_parser = require("body-parser")
let app = express();
let url = require('url')
let mongoose = require('mongoose')
// 设置跨域
app.all("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(body_parser.urlencoded({
    extended: false
}))
// 链接数据库
mongoose.connect('mongodb://localhost/user',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('数据库链接成功');
}).catch((err)=>{
    console.log(err);
})
// 设置数据库规则
let messageSchema = new mongoose.Schema({
    username:String,
    password:String
})
// 创建数据集合
let message = mongoose.model('message',messageSchema)
// 注册接口

app.get('/register',(req,res)=>{
    let obj = url.parse(req.url, true).query;
    message.find({username:obj.username}).then((data)=>{
        if(data.length == 0){
            message.create(obj).then((result)=>{
                result?res.end('注册成功'):null
            })
        }else{
            res.send({
                //xhr.status:获取当前服务器的响应状态  200=>成功
                status:false,
                msg:'手机号已注册，请登录'
            })
        }
    })
})
// 登录接口
app.post("/login",(req,res)=>{
    message.find({username: req.body.username, password: req.body.password}).then((data)=>{
        data.length == 0 ? res.end("登陆失败") : res.end("登陆成功");
    })
})
// 设置监听
app.listen("6060",()=>{
    console.log('6060 is running');
})