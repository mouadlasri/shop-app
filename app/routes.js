var Shop = require('../app/models/shop.js');
var User = require('../app/models/user.js');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(app, passport) {
    
    // home page
    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    // shop list
    app.get('/shops', (req, res) => {
        Shop.find({}, function(err, shops) {
            res.render('shops.ejs', {Shops: shops});
        }); 
        // res.render('shops.ejs', shops);
    });

    // login page GET request
    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // login page POST request
    app.post('/login', passport.authenticate('local-login', {   
        successRedirect: '/shops' , // redirect to shops page
        failureRedirect: '/login', // redirect to login page
        failureFlash: true // allow flash messages
    }));

    // signup page GET request
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', { message: req.flash('signupMessage')});
    });

    // signup page POST request
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/shops', // redirect to shops page
        failureRedirect: '/signup', // redirect to signup page
        failureFlash: true // allow flash messages
    }));

    app.post('/like', (req, res) => {
        Shop.find({_id: new ObjectId(req.body.shopId)}, function(err, shop) {
            // User.find({"local.username": req.user.local.username}, function(err, user) {
            //    //console.log(user[0].local.username);
            //   console.log('updatedShops => ', updatedShops);
            // });
            // push the id of the shop to the prefShop array in database to keep track of the user's preferred shops 
            User.update({"local.username": req.user.local.username}, {$push: {"local.prefShop": shop[0]._id}}, function(err) {
                if(err) {
                    console.log('error');
                }
            });
        });
       // console.log('test => ', req.body.shopId);
        res.redirect('/shops');
    });

    app.get('/prefShops', (req, res) => {
        
    })
};