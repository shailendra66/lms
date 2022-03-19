var express = require('express');
var router = express.Router();
var pool=require("./pool")
var upload=require("./multer");


router.post('/addcourses',upload.single("courseicon"), function(req, res, next) {
    console.log(req.body)
    pool.query("insert into courses (departmentid,coursename,semester,feepersem,courseicon) values(?,?,?,?,?)",[req.body.departmentid, req.body.coursename, req.body.sem, req.body.fee, req.filename],function(error,result){
     if(error)
     { console.log(error)
       res.status(500).json({result:false,msg:'Server Error'})
     }
     else
     {
         console.log(result)
      res.status(200).json({result:true,msg:'Submitted'})
     }
  
    })
  });


  router.get("/displayallcourses",function(req,res){
    pool.query("select C.*, (select D.departmentname from department D where D.departmentid=C.departmentid) as department from courses C",function(error,result){
      if(error){
        console.log(error)
        res.status(500).json({result:[]})
      }else{
        console.log(result)
        res.status(200).json({result:result})
      }
    })
  })

  router.post("/displaycoursebydepartmentid",function(req,res){
    pool.query("select * from courses C where C.departmentid=?",[req.body.departmentid],function(error,result){
      if(error){
        console.log(error)
        res.status(500).json({result:[]})
      }else{
        console.log(result)
        res.status(200).json({result:result})
      }
    })
  })

  router.post("/getsemesterbycourseid",function(req,res){
    pool.query("select * from courses where courseid=?",[req.body.courseid],function(error,result){
      if(error){
        console.log(error)
        res.status(500).json({result:[]})
      }else{
        console.log(result)
        res.status(200).json({result:result})
      }
    })
  })


  router.post('/editcourse',function(req,res){
    pool.query("update courses set departmentid=?, coursename=?, semester=?,feepersem=? where courseid=?",[req.body.departmentid, req.body.coursename, req.body.semester, req.body.feepersem, req.body.courseid], function(error,result){
      if(error){
        res.status(500).json({result:false,msg:'Server Error'})
      }else{
        res.status(200).json({result:true,msg:'Edited'})
      }
    })
  })


  router.post('/editicon',upload.single("courseicon"),function(req,res){
    pool.query("update courses set courseicon=? where courseid=?",[req.filename, req.body.courseid], function(error,result){
      if(error){
        res.status(500).json({result:false,msg:'Server Error'})
      }else{
        res.status(200).json({result:true,msg:'Edited'})
      }
    })
  })


  router.post('/deletecourse',function(req,res){
    pool.query("delete from courses where courseid=?",[req.body.courseid],function(error,result){
      if(error){
        res.status(500).json({result:false,msg:'Server Error'})
      }else{
        res.status(200).json({result:true,msg:'Deleted'})
      }
    })
  })


module.exports=router;