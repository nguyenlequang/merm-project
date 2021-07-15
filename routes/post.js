const express=require('express')
const router=express.Router()
const verifyToken=require('../middleware/auth')

const Post =require('../models/Post')


// GET api/posts
// desc get  post
// access private

router.get('/',verifyToken,async(req,res)=>{
    try{
        const posts=await Post.find({user:req.userId}).populate('user',['username'])
        return res.status(200).json({success:true,posts})

    }catch(err){
        return res.status(500).json({success:false,message:'Internal server error'})
    }
})
// POST api/posts
// desc create post
// access private

router.post('/',verifyToken,async(req,res)=>{  // verifyToken là hàm dc viết trong folder middleware dùng để kiểm tra xem có đc thông qua hay ko
    const {title,description,url,status}=req.body // destructer từ req.body để nhận các thuộc tính này

    if(!title)
        return res.status(400).json({success:false,message:'title is required'})
    try{
        const newPost=new Post({ title,
            description,
            url: url.startsWith('https://')?url:`https://${url}`,
            status:status||'TO LEARN',
            user:req.userId
        })
        await newPost.save()

       return res.json({success:true,message:'Happy learning',post:newPost})
           
    }catch(err){
       return res.status(500).json({success:false,message:'Internal server error'})
    }
})

// GET api/posts
// desc update  post
// access private

router.put('/:id',verifyToken,async(req,res)=>{
    const {title,description,url,status}=req.body

    if(!title)
        return res.status(400).json({success:false,message:'title is required'})
    try{
        let updatedPost={
            title,
            description:description||'',
            url: (url.startsWith('https://')?url:`https://${url}`)||'',
            status:status||'TO LEARN',
        }
        //req.params.id la :id dc truyen o path , no cung chinh la id cua post nay
        // cần phân biệt giữa query và param https://stackoverflow.com/questions/14417592/node-js-difference-between-req-query-and-req-params
        const conditionUpdate={_id:req.params.id,user:req.userId} //kep diue kien de filter
        updatedPost=await Post.findOneAndUpdate(conditionUpdate,updatedPost,{new:true})

        // neu user not authorized
        if(!updatedPost)
            return res.status(401).json({success:false,message:'post not found or user not authorized'})
        res.status(200).json({success:true,message:'update success',post:updatedPost})
    }catch(err){
    return res.status(500).json({success:false,message:'Internal server error'})
    }
})

// GET api/posts
// desc update  post
// access private

router.delete('/:id',verifyToken,async(req,res)=>{
    try{
        const deleteCondition={_id:req.params.id,user:req.userId}
        const deletedPost=await Post.findOneAndDelete(deleteCondition)
        if(!deletedPost)
            return res.status(401).json({success:false,message:'post not found or user not authorized'})
        return res.status(200).json({success:true,post:deletedPost})
    }catch(err){
        return res.status(500).json({success:false,message:'Internal server error'})

    }
})

module.exports=router