var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
 

router.get('/displayallstates',function(req,res){
    pool.query('select * from states',function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:[]})
        }
        else
        {
            console.log(result)
            res.status(200).json({result:result})
        }
    })
})

router.post('/displayallcities',function(req,res){
    pool.query('select * from cities where stateid=?',[req.body.stateid],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:[]})
        }
        else
        {
            console.log(result)
            res.status(200).json({result:result})
        }
    })
})

module.exports=router;