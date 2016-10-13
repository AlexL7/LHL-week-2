'use strict';

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 80      <input type="submit" value="Sign In">
80


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

  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
  email: req.cookies["username"], };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {


  let templateVars = { shortURL: req.params.id,
  email: req.cookies["username"], };

  res.render("urls_new",templateVars);
});

app.get("/urls/login", (req, res) =>{
let templateVars = { email: req.cookies["username"] };


res.render("urls_login", templateVars);


});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
  email: req.cookies["username"], };
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

app.post("/login", (req, res) => {
  var email = req.body.username;
  res.cookie('username',email);
  res.redirect("/");
});


app.post("/logout", (req, res) =>{
  res.cookie('username');
  res.redirect("/");

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