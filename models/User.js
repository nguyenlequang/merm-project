const mongoose=require('mongoose') 
const Schema=mongoose.Schema // 2 dòng đầu tiên là phải có và thiết yếu trong lúc khởi tạo model

const UserSchema=new Schema(   // tạo model vs tham số truyền vào là 1 object có các thuộc tính như username,password,...
    { 
        username:{
            type:String,
            required:true, //bắt buộc phải truyền vào
            unique:true, // đây là duy nhất (primary key)
        },
        password:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
            defaut:Date.now  // mặc định là lấy thời gian hiện tại
        }
    }
)

module.exports=mongoose.model('users',UserSchema) // users la ten trong collection mongoDB 
// thông thường argument đầu tiên thường sẽ compile thành số nhiều và lower case