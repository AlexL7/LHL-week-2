'use strict';

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 80      <input type="submit" value="Sign In">
80

const _ = require('lodash');

const bcrypt = require('bcrypt');

const cookieSession = require('cookie-session');

app.use(cookieSession({
  keys:['key1','key2']
}));

let users = {};
let urlGeneral ={};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));


app.set("view engine", "ejs");

app.get("/", (req, res) => {

  res.render("main");
});

app.get("/urls", (req, res) => {

  console.log(users);
  console.log(req.session.user_id);

  var id = (req.session.user_id);

  console.log(id.urlDatabase);

  console.log(users[req.session.user_id]);
  console.log(users[req.session.user_id]['urlDatabase']);
  let templateVars = { urls: users[req.session.user_id].urlDatabase,
  email: users[req.session.user_id].email };


  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {


  let templateVars = { shortURL: req.params.id,
  email: users[req.session.user_id].email };

  res.render("urls_new",templateVars);
});


//user[password] = undefined

app.post("/login/", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = _.find(users, {'email': email});

  if(user){
    if(bcrypt.compareSync(password, user.password)){

        //req.session.('user_id', user.id);
        req.session.user_id = user.id
         return res.redirect("/urls");
    }else{
      res.status(403).send({error: "Incorrect Password"});
    }
  }else{
     res.status(403).send({error: "user not found"});
  }


  req.session.user_id = user.id;
  res.redirect("/url");
});

app.get("/login/",(req, res) =>{
  res.render("login");
})


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
  email: users[req.session.user_id].email, };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  delete users[req.session.user_id].urlDatabase[req.params.id];
  delete urlGeneral[req.params.id];
  res.redirect('/urls/');
});

app.post("/urls/:id/update", (req, res) => {
  users[req.session.user_id].urlDatabase[req.params.id] = req.body.newlongURL;
  urlGeneral[req.params.id] = req.body.newlongURL;
  res.redirect("/urls/");
});



app.post("/logout", (req, res) =>{
  req.session.user_id = null;
  res.redirect("/");

});


app.get("/register", (req, res) =>{
res.render("register");
});



app.post("/register", (req, res) => {
  const user = _.find(users, {'email': req.body.email});
  if(user){
    res.status(400).send({error: "user already registered"});

    return res.redirect("/register");
  }

  const email = req.body.email;
  const password = req.body.password;

  const hashed_password = bcrypt.hashSync(password,10);


  if( email.length == 0 || password.length == 0){
    res.status(400).send({error: "empty field"});
    return res.redirect("/register");
  }else{
     const userRandomID = generateRandomString();
  users[userRandomID] = {id:userRandomID, email: req.body.email, password: hashed_password, urlDatabase: {}};
  req.session.user_id = userRandomID;
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
  users[req.session.user_id].urlDatabase[rand] = req.body.longURL;
  urlGeneral[rand] = req.body.longURL;
  res.redirect(`/urls/${rand}`);
});


app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  //console.log(short);
  console.log(urlGeneral);
  console.log(urlGeneral[short]);
  let longURL = urlGeneral[short];
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