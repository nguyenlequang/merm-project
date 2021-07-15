// file auth.js dung để quản lý việc đăng ký/ đăng nhập 
const express=require('express')
const router=express.Router() // khởi tạo 1 biến router mới
const User=require('../models/User') // import models User từ trong folder models
const argon2=require('argon2')  // Đây là 1 API dùng để hash Password người dùng trước khi thêm vào db và lấy ra phải unhash
const jwt=require('jsonwebtoken') // jwt là 1 web dùng để lưu trạng thái đăng nhập hay đki của người dùng trên web jwt.io 


// @route POST api/auth/register
// login User
// access public
router.use('/register',async (req,res)=>{
    const {username,password}=req.body

    // simple validation
    if(!username || !password)
        return res.status(400).json({success:false,message:'missing username and/or password'})
    
    try{
        // tìm trong db user có tồn tại hay không
        const user=await User.findOne({username}) // đây là method dùng để tìm kiếm và trả về 1 model vs username=usernmae tương ứng, vì trong phiên bản mới thì vs key-value trùng nhau ta chỉ cần truyền 1 cái vào là được
        if(user)
            return res.status(400).json({success:false,message:'Username already existed'}) // trả về status code 400 trở lên thường là mã lỗi
        const hashPassword=await argon2.hash(password) // chúng ta phải install argon2 nếu mún sử dụng, ở đây chúng ta sẽ hash password của người dùng đi để tránh bị kẻ xấu lợi dụng
      
            const  newUser=new User({username,password:hashPassword})  // khởi tạo 1 biến User() mới để lưu vào db, đây là bước đăng kí
            await newUser.save()  // khi sử dụng đến db thì đa số đều là bất đồng bộ và async/await thường được bọc bởi try catch
       

        //return token
        const accessToken=jwt.sign({userId:newUser._id},process.env.ACCESS_TOKEN_SECRET) // trả về cho người dùng để xác nhận đã đăng nhập thành công bằng cách đăng kí token này trên jwt.io
        res.status(200).json({success:true,message:'User created successfully'},accessToken) // status 200 thường là thành công
    }catch(err){
        res.status(500).json({success:false,message:'Internal server error'})
    }
})

// POST api/auth/login
// desc login user
// access public

router.post('/login', async (req,res)=>{  
    const {username,password}=req.body
    if(!username || !password)
        return res.status(400).json({success:false,message:'missing username and/or password'})

    try{
        // kiem tra user co ton tai khong
        const user=await User.findOne({username})
        if(!user)
            return res.status(400).json({success:false,message:'Incorrect user'})
        // neu tim duoc
        const passwordValid=await argon2.verify(user.password,password)
        if(!passwordValid)
            return res.status(400).json({success:false,message:'Incorrect pass'})
        // neu dung pass

        // lấy 1 token để xác thực là đã được đăng nhập
        const accessToken=jwt.sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET) // lấy token từ file .env để gán cho người dùng
        console.log(accessToken)
        return res.status(200).json('succes',{success:true,message:'login successfully'},accessToken)

    }catch(err){
        res.status(500).json({success:false,message:'Internal server jhherror'})
    }
})

module.exports=router