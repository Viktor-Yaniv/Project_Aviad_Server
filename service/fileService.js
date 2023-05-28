const fs = require('fs');
const File = require('../models/File');


class FileService {

    createDir(file){
        const filePath = `${process.env.FILE_PATH}\\${file.user}\\${file.path}`
return new Promise((resolve,reject)=>{
    try {
        if(!fs.existsSync(filePath)){
            fs.mkdirSync(filePath)
         return resolve({message: 'Directory created'})
        }
        else{
            return reject({message: 'Directory already exists'})
        }
        
    } catch (error) {
        return reject(new Error("File error"));

    }
})

    }

}

module.exports = new FileService();

