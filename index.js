const express = require("express");
const app = express();
const port = process.env.PORT||3000;
const path = require('path');
const fs  = require("fs");

const { header,rodape } = require("./components/allComponents");


// configurar handlebars
const handlebars = require('express-handlebars');
const { json } = require('express/lib/response');
app.engine('handlebars', handlebars.engine('main'));
app.set('view engine', 'handlebars');
app.set('views', './views');

//permitindo arquivos estaticos
app.use(express.static(path.join(__dirname,'public')))

//express session
const session = require('express-session');
app.use(session({ secret: 'PIZZAATHENAS' }));

//configurando body-parser
const bodyPar = require('body-parser');
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));

//carregando dados
let promotion;
fs.readFile("./data/promotions.json","utf-8",(err,data)=>{
    promotion = JSON.parse(data);
})
let prontas;
fs.readFile("./data/prontas.json","utf-8",(err,data)=>{
    prontas = JSON.parse(data);
})
let contas = [];
fs.readFile("./data/contas.json","utf-8",(err,data)=>{
    contas = JSON.parse(data);
})

app.get("/",(req,res)=>{
    res.render("home",{
    client:req.session.login,
    header,
    rodape,
    promotion,
    prontas,
    styles:[
        {css:"/css/header.css"},
        {css:"/css/home.css"},
        {css:"/css/rodape.css"}
    ]
    });
})
app.get("/singin",(req,res)=>{
    res.render("singin",{
        header,
        rodape,
      
        styles:[
            {css:"/css/header.css"},
            {css:"/css/form.css"},
            {css:"/css/rodape.css"}
        ]
        });
    
})
app.post("/singin",(req,res)=>{
    req.session.login = {
        name:req.body.nameClient,
        email:req.body.email,
        password:req.body.password
    }
    contas.push( req.session.login );
    fs.writeFile("./data/contas.json",JSON.stringify(contas, null, 2),(err)=>{
        if(err){
        console.log("erro no calbeck ->line:79")
        }else{
            res.redirect("/")
            console.log("cadastro de nova conta")
        }
    })
    
})
app.get("/login",(req,res)=>{
    res.render("login",{
        header,
        rodape,
        styles:[
            {css:"/css/header.css"},
            {css:"/css/rodape.css"},
            {css:"/css/form.css"}
        ]
    });
})
app.post("/login",(req,res)=>{
    for(conta of contas){
        if(conta.name == req.body.nameClient){
            req.session.login = conta;
            res.redirect("/");
        }

    }
    res.render("login",{
        alert:{text:"nome ou senha aparamtam estar errado"},
        header,
        rodape,
        styles:[
            {css:"/css/alert.css"},
            {css:"/css/header.css"},
            {css:"/css/rodape.css"},
            {css:"/css/form.css"}
        ]
    });
})
app.listen(port,console.log("aberto em localhost:",port))