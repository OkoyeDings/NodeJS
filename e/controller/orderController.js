// REQUIRE
const express = reqire('express');
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

var router= express.Router();
mongoose.set('useFindAndModify',false);
//Router
router.get('/',(req,res)=>{
    res.render('menu');
});
router.get('/cart',(req,res)=>{
    res.render('cart');
});
router.get('/order',(req,res)=>{
    res.render('order');
})
router.get('/admin',(req,res)=>{
    Order.find((err,docs)=>{
        if(!err){
            res.render("admin",{
                order:docs
            });
        }else{
            console.log('Error in order: ' + err)
        }
    });
});
router.get('/order/:id',(req,res)=>{
    Order.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render("orders",{order:doc});
        }else{
            console.log('Error findby ID: ' + err);
        }
    });
});
router.get('/order/delete/:id',(req,res)=>{
    Order.findByIdAndDelete(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/admin');
        } else{
            console.log('Error in delete: '+ err)
        }
    })
});

router.post('/part',(req,res)=>{
    insertOrder(req,res);
});
router.post('/order',(req,res)=>{
    updateOrder(req,res);
});

// function
function updateOrder(req,res){
    Order.findOneAndUpdate({id:req.body._id},req.body,{new:true},(er,doc)=>{
        if(!err){
            res.redirect('/admin');
        }else{
            console.log('Update error '+err );
        }
    });
}
function insertOrder(req,res){
    var d= new Date();
    var t=d.getTime();
    var counter= t;
    counter+=1
    var order=new Order();
    order.total=req.body.total;
    order.order=counter;
    order.save((err,doc)=>{
        if(!err){
            console.log('order: ' +order);
            res.redirect('/admin');
        } else {
            console.log('Error insertOrder: '+err);
        }
    });
}

module.exports=router;