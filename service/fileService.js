const fs = require('fs');
const path = require('path');
const File = require('../models/File');

class FileService {
    createDir(file) {
        const user = file.user.toString(); // Convert to string if it's an ObjectId
        const filePathSegment = file.path.toString(); // Convert to string if it's an ObjectId
        const filePath = path.join(process.env.FILE_PATH, user, filePathSegment);

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, { recursive: true });
                    return resolve({ message: 'ספרייה שנוצרה' });
                } else {
                    return reject({ message: 'המדריך כבר קיים' });
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = new FileService();


