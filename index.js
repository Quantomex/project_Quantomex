if (process.env.NODE_ENV !== "production") {
<<<<<<< Updated upstream
  require("dotenv").config();
}
//models will go here
require('./models/Admin');
require('./models/faqModel');
require('./models/contactUsModel');
require('./models/blogModel');
require('./models/testModel')
require('./models/jobsModel');
require('./models/ordercompanyModel');
require('./models/whoweareModel');
=======
    require("dotenv").config();
  }
  //models will go here
  require('./models/Admin');
  require('./models/caseStudyModel');
  require('./models/FormEntry');
  require('./models/teamModel');
  require('./models/clientReviewModel');
  require('./models/otpModel');
>>>>>>> Stashed changes

const express = require("express");
const MongoDBStore = require("connect-mongo");
const mongoose = require("mongoose");
const multer = require("multer");
const passport = require("passport");
const localStrategy = require("passport-local");
const path = require("path");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const session = require("express-session");
var bodyParser = require("body-parser");
const Admin = mongoose.model('Admin')
const app = express();
const PORT = 3000;
const mongoURi = process.env.MONGO_URI || 'mongodb+srv://askassociates:Salmangz1@cluster0.fsm9zvf.mongodb.net/?retryWrites=true&w=majority';
const secret = "hehehaha";

// Routes will go here
const adminRoutes = require('./routes/adminRoute');
const faqRoute = require('./routes/faqRoute');
const contactusRoute = require('./routes/contactusRoute');
const blogRoute = require('./routes/blogRoute');
const testRoute = require('./routes/testimonialRoute');
const jobsRoute = require('./routes/jobsRoute');
const ordercompanyRoute = require('./routes/ordercompanyRoute');
const whoweareRoute = require('./routes/whoweareRoute');

const store = new MongoDBStore({
  mongoUrl: mongoURi,
  secret,
  touchAfter: 24 * 60 * 60,
});
const sessionConfig = {
  store,
  secret,
  name: "session",
  resave: false,
  saveUninitialized: false,
};

// Setting up the app
app.engine("ejs", ejsMate);

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.set(path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(session(sessionConfig));

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// initializing Mongoose
mongoose
  .connect(mongoURi, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongoose is connected");
  })
  .catch((e) => {
    console.log(e);
  });

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());


passport.use('admin', new localStrategy(Admin.authenticate()));
passport.serializeUser((user, done) => {
  if (user instanceof Admin) {
    done(null, { type: 'admin', id: user.id });
  }
});
passport.deserializeUser(async (data, done) => {
  try {
    let user;
    if (data.type === 'admin') {
      user = await Admin.findById(data.id);
    }

    // Save the user object in the session regardless of its type
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


//Routes usage will go here
app.use(adminRoutes);
app.use(faqRoute);
app.use(contactusRoute);
app.use(blogRoute);
app.use(testRoute);
app.use(jobsRoute);
app.use(ordercompanyRoute);
app.use(whoweareRoute);

// Listen for the port Number
app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
  });