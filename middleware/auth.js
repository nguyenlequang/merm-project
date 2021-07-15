const jwt=require('jsonwebtoken')



const verifyToken=(req,res,next)=>{
    const authHeader=req.header('Authorization') // thuộc tính đăng nhập
    const token=authHeader&&authHeader.split(' ')[1] // thường thì nó có dạng Barrer dsadasddasdsad nên ta đung hàm này để lấy giá trị token

    if(!token)
        return res.status(401).json({success:false,message:'Access token not found'})

    try{

        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) // check xem cái token này có đúng vs secret token của chúng ta hay không
        req.userId=decoded.userId  // gán lại cho req cái userId này để đi tiếp
        next()  // chạy đến hàm tiếp theo sau khi đã cehck thành công
    }catch(err){
        console.log('error is '+err)
        return res.status(403).json({success:false,message:'Invalid token not found'}) // việc xác thực người dùng thất bại
    }
}

module.exports=verifyToken