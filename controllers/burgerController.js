var express = require("express");

// when express.Router() is called, it returns a mini app which enables you to keep all the routes of a certain type, for instance, burgers, separate from routes of a different type (salads). You then export the route handler into the main app (require burger_controller and require salad_controller). This enables you to keep your app's main routes (which would hypothetically be a restaurant_controller) free of clutter (imagine having a bunch of get routes for each menu item, for each restaurant, across your giant chain of restaruants; the express.router() function helps us keep things organized as we scale up)
var router = express.Router();

var validator = require('validator');

// Import the model to use its database functions.

let db = require('./../models');

router.get("/", (req, res) => {
    db.burgers.findAll({raw: true}).then( data => {
        hbsObject = {burgers: data};
        console.log(hbsObject);
        res.render("index", hbsObject);
    }).catch(err => {
        res.json(err);
    });
});

  router.get("/api/burgers", function(req, res){
    db.burgers
      .findAll({
      })
      .then(data => {
        res.json(data);
      });
  });

router.post("/api/burgers", function(req, res) {
    if (!validator.isEmpty(req.body.burger_name)) {
        db.burgers.create({
            burger_name: req.body.burger_name
        }).then(function(result){
            res.json({id: result.insertId});
        }).catch(function(err){
            res.json(err);
        });
    } else {
        return res.status(422).end();
    }

});

router.put("/api/burgers/:id", function(req, res) {
    db.burgers.update({
        devoured: req.body.devoured
    }, {
        where: {
        id: req.params.id
     }
    }).then(function(result) {
         res.json(result);

    }).catch(function(err){
        hbsObject = {error: err};
        res.render("error", hbsObject);
    });

});

router.delete("/api/burgers/", function(req, res) {

    db.burgers.destroy({
        where: {},
        truncate: true
    }).then(function(result){
        res.json(result);
    });

});

// Export routes for server.js to use.
module.exports = router;