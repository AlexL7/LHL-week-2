'use strict';

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 80      <input type="submit" value="Sign In">
80

const _ = require('lodash');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));


app.set("view engine", "ejs");

app.get("/", (req, res) => {

  res.render("main");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
  email: users[req.cookies["user_id"]].email };


  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {


  let templateVars = { shortURL: req.params.id,
  email: users[req.cookies["user_id"]].email, };

  res.render("urls_new",templateVars);
});


//user[password] = undefined

app.post("/login/", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = _.find(users, {'email': email});

  if(user){
    if(user.password == password){

        res.cookie('user_id', user.id);
         return res.redirect("/urls");
    }else{
      res.status(403).send({error: "Incorrect Password"});
    }
  }else{
     res.status(403).send({error: "user not found"});
  }


  res.cookie('user_id',user.id);
  res.redirect("/url");
});

app.get("/login/",(req, res) =>{
  res.render("login");
})


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
  email: users[req.cookies["user_id"]].email, };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls/');
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.newlongURL;
  res.redirect("/urls/");
});



app.post("/logout", (req, res) =>{
  res.clearCookie('user_id');
  res.redirect("/");

});


app.get("/register", (req, res) =>{
res.render("register");
});

let users = {Whcoz:{ id: 'Whcoz', email: 'test@test.com', password: '123'}};

app.post("/register", (req, res) => {
  const user = _.find(users, {'email': req.body.email});
  if(user){
    res.status(400).send({error: "user already registered"});

    return res.redirect("/register");
  }

  const email = req.body.email;
  const password = req.body.password;

  console.log(email);
  console.log(password);

  if( email.length == 0 || password.length == 0){
    res.status(400).send({error: "empty field"});
    return res.redirect("/register");
  }else{
     const userRandomID = generateRandomString();
  users[userRandomID] = {id:userRandomID, email: req.body.email,password: req.body.password};
  res.cookie('user_id', userRandomID);
  res.redirect("/");
  };
});






app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.post("/urls", (req, res) => {
  //console.log(req.body.longURL);  // debug statement to see POST parameters
  const rand = generateRandomString();
                                  // Respond with 'Ok' (we will replace this)
  urlDatabase[rand] = req.body.longURL;
  res.redirect(`/urls/${rand}`);
});

app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  //console.log(short);
  let longURL = urlDatabase[short];
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString (){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    return text;
}