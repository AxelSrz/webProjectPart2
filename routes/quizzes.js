var mongoose = require('mongoose'); //mongo connection

//build the REST operations at the base for quizzes
//this will be accessible from http://127.0.0.1:3000/quizzes if the default route for / is left unchanged
exports.list = function(req, res){
  mongoose.model('Quiz').find({}, function (err, quizzes) {
    if (err) {
      return console.error(err);
    } else {
      //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
      res.format({
        //HTML response will render the index.jade file in the views/quizzes folder. We are also setting "quizzes" to be an accessible variable in our jade view
        html: function(){
          res.render('quizzes/index', {
            title: 'All Quizzes',
            "quizzes" : quizzes
          });
        },
        //JSON response will show all quizzes in JSON format
        json: function(){
          res.json(quizzes);
        }
      });
    }
  });
};

//POST a new quizz
exports.save = function(req, res){
  // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
  var title = req.body.title;
  var questions = req.body.quizQuestions;
  mongoose.model('Quiz').create({
    title : title,
    questions : questions
  }, function (err, quiz) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    } else {
      //Quiz has been created
      console.log('POST creating new quiz: ' + quiz);
      res.format({
        //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
        html: function(){
          // If it worked, set the header so the address bar doesn't still say /adduser
          res.location("quizzes");
          // And forward to success page
          res.redirect("/quizzes");
        },
        //JSON response will show the newly created quiz
        json: function(){
          res.json(quiz);
        }
      });
    }
  })
};

/* GET New Quiz page. */
exports.add = function(req, res){
  req.getConnection(function(err,connection){
    var query = connection.query('SELECT * FROM questions',function(err,questions)
    {
      if(err)
      console.log("Error Selecting : %s ",err );
      connection.query('SELECT * FROM answers',function(err, answers) {
        if(err)
        console.log("Error Selecting : %s ",err );
        connection.query('SELECT * FROM category',function(err, categories) {
          if(err)
          console.log("Error Selecting : %s ",err );
          res.render('quizzes/new', {
            title: 'Add New Quiz',
            'questions': questions,
            'answers': answers,
            'categories': categories
          });
        });
      });
    });
  });
};

exports.show = function(req, res){
  mongoose.model('Quiz').findById(req.params.id, function (err, quiz) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err);
    } else {
      console.log('GET Retrieving ID: ' + quiz._id);
      res.format({
        html: function(){
          res.render('quizzes/show', {
            "quiz" : quiz
          });
        },
        json: function(){
          res.json(quiz);
        }
      });
    }
  });
};

exports.edit = function(req, res){
  //search for the quiz within Mongo
  mongoose.model('Quiz').findById(req.params.id, function (err, quiz) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err);
    } else {
      //Return the quiz
      console.log('GET Retrieving ID: ' + quiz._id);
      res.format({
        //HTML response will render the 'edit.jade' template
        html: function(){
          req.getConnection(function(err,connection){
            var query = connection.query('SELECT * FROM questions',function(err,questions)
            {
              if(err)
              console.log("Error Selecting : %s ",err );
              connection.query('SELECT * FROM answers',function(err, answers) {
                if(err)
                console.log("Error Selecting : %s ",err );
                connection.query('SELECT * FROM category',function(err, categories) {
                  if(err)
                  console.log("Error Selecting : %s ",err );
                  res.render('quizzes/edit', {
                    title: 'Quiz no.'+quiz._id,
                    'questions': questions,
                    'answers': answers,
                    'categories': categories,
                    'quiz': quiz
                  });
                });
              });
            });
          });
        },
        //JSON response will return the JSON output
        json: function(){
          res.json(quiz);
        }
      });
    }
  });
};

exports.save_edit = function(req, res){
  // Get our REST or form values. These rely on the "name" attributes
  var title = req.body.title;
  var questions = req.body.quizQuestions;

  debugger;
  //find the document by ID
  mongoose.model('Quiz').findById(req.params.id, function (err, quiz) {
    //update it
    quiz.update({
      title : title,
      questions : questions
    }, function (err, quizID) {
      if (err) {
        res.send("There was a problem updating the information to the database: " + err);
      }
      else {
        //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
        res.format({
          html: function(){
            res.redirect("/quizzes");
          },
          //JSON responds showing the updated values
          json: function(){
            res.json(quiz);
          }
        });
      }
    })
  });
};
//DELETE a Quiz by ID
exports.delete_quizz = function(req, res){
  //find quiz by ID
  mongoose.model('Quiz').findById(req.params.id, function (err, quiz) {
    if (err) {
      return console.error(err);
    } else {
      //remove it from Mongo
      quiz.remove(function (err, quiz) {
        if (err) {
          return console.error(err);
        } else {
          //Returning success messages saying it was deleted
          console.log('DELETE removing ID: ' + quiz._id);
          res.format({
            //HTML returns us back to the main page, or you can create a success page
            html: function(){
              res.redirect("/quizzes");
            },
            //JSON returns the item with the message that is has been deleted
            json: function(){
              res.json({message : 'deleted',
                        item : quiz
                      });
            }
          });
        }
      });
    }
  });
};
