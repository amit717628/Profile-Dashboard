const express = require(`express`);
const app = express()
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
let names = "";
let bios = "";
app.set('view engine', 'ejs');
async function checkauth() {
    const dbi = await db.get("auth")
    return dbi
}
app.get(`/`,(req,res) => {
    res.render('home');
    // res.sendFile('pages/home.html' , { root : __dirname});
})
app.get(`/login`, async (req,res) => {
    res.render(`login`)
   
})
app.get("/dashboard", async(req,res) => {
    const check = await checkauth()
    if(check === true){
    const dbs = await db.get("mail")
    res.render("main",{dbs:dbs})
    } else {
        res.status(501).send("You have not login till yet")
    }
})
app.post(`/login`, async(req,res) => {
    const dbs = await db.get("mail")

const email = req.body.email;
const password = req.body.password
if(email === dbs.email){
    if(password === dbs.password){
await db.set("auth", true)
        res.render('profile',{dbs:dbs})
    } else {
        await db.set("auth", false)
        res.send("Wrong Password")
    }
} else {
    res.status(501).send("No Account Found")
    await db.set("auth", false)
}
})

app.get(`/profile`, async(req,res) => {
    const geton = await checkauth()
    if(geton === true){
    const dbs = await db.get("mail")
    res.render("profile",{dbs:dbs})
    } else {
        res.status(501).send("You have not login till yet")
    }
})
app.get(`/edit`, async(req,res) => {
    const geton = await checkauth()

    if(geton === true){
    const dbs = await db.get("mail")
    res.render(`edit`,{dbs:dbs})
    } else {
        res.status(501).send("You have not login till yet")
    }
})
app.post(`/edit`,async (req,res) => {
    const check = await checkauth()
   
    if(check === true){
        const dbs = await db.get("mail")
    const username = req.body.name;
    const avatar = req.body.pic;
    const banner = req.body.banner
    const email = req.body.mail
    const pass = req.body.password
    const bio = req.body.bios
    const save = await db.set("mail",{email: email,name:username,avatar:avatar,banner:banner,password:pass,bio:bio})
    res.render("profile",{dbs:dbs})
    } else {
        res.status(501).send("You have not login till yet")
    }
})

app.get("/logout", async(req,res) => {
    const check = await checkauth()
    if(check === true){
    res.render("login")
    req.destroy()
    await db.set("auth", false)
    } else {
        res.status(501).send("You have not login till yet")
    }
    
})
app.listen(8000,() => {
    console.log("Online")
})

module.exports = app;




/*
DEVELOPED BY AAYAN
MADE WITH NODE.JS & JAVASCRIPT & HTML & CSS
Don't forget to add star
*/