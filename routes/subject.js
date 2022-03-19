var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
var fs = require('fs');

router.get('/displayallsubject',function(req,res){
    console.log(req.query)
    // pool.query('select S.*,(select D.departmentname from department D where D.departmentid=S.departmentid) as departmentname,(select C.coursename from courses C where C.courseid=S.courseid) as coursename,(select C.semester from courses C where C.semester=S.semester) as semestername from subjects S',function(error,result){
    pool.query('select S.*,(select D.departmentname from department D where D.departmentid=S.departmentid) as departmentname,(select C.coursename from courses C where C.courseid=S.courseid) as coursename,(select S.semester from courses C where C.courseid=S.courseid) as semestername from subjects S',function(error,result){
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

router.post('/addsubject',function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
    pool.query('insert into subjects (departmentid,courseid,semester,subjectname,type,subjectmarks) values(?,?,?,?,?,?)',[req.body.department,req.body.coursename,req.body.semester,req.body.subjectname,req.body.examtype,req.body.subjectmarks],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            res.status(200).json({result:true,msg:'Submitted'})
        }
    })
})


router.post("/getsubjectbysubjectid",function(req,res){
    pool.query("select * from subjects where subjectid=?",[req.body.subjectid],function(error,result){
      if(error){
        console.log(error)
        res.status(500).json({result:[]})
      }else{
        console.log(result)
        res.status(200).json({result:result})
      }
    })
  })

  router.post("/getsubjectbycourseid",function(req,res){
    pool.query("select * from subjects where courseid=?",[req.body.courseid],function(error,result){
      if(error){
        console.log(error)
        res.status(500).json({result:[]})
      }else{
        console.log(result)
        res.status(200).json({result:result})
      }
    })
  })


  router.post("/getunitbysubjectid",function(req,res){
    pool.query("select * from units where subjectid=?",[req.body.subjectid],function(error,result){
      if(error){
        console.log(error)
        res.status(500).json({result:[]})
      }else{
        console.log(result)
        res.status(200).json({result:result})
      }
    })
  })

  router.post("/displaysubjectbycourseid",function(req,res){
    pool.query("select * from subjects where courseid=? and semester=?",[req.body.courseid,req.body.semester],function(error,result){
      if(error){
        console.log(error)
        res.status(500).json({result:[]})
      }else{
        console.log(result)
        res.status(200).json({result:result})
      }
    })
  })


router.post('/editsubject',function(req,res){
    pool.query("update subjects set departmentid=?,courseid=?,semester=?,subjectname=?,type=?,subjectmarks=? where subjectid=?",[req.body.department,req.body.coursename,req.body.semester,req.body.subjectname,req.body.examtype,req.body.subjectmarks,req.body.subjectid],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            res.status(200).json({result:true,msg:'Edited'})
        }
    })
})


 

router.post('/deletesubject',function(req,res){
    pool.query("delete from subjects where subjectid=?",[req.body.subjectid],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            res.status(200).json({result:result,msg:'Deleted'})
             
        }
    })
})

module.exports=router;