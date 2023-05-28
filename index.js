const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload({}));
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);


const start = async  () => {
 try {
    mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Port running on ${port}`);
    });
    
 } catch (error) {
    console.log(error);
    
 }
}
start();