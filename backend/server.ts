const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const {ErrorHandlingMiddleware} = require('./src/middlewares')
const router = require('./src/routes')

require("dotenv").config();
require('./src/models');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', router)
app.use(express.static(path.resolve(__dirname, 'uploads')))

mongoose.connect(
    process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err: any) => console.log(err));

app.use(ErrorHandlingMiddleware)

const PORT: number | string = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


