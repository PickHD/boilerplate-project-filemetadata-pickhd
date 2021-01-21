const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const cors = require('cors')
require('dotenv').config()

const app = express()

//!SETUP DATABASE & MULTER HERE

const uploadFile =  multer({dest:process.cwd() + '/uploads'})

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false})
.then(()=>console.log("MongoDB Connected!!"))
.catch(e=>console.error(e))

const storageSchema = mongoose.Schema({
  name:String,
  type:String,
  size:Number
})
const Storage = mongoose.model("Storage",storageSchema)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', (req, res)=> {
    res.sendFile(process.cwd() + '/views/index.html')
});

//!SETUP API HERE:
//(POST /api/fileanalyse),fields:upfile
//RETURNING : name,file type ,size of files

app.post("/api/fileanalyse",uploadFile.single('upfile'),async(req,res)=>{
  try {
    
    const analyzeAndUploadFile=await Storage.create({
      name:req.file.originalname,
      type:req.file.mimetype,
      size:req.file.size
    })

    return res.json({
      name:analyzeAndUploadFile.name,
      type:analyzeAndUploadFile.type,
      size:analyzeAndUploadFile.size
    })

  } catch (e) {
    return res.json({err_msg:"Cannot Upload file",reason:e})
  }

})

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
  console.log('Your app is listening on port ' + port)
});
