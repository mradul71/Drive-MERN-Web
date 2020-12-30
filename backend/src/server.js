const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
import Folder from "../models/folderModel"
import File from "../models/fileModel";
const multer = require('multer');
const cors = require('cors');
const {v4: uuid4} = require("uuid");
import moment from 'moment';
const path = require("path");

dotenv.config();

mongoose.connect(process.env.MONGOURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongoose");
})

mongoose.connection.on('error', ()=>{
    console.log("An error occured");
})

mongoose.set('useCreateIndex', true);

const app = express();
app.use(bodyParser.json());
app.use(cors());

let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads')
    },
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, Date.now() + '-' +file.originalname )
    }
   })

app.get("/data", async (req, res) => {
    try {
        const folders = await Folder.find({parentFolder:null});
    
        const files = await File.find({parentFolder:null});
        res.send({folders,files});
    } catch (err) {
        res.status(401).json({error:true,message:'error retrieving folders'});
    }
});

app.post("/createfolder", async (req, res) => {
    try {
        const name = req.body.name;
        const parentId = req.body.parentId;

        let parentFolder = null;
        if(parentId!=null){
            parentFolder = await Folder.findOne({_id: parentId});
            if(parentFolder==null){
                return res.status(401).json({error: true, message: "error creating a folder"});
            }
        }

        const folder = new Folder({
            name: name,
            parentFolder: parentFolder
        })

        const createdFolder = await folder.save();
        console.log("folder created");
        return res.status(200).json(createdFolder);
    } catch (err) {
        console.log(err);
        res.status(401).json({error:true,message:'error creating new folder'});
    }
});

app.post('/createfile', async (req, res) => {
    
    let upload = multer({
        storage: storage,
        limit: {fileSize: 100 * 1024 * 500}
    }).single('myfile');

    upload(req, res, async (err) => {

        if(!req.file){
            return res.json({error: "All fields are required"});
        }

         if(err){
             return res.status(500).send({error: err.message});
         }

         const file = new File({
            name: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size,
            date: moment(new Date().toISOString()).format("YYYY-MM-DD")
         })

         const response = await file.save();const resi = await File.updateOne({uuid: response.uuid}, {$set: {downloadURL: `http://localhost:8080/download/${response.uuid}`}});
         return res.status(200).json(response);
    })
  })

  app.post('/createfile/:id', async (req, res) => {

   const parentId = req.params.id;
   console.log(parentId);

    let parentFolder = null;
    if(parentId!=null){
        parentFolder = await Folder.findOne({_id: parentId});
        if(parentFolder==null){
            return res.status(401).json({error: true, message: "error creating a file"});
        }
    }
    
    let upload = multer({
        storage: storage,
        limit: {fileSize: 100 * 1024 * 500}
    }).single('myfile');

    upload(req, res, async (err) => {

        if(!req.file){
            return res.json({error: "All fields are required"});
        }

         if(err){
             return res.status(500).send({error: err.message});
         }

         const file = new File({
            parentFolder: parentFolder._id,
            name: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
         })
         const response = await file.save();
         const resi = await File.updateOne({uuid: response.uuid}, {$set: {downloadURL: `http://localhost:8080/download/${response.uuid}`}})
            return res.status(200).json(response);
    })
  })

app.get("/download/:uuid", async (req, res) => {
    const file = await File.findOne({uuid: req.params.uuid});
    if(!file){
        return res.render('download', {error: 'Link has been expired'});
    }
    const filePath = `${__dirname}/../${file.path}`
    res.download(filePath);
})

app.get("/folder/:id", async (req, res) => {
    const id = req.params.id;
    const folders = await Folder.find({parentFolder: id});
    const files = await File.find({parentFolder: id});
    if(folders || files){
        res.send({folders, files});
    }
})

app.listen(8080, console.log("listeing to port number 5000"));