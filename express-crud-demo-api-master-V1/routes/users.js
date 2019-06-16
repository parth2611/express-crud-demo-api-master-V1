var express = require('express');
var router = express.Router();
//Call User Database Model
var UsersModel = require('../schema/user');
//Call Response Function
var Response = require('../response');

//Display Home Page (Index Page)
router.get('/', function(req, res, next) {
    res.render('index');
  });
  
//Display all records API
router.get('/get-all-users-api', function(req, res, next) {
    UsersModel.find({}, function(err, posts) {
        if (err) {
            Response.errorResponse(err, res);
        } else {
            Response.successResponse('User Listing!', res, posts);
        }
    });

});

//Add User API
router.post('/add-users-api', function(req, res, next) {
    console.log(req.body);

    const mybodydata = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_mobile: req.body.user_mobile
    }
    var data = UsersModel(mybodydata);

    //var data = UsersModel(req.body);
    data.save(function(err) {
        if (err) {
            Response.errorResponse(err, res);
        } else {
            Response.successResponse('User Added!', res, {});
        }
    })
});


//Get Single Data API
router.get('/get-users-details-api/:id', function(req, res, next) {
  UsersModel.findById(req.params.id, function (err, post) {
    if(err){
      Response.errorResponse(err,res);
  }else{
      Response.successResponse('User Detail!',res,post);
  }
  });
});

//Delete Record API
router.delete('/delete-users-api', function(req, res, next) {
  UsersModel.findByIdAndRemove(req.body._id, function (err, post) {
    if (err) {
      Response.errorResponse(err,res);
    } else {
      Response.successResponse('User deleted!',res,{});
    }
  });
});

//Update Record API
router.post('/update-users-api', function(req, res, next) {
  console.log(req.body._id);
  UsersModel.findOneAndUpdate(req.body._id, req.body, function (err, post) {
  if (err) {
    Response.errorResponse(err,res);
  } else {
    Response.successResponse('User updated!',res,{});
  }
});
});




/*

HTML Based Data Rendring

*/


//List Table Data
router.get('/display', function(req, res) {
    UsersModel.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.render('display-table', { users: users });
            console.log(users);
        }
    });
});


//Call Add Form Method
router.get('/add', function(req, res, next) {
    res.render('add-form');
});


//Add Form Processing using Post Method 
router.post('/add', function(req, res, next) {
    console.log(req.body);

    console.log(req.files.user_photo);
  if (!req.files)
  return res.status(400).send('No files were uploaded.');

    //File Object
  let myfile = req.files.user_photo;
  let myfilename = req.files.user_photo.name;
  // Use the mv() method to place the file somewhere on your server
  myfile.mv("public/upload/"+ myfilename, function(err) {
    if (err)
      return res.status(500).send(err);
 //  res.send('File uploaded!');
  });


    const mybodydata = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_mobile: req.body.user_mobile,
        user_photo : myfilename
    }
    
    var data = UsersModel(mybodydata);
    //var data = UsersModel(req.body);
    data.save(function(err) {
        if (err) {

            res.render('add-form', { message: 'User registered not successfully!' });
        } else {

            res.render('add-form', { message: 'User registered successfully!' });
        }
    })
});

//Delete User By ID
router.get('/delete/:id', function(req, res) {
    UsersModel.findOneAndDelete(req.params.id, function(err, project) {
        if (err) {

            req.flash('error_msg', 'Record Not Deleted');
            res.redirect('../display');
        } else {

            req.flash('success_msg', 'Record Deleted');
            res.redirect('../display');
        }
    });
});

//Get Single User By ID
router.get('/show/:id', function(req, res) {
    console.log(req.params.id);
    UsersModel.findById(req.params.id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log(user);

            res.render('show', { users: user });
        }
    });
});

//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {
    console.log(req.params.id);

    const mybodydata = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_mobile: req.body.user_mobile,
        user_photo : myfilename
    }
    
    


    UsersModel.findById(req.params.id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log(user);

            res.render('edit-form', { users: user });
        }
    });
});

//Update Record Using Post Method
router.post('/edit/:id', function(req, res) {

    console.log(req.files.user_photo);
  if (!req.files)
  return res.status(400).send('No files were uploaded.');

    //File Object
  let myfile = req.files.user_photo;
  let myfilename = req.files.user_photo.name;
  // Use the mv() method to place the file somewhere on your server
  myfile.mv("public/upload/"+ myfilename, function(err) {
    if (err)
      return res.status(500).send(err);
   res.send('File uploaded!');
  });

  console.log("MyID is"+ req.params.id);

  const mybodydata = {
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_mobile: req.body.user_mobile,
      user_photo : myfilename
  }
  

    UsersModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
        if (err) {
            req.flash('error_msg', 'Something went wrong! User could not updated.');
            res.redirect('edit/' + req.params.id);
        } else {
            req.flash('success_msg', 'Record Updated');
            res.redirect('../display');
        }
    });
});

module.exports = router;
