const express = require('express');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();
const Admins = require('../config/admins.json')
const Orders = require('../models/Order')
const Archive = require('../models/Archive')

function generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
    
    if ( n > max ) {
            return generate(max) + generate(n - max);
    }
    
    max        = Math.pow(10, n+add);
    var min    = max/10; // Math.pow(10, n) basically
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;
    
    return ("" + number).substring(add); 
}

router.post('/set_order', urlencodedParser, async(req, res) => {
    if (!req.body.amount) return res.redirect("/")
    const newOrder = new Orders({
        user: req.user.username,
        userid: req.user.id,
        amount: req.body.amount,
        code: generate(12)
    })
    newOrder.save()
    res.redirect("/")
})

router.post('/set_info', urlencodedParser, async(req, res) => {
    if (!Admins.user.includes(req.user.id)) return res.redirect("/")
    await Orders.findOneAndUpdate({code: req.body.code}, {payed: req.body.payed, info: req.body.info || "Payment received", shipped: req.body.shipped})
    res.redirect("/admin")
})

router.get('/cancel_order/:code', urlencodedParser, async(req, res) => {
    if (!Admins.user.includes(req.user.id)) return res.redirect("/")
    await Orders.findOneAndDelete({code: req.params.code})
    res.redirect("/admin")
})

router.get('/archive_order/:code', urlencodedParser, async(req, res) => {
    if (!Admins.user.includes(req.user.id)) return res.redirect("/")
    Orders.findOne({code: req.params.code}, async function(err, orders) {
        const moveArchive = new Archive({
            user: orders.user,
            userid: orders.userid,
            amount: orders.amount,
            payed: orders.payed,
            shipped: orders.shipped,
            info: orders.info,
            code: orders.code,
            date: orders.date
        })
        moveArchive.save()
        await Orders.findOneAndDelete({code: req.params.code})
        res.redirect("/admin")
    })
})

router.get('/*', urlencodedParser, async(req, res) => {
    res.clearCookie("auth")
    res.render("403")
})

module.exports = router;
