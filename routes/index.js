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
    SELECT * FROM customer WHERE userid = "${user_name}"`


    database.query(query, function (error, data) {

      if (data.length > 0) {

        for (var count = 0; count < data.length; count++) {

          if (data[count].password == user_pass) {

            req.session.user_id = data[count].cust_id

            if (req.session.user_id == 1) {
              res.redirect("/adminpanel")
              
            } else {
              res.redirect("/")
            }




          } else {
            res.send('Incorrect Password')
          }

        }
      } else {
        res.send("incorrect username")
      }
      res.end()
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
  var company = req.body.company
  var owner = req.body.owner
  var item = req.body.item
  var qty = req.body.qty

  var trackingid = req.body.trackingid
  var req_for_ship = req.body.req_for_ship
  var box_count = req.body.box_count
  var specification = req.body.specification
  var check_qty = req.body.check_qty
  var weight = req.body.weight



  var ship_size_len = req.body.ship_size_len
  var ship_size_breath = req.body.ship_size_breath
  var ship_size_height = req.body.ship_size_height

  var ship_size = `${ship_size_len}X${ship_size_breath}X${ship_size_height}`

  var cust_id = req.session.user_id

  if (/^[a-z0-9 _]+$/i.test(company) && /^[a-z0-9 _]+$/i.test(owner) && /^[a-zA-Z_]+$/i.test(item) && /^[a-zA-Z _]+$/i.test(trackingid) && /^[a-zA-Z _]+$/i.test(specification) && /^[a-zA-Z _]+$/i.test(check_qty)) {

    var query = `INSERT INTO cust_orders(cust_id,order_date,company,owner,item,qty,weight,req_for_ship,shipment_size,trackingid,box_count,specification,checklist_qty) VALUES ?`;
    var data = [
      [cust_id, order_date, company, owner, item, qty, weight, req_for_ship, ship_size, trackingid, box_count, specification, check_qty]
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

router.get('/adminpanel', function async(req, res, next) {
try {
  
  if (!req.session.user_id || req.session.user_id != 1) {
    res.redirect("/")
  } else {


    var query = `
    SELECT * FROM cust_orders`

    database.query(query, function (error, data) {
      if (error) {
        throw error
      } else {

        var cust_1_total_qty = 0;
        var cust_2_total_qty = 0;
        var cust_2_total_w = 0;
        var cust_1_total_w = 0;
        var cust_1_total_box = 0;
        var cust_2_total_box = 0;


let index = 0
       while (index < data.length) {
         var newUser = data[index]
         if (newUser.cust_id == 3) {
           cust_2_total_qty+=parseInt(newUser.qty)
           cust_2_total_w+=parseFloat(newUser.weight)
           cust_2_total_box+= parseInt(newUser.box_count)
           
         } else if (newUser.cust_id == 2) {
           cust_1_total_qty += parseInt(newUser.qty)
           cust_1_total_w += parseFloat(newUser.weight)
           cust_1_total_box += parseInt(newUser.box_count)
          
         }

         if (index === parseInt(data.length)-1) {

           var total_box = cust_1_total_box + cust_2_total_box 
           var total_w = cust_1_total_w + cust_2_total_w 
           var total_qty = cust_1_total_qty + cust_2_total_qty 
  
           res.render('index', {
             title: 'Express', 
             session: req.session, 
             cust_1_total_qty: cust_1_total_qty, 
             cust_2_total_qty: cust_2_total_qty,
             total_qty:total_qty,
             cust_2_total_w: cust_2_total_w, 
             cust_1_total_w: cust_1_total_w, 
             total_w:total_w,
             cust_2_total_box: cust_2_total_box, 
             cust_1_total_box: cust_1_total_box,
             total_box:total_box
           });
       }
        index++
       }

      }
    })


  }

} catch (error) {
  console.log(error)
}
  

})

router.get('*',function (req, res) {
  res.redirect('/');
});

module.exports = router;
