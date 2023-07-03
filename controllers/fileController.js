const FileService = require('../service/fileService');
const User = require('../models/User');
const File = require('../models/File');
const fs = require('fs');


class FileController {
async createDir(req, res) {
    try {
        const {name,type,parent} = req.body;
        // const file = new File({name,type,parent,user:req.user._id});
        const file = new File({name, type, parent: parent, user: req.user.id});
        // const parentFile = await File.findById({_id:parent});
        const parentFile = await File.findById(parent);
        if(!parentFile){
         file.path = name;
         await FileService.createDir(file);

        }else{
            file.path = `${parentFile.path}\\${file.name}`;
            await FileService.createDir(file);
            parentFile.childe.push(file._id);
            await parentFile.save();

        }
        await file.save();
        return res.json(file);
 

        
    } catch (error) {
        console.log(error);
       return res.status(400).json({message:error})
        
    }
}



async fetFiles(req, res) {
    try {
        const files = await File.find({user:req.user.id,parent:req.query.parent});
        return res.json(files);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"לא ניתן לקבל קבצים"})
        
    }
    
}

async uploadFile(req, res) {
    try {
        const file = req.files.file;
        const parent = await File.findOne({user:req.user.id,_id:req.body.parent});
        const user = await User.findOne({_id: req.user.id});
        if(user.usedSpace + file.size > user.diskSpace){
            return res.status(400).json({message:"אין לך מספיק מקום"})
        }
       user.usedSpace = user.usedSpace + file.size;

       let path 
       if(parent){
        path = `${process.env.FILE_PATH}\\${user._id}\\${parent.path}\\${file.name}`;

       }else{
        path = `${process.env.FILE_PATH}\\${user._id}\\${file.name}`;
       }

       if(fs.existsSync(path)){
       return res.status(400).json({message:"הקובץ כבר קיים"})
       }
       file.mv(path);
       const type = file.name.split('.').pop();
       const dbFile = new File({
           name: file.name,
           type,
           size: file.size,
           path:parent ?.path,
           parent: parent?._id,
           user: user._id
       })

       await dbFile.save();
       await user.save();
       return res.json(dbFile);

        
    } catch (error) {
        return res.status(500).json({message:"לא ניתן להעלות קובץ"})
        
    }
}


}



module.exports = new FileController();