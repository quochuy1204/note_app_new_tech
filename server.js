const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const path = require('path')

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(fileupload({
    useTempFiles: true
}));

//import route
app.use('/users', require('./routes/userRouter'));
app.use('/api', require('./routes/uploadAvatarRouter'));
app.use('/notes', require('./routes/noteRouter'));

//Connect to MongoDB
const URI = process.env.MONGO_URL;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log("Connected to MongoDB.")
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


//config PORT and setup server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started on port`, PORT);
});