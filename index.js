// đây là file main và tất cả các ý chính sẽ dc viết ở đây
require('dotenv').config() // tạo file.env ở thư mục gốc rồi dùng dòng code này để liên kết tới link đó
const express=require('express') // tạo biến express

const app=express() // chúng ta sẽ sử dụng chính vs biến app này

const mongoose=require('mongoose') // mongoose là bên thứ 3 dùng để liên kết mongdb vs nodejs, cần install lúc khởi tạo
const authRouter=require('./routes/auth') // ta sẽ tạo 1 folder routes để lưu 2 router này riêng biệt 2 file
const postRouter=require('./routes/post')

app.use(express.json()) // dùng để cho app chúng ta có thể đọc được cái file .json


//connect vs mongoDB bằng cách lên web mongodb tạo tk rồi add code trên github
const connectDB=async ()=>{ // await là chờ cho chức năng này thực hiện xong rồi mới tới các chức năng kế tiếp
    try{
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.z7voh.mongodb.net/mern-learnit?retryWrites=true&w=majority`,{
            useCreateIndex:true, // khi thao tác vs db thì đa số là bất đồng bộ nên ta dùng async/await 
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
        })
        console.log('mongodb connected') // báo cho biết đã connect db dc chưa

    }catch(err){
        console.log('err'+err)
    }
}

connectDB() // gọi hàm này để chạy lệnh trên

// dùng để route đến các path 
app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)

// cố định PORT và chạy app 
const PORT=5000

app.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`)
})