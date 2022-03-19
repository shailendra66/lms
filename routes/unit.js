var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
 

router.get('/displayallunit',function(req,res){
    console.log(req.query)
    // pool.query('select S.*,(select D.departmentname from department D where D.departmentid=S.departmentid) as departmentname,(select C.coursename from courses C where C.courseid=S.courseid) as coursename,(select C.semester from courses C where C.semester=S.semester) as semestername from subjects S',function(error,result){
    pool.query('select U.*,(select D.departmentname from department D where D.departmentid=U.departmentid) as departmentname,(select C.coursename from courses C where C.courseid=U.courseid) as coursename,(select S.subjectname from subjects S where S.subjectid=U.subjectid) as subjectname from units U',function(error,result){
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

router.post('/addunit',function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
    pool.query('insert into units (departmentid,courseid,subjectid,unitno,title,description) values(?,?,?,?,?,?)',
    [
        req.body.departmentid,
        req.body.courseid,
        req.body.subjectid,
        req.body.unitno,
        req.body.title,
        req.body.description
    ],function(error,result){
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



router.post('/editunit',function(req,res){
    pool.query("update units set departmentid=?,courseid=?,subjectid=?,unitno=?,title=?,description=? where unitid=?",
    [
        req.body.departmentid,
        req.body.courseid,
        req.body.subjectid,
        req.body.unitno,
        req.body.title,
        req.body.description,
        req.body.unitid
    ],function(error,result){
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


 

router.post('/deleteunit',function(req,res){
    pool.query("delete from units where unitid=?",[req.body.unitid],function(error,result){
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