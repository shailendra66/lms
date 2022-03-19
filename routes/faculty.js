var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
var fs = require('fs');

router.get('/displayallfaculty',function(req,res){
    pool.query('select F.*,(select D.departmentname from department D where D.departmentid=F.department) as departmentname,(select S.statename from states S where S.stateid=F.state) as statename,(select C.cityname from cities C where C.cityid=F.city) as cityname from faculty F',function(error,result){
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

router.post('/addfaculty',upload.single("icon"),function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
    pool.query('insert into faculty (firstname,lastname,fathername,gender,dateofbirth,qualification,department,designation,address,state,city,mobileno,alternatemobileno,emailid,password,icon) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[req.body.firstname,req.body.lastname,req.body.fathername,req.body.gender,req.body.dateofbirth,req.body.qualification,req.body.department,req.body.designation,req.body.address,req.body.state,req.body.city,req.body.mobileno,req.body.alternatemobileno,req.body.emailid,req.body.password,req.filename],function(error,result){
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

router.post('/editfaculty',function(req,res){
    pool.query("update faculty set firstname=?,lastname=?,fathername=?,gender=?,dateofbirth=?,qualification=?,department=?,designation=?,address=?,state=?,city=?,mobileno=?,alternatemobileno=?,emailid=?,password=? where facultyid=?",[req.body.firstname,req.body.lastname,req.body.fathername,req.body.gender,req.body.dateofbirth,req.body.qualification,req.body.department,req.body.designation,req.body.address,req.body.state,req.body.city,req.body.mobileno,req.body.alternatemobileno,req.body.emailid,req.body.password,req.body.facultyid],function(error,result){
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

router.post('/editicon',upload.single("icon"),function(req,res){
    pool.query("update faculty set icon=? where facultyid=?",[req.filename,req.body.facultyid],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            res.status(200).json({result:true,msg:'Edited Icon'})
        }
    })
})

router.post('/deletefaculty',function(req,res){
    pool.query("delete from faculty where facultyid=?",[req.body.facultyid],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            res.status(200).json({result:result,msg:'Deleted'})
            fs.unlink('g:/React Js/lms_backend/public/images/'+req.body.icon,(err,rslt)=>{
                console.log(err)
            })
        }
    })
})

router.post('/checkfacultylogin', function(req, res, next) {
    pool.query("select F.*,(select D.departmentname from department D where D.departmentid=F.department) as departmentname from faculty F where F.emailid=? and F.password=?",[req.body.emailid,req.body.password],function(error,result){
        if(error)
        {
            res.status(500).json({result:false})
        }
        else
        {
            if(result.length==0)
            {
                res.status(200).json({result:false})
            }
            else
            {
                res.status(200).json({result:true,data:result[0]})
            }
        }
    })
  });

module.exports=router;