var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
var fs = require('fs');

router.get('/displayallstudent',function(req,res){
    // console.log(req.query)
    // pool.query('select * from student',function(error,result){
    pool.query('select ST.*,(select CS.statename from states CS where CS.stateid=ST.cstate) as currentstate,(select CC.cityname from cities CC where CC.cityid=ST.ccity) as currentcity,(select PS.statename from states PS where PS.stateid=ST.pstate) as permanentstate,(select PC.cityname from cities PC where PC.cityid=ST.pcity) as permanentcity,(select DS.statename from states DS where DS.stateid=ST.domicile) as domicilestate,(select D.departmentname from department D where D.departmentid=ST.departmentid) as department,(select C.coursename from courses C where C.courseid=ST.courseid) as coursename from student ST',function(error,result){
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

router.post('/addstudent',upload.any(),function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
    console.log(req.query)
    pool.query('insert into student (enrollmentno,studentname,fathername,mothername,nationality,category,gender,dob,mobileno,parentsmobileno,cstate,ccity,caddress,pstate,pcity,paddress,emailid,parentsoccupation,annualincome,aadharno,aadharpicture,domicile,domicilepicture,departmentid,courseid,password,studentpicture) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
        req.body.enrollmentno,
        req.body.studentname,
        req.body.fathername,
        req.body.mothername,
        req.body.nationality,
        req.body.category,
        req.body.gender,
        req.body.dateofbirth,
        req.body.mobileno,
        req.body.parentsmobileno,
        req.body.currentstate,
        req.body.currentcity,
        req.body.currentaddress,
        req.body.permanentstate,
        req.body.permanentcity,
        req.body.permanentaddress,
        req.body.emailid,
        req.body.parentsoccupation,
        req.body.annualincome,
        req.body.aadharno,
        req.files[0].filename,
        req.body.domicile,
        req.files[1].filename,
        req.body.department,
        req.body.coursename,
        req.body.password,
        req.files[2].filename
    ],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            console.log(result)
            res.status(200).json({result:true,msg:'Submitted'})
        }
    })
})

router.post('/editstudent',function(req,res){
    pool.query("update student set enrollmentno=?,studentname=?,fathername=?,mothername=?,nationality=?,category=?,gender=?,dob=?,mobileno=?,parentsmobileno=?,cstate=?,ccity=?,caddress=?,pstate=?,pcity=?,paddress=?,emailid=?,parentsoccupation=?,annualincome=?,aadharno=?,domicile=?,departmentid=?,courseid=?,password=? where studentid=?",
    [
        req.body.enrollmentno,
        req.body.studentname,
        req.body.fathername,
        req.body.mothername,
        req.body.nationality,
        req.body.category,
        req.body.gender,
        req.body.dateofbirth,
        req.body.mobileno,
        req.body.parentsmobileno,
        req.body.currentstate,
        req.body.currentcity,
        req.body.currentaddress,
        req.body.permanentstate,
        req.body.permanentcity,
        req.body.permanentaddress,
        req.body.emailid,
        req.body.parentsoccupation,
        req.body.annualincome,
        req.body.aadharno,
        req.body.domicile,
        req.body.department,
        req.body.coursename,
        req.body.password,
        req.body.studentid],function(error,result){
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


router.post('/editicon',upload.single("studentpicture"),function(req,res){
    pool.query("update student set studentpicture=? where studentid=?",[req.filename,req.body.studentid],function(error,result){
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


router.post('/editaadharpicture',upload.single("aadharpicture"),function(req,res){
    pool.query("update student set aadharpicture=? where studentid=?",[req.filename,req.body.studentid],function(error,result){
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

router.post('/editdomicilepicture',upload.single("domicilepicture"),function(req,res){
    pool.query("update student set domicilepicture=? where studentid=?",[req.filename,req.body.studentid],function(error,result){
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

 

router.post('/deletestudent',function(req,res){
    pool.query("delete from student where studentid=?",[req.body.studentid],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            res.status(200).json({result:result,msg:'Deleted'})
            fs.unlink('g:/React Js/lms_backend/public/images/'+req.body.studenticon+req.body.aadharicon+req.body.domicileicon,(err,rslt)=>{
                console.log(err)
            }) 
        }
    })
})


router.post('/checkstudentquestions',function(req,res){
    console.log("CHECK",req.body)
    pool.query("select * from studentexam where examtransactionid=? and setno=? and questionno=? and enrollmentno=?",
    [req.body.examtransactionid,req.body.setno,req.body.questionno,req.body.enrollmentno],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            console.log(result)
            if(result.length>=1)
                res.status(200).json({result:true,data:result})
            else
                res.status(200).json({result:false,data:[]})
        }
    })
})




router.post('/insertstudentexam',function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
    console.log(req.query)
    pool.query('insert into studentexam (examtransactionid, enrollmentno, setno, questionno, answer, selectedans, status) values(?,?,?,?,?,?,?)',
    [
        req.body.examtransactionid,
        req.body.enrollmentno,
        req.body.setno,
        req.body.questionno,
        req.body.answer,
        req.body.selectedans,
        req.body.status
    ],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            console.log(result)
            res.status(200).json({result:true,msg:'Submitted'})
        }
    })
})


router.post('/updatestudentexam',function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
    console.log(req.query)
    pool.query('update studentexam set selectedans=? where examtransactionid=? and enrollmentno=? and setno=? and questionno=?',
    [
        req.body.selectedans,
        req.body.examtransactionid,
        req.body.enrollmentno,
        req.body.setno,
        req.body.questionno
    ],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:false,msg:'Server Error'})
        }
        else
        {
            console.log(result)
            res.status(200).json({result:true,msg:'Submitted'})
        }
    })
})



router.post('/checkstudentlogin', function(req, res, next) {
    pool.query("select S.*,(select C.coursename from courses C where C.courseid=S.courseid) as coursename from student S where emailid=? and password=?",[req.body.emailid,req.body.password],function(error,result){
        if(error)
        {
            res.status(500).json({result:false})
        }
        else
        {
            if(result.length==0)
            {
                res.status(200).json({result:false,data:[]})
            }
            else
            {
                res.status(200).json({result:true,data:result})
            }
        }
    })
  });

module.exports=router;