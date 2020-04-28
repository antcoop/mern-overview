const path = require("path");
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const PORT = process.env.PORT || 5000;

const users = [
  {
    id: 1,
    username: "antcoop",
    password: "blahblah",
    firstName: "John",
    lastName: "Redcorn",
    email: "jredcorn@aol.com"
  }
];

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    const user = users.find(user => user.username === username);
    if (!user) { return done(null, false); }
    console.log("USER:", user);
    if (!user.password === password) { return done(null, false); }
    console.log("PASSWORD:", password);
    return done(null, user);
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  const user = users.find(user => user.id === id);
  if (user) {
    done(null, user);
  } 
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }
  return res.json({"error": "no user"});
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.get('/api/user', (req, res) => {
  res.send(json);
});

// Add routes, both API and view
app.get("*", function(req, res) {
  console.log("WILD CARD USER: ", req.user);
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});