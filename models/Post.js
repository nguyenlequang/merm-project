const mongoose=require('mongoose')
const Schema=mongoose.Schema

const PostSchema=new Schema({
    title:{
        type:String,
        required:true // yêu cầu phải có
    },
    description:{
        type:String,

    },
    url:{
        type:String
    },
    status:{
        type:String,
        enum:['TO LEARN','LEARNING','LEARNED'] // giới hạn status là 1 trong 3 cai này
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'  // này như khóa ngoại và nó sẽ mang giá trị _id của user và sẽ được cung cấp, do đó chỉ có người dùng mới edit chỉnh sửa dc nó
    }
})

module.exports=mongoose.model('posts',PostSchema)