var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
 

router.get('/displayallset',function(req,res){
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


router.post('/fetchallquestions',function(req,res){
    console.log(req.query)
    // pool.query('select S.*,(select D.departmentname from department D where D.departmentid=S.departmentid) as departmentname,(select C.coursename from courses C where C.courseid=S.courseid) as coursename,(select C.semester from courses C where C.semester=S.semester) as semestername from subjects S',function(error,result){
    pool.query('select Q.*,(select D.departmentname from department D where D.departmentid=Q.departmentid) as departmentname,(select C.coursename from courses C where C.courseid=Q.courseid) as coursename,(select S.subjectname from subjects S where S.subjectid=Q.subjectid) as subjectname from questions Q where Q.setno=?',[req.body.setno],function(error,result){
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

router.post('/addquestions',upload.any(),function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.files)

    if(req.files.length==0)
    {

    if(req.body.questionimg=='')
    {questionimg="None"}

    if(req.body.optionimg1=='')
    {optionimg1="None"}
    if(req.body.optionimg2=='')
    {optionimg2="None"}
    if(req.body.optionimg3=='')
    {optionimg3="None"}
    if(req.body.optionimg4=='')
    {optionimg4="None"}
    }
    else
    {
        questionimg='None'
        optionimg1='None'
        optionimg2='None'
        optionimg3='None'
        optionimg4='None'
        req.files.map((items)=>{
            console.log('iiiiitems',items.fieldname)
            if(items.fieldname=='questionimg')
            {questionimg=items.filename}
            else if(items.fieldname=='optionimg1')
            {optionimg1=items.filename}
            else if(items.fieldname=='optionimg2')
            {optionimg2=items.filename}
            else if(items.fieldname=='optionimg3')
            {optionimg3=items.filename}
            else if(items.fieldname=='optionimg4')
            {optionimg4=items.filename}
        })
    }
    pool.query('insert into questions (facultyid,departmentid,courseid,semester,subjectid,unitid,setno,questionno,question,questionimage,option1,image1,option2,image2,option3,image3,option4,image4,correctanswer) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
        req.body.facultyid,
        req.body.departmentid,
        req.body.courseid,
        req.body.semester,
        req.body.subjectid,
        req.body.unitid,
        req.body.setno,
        req.body.questionno,
        req.body.question,
        questionimg,
        req.body.option1,
        optionimg1,
        req.body.option2,
        optionimg2,
        req.body.option3,
        optionimg3,
        req.body.option4,
        optionimg4,
        req.body.correctanswer
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

router.post('/generatequestionnumber',function(req,res){
    pool.query("select count(*) as qno from questions where setno=?",[req.body.setno],function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({result:[]})
        }
        else
        {
            console.log("xxxxxxx",result[0])
            if(result[0].qno==null)
                res.status(200).json({result:1})
            else
                res.status(200).json({result:parseInt(result[0].qno)+1}) 
             
        }
    })
})

router.get('/generateset',function(req,res){
    pool.query("select max(setid) as setno from createset",function(error,result){
        if(error)
        {
            res.status(500).json({result:[]})
        }
        else
        {
            console.log("xxxxxxx",result[0])
            if(result[0].setno==null)
                res.status(200).json({result:1})
            else
                res.status(200).json({result:parseInt(result[0].setno)+1}) 
        }
    })
})

router.post('/editset',function(req,res){
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


 

router.post('/deleteset',function(req,res){
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