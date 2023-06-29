var express = require('express');
var router = express.Router();

var database = require('../database')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', session: req.session });
});

router.post('/login', function (req, res, next) {

  var user_name = req.body.user_name;

  var user_pass = req.body.user_password;

  if (user_name && user_pass) {
    var query = `
    SELECT * FROM user WHERE username = "${user_name}"`

    database.query(query, function (error, data) {

      if (data.length > 0) {

        for (var count = 0; count < data.length; count++) {

          if (data[count].password == user_pass) {

            req.session.user_id = data[count].id
            req.session.comp_name = data[count].compname
            req.session.user_name = data[count].username
            res.redirect("/")


          } else {
            res.send('Incorrect Password')
            res.end()
          }
        }
      } else {
        res.send("incorrect username")
        res.end()
      }

    })

  } else {
    res.send('Please Enter Correct Username')
    res.end()
  }
});

router.get('/logout', function (req, res, next) {

  req.session.destroy()

  res.redirect("/")
})

router.post('/savedat', function (req, res, next) {

  var order_date = req.body.order_date
  var item = req.body.item
  var count = req.body.count
  var weight = req.body.weight
  var requsets = req.body.requsets

  var cust_id = parseInt(req.session.user_id)

  if (/^[a-zA-Z _]+$/i.test(item)) {

    var query = `
    INSERT INTO Orderitem(order_date,item,count,weight,requests,user_id) VALUES ?
    `;
    var data = [
      [order_date, item, count, weight, requsets, cust_id]
    ];

    database.query(query, [data], function (err, response) {
      if (err) {
        return console.log(err.message);
      } else {
        res.send('Data registered')
      }
    });

  }
  else {
    res.send('Wrong data format')
  }
});

router.get('/resetpassword', function (req, res) {
  res.render("resetpassword")
});

router.post('/resetpassword', function (req, res) {

  var m_no = req.body.m_no
  var new_pass = req.body.new_pass
  var c_new_pass = req.body.c_new_pass

  if (new_pass != c_new_pass) {
    res.redirect('/nomatch')
  } else {
    var query = `SELECT * FROM user WHERE phone = "${m_no}"`
    database.query(query, function (error, data) {
      if (data.length > 0) {
        var query = `UPDATE user SET password = "${new_pass}" WHERE id = ${data[0].id};`
        database.query(query, function (error, confirmation) {
          if (error) {
            throw error
          } else {
            res.send('Password Updated! Retry login')
            res.end()
          }
        })
      } else {
        res.send('Please Enter Correct mobile number')
        res.end()
      }
    })
  }

});

router.get('/nomatch', function (req, res) {
  res.send("Passwords do not match Please go back and try again !")
});

router.get('/viewdat', function (req, res) {

  if(req.session.user_id){

    var userid = parseInt(req.session.user_id)

    var query = `SELECT * FROM Orderitem WHERE user_id = ${userid};`
  
    database.query(query, function (error, data) {
  
      if (error) {
        throw error
      } else {
  
        if (data.length > 0) {
  
          var finalDat="";
  
          for (var count = 0; count < data.length; count++) {
  
            var fulldat = data[count]
            console.log(data[count].order_date)
  
            var datereg =  JSON.stringify(data[count].order_date)
  
            datereg = JSON.parse(datereg.replace("T18:30:00.000Z",""))
  
            var readyDat = `<tr>
            <td>${fulldat.order_id}</td>
            <td>${datereg}</td>
            <td>${fulldat.item}</td>
            <td>${fulldat.count}</td>
            <td>${fulldat.weight}</td>
            <td>${fulldat.requests}</td>
        </tr>`
  
            finalDat += readyDat
  
  
            if (count === parseInt(data.length) - 1) {
              res.render('table',{ allDat: finalDat })
            }
          }
  
        } else {
          res.send("No data")
  
        }
      }
    })

  }else{

res.redirect('/')

  }

 




});

router.get('*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
