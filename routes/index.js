const express = require('express');
const router = express.Router();
const Orders = require('../models/Order')
const Admins = require('../config/admins.json')

router.get('/', async(req, res) => {
    if (req.useragent.isMobile == true) return res.render("403")
    res.redirect('/dashboard')
})

router.get('/dashboard', async(req, res) => {
    if (req.useragent.isMobile == true) return res.render("403")
    Orders.find({userid: req.user.id}, function(err, orders){
        var isAdmin = false
        if (Admins.user.includes(req.user.id)) { isAdmin = true }
        res.render('index', {
            User: req.user,
            Orders: orders.reverse(),
            Admin: isAdmin
        })
    })
})

router.get('/admin', async(req, res) => {
    if (req.useragent.isMobile == true) return res.render("403")
    Orders.find({}, function(err, orders){
        var isAdmin = false
        if (Admins.user.includes(req.user.id)) { 
            isAdmin = true 
            res.render('admin', {
                User: req.user,
                Orders: orders.reverse(),
                Admin: isAdmin
            })
        } else {
            res.redirect("/")
        }
    })
})

router.get('/logout', async(req, res) => {
    res.clearCookie("auth")
    res.redirect("/")
})

module.exports = router;
