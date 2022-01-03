const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const {ErrorHandlingMiddleware} = require('./middlewares')
const router = require('./routes')
const helmet = require("helmet");
const morgan = require("morgan")
require("dotenv").config();
require('./models');

app.use(helmet());
app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', router)
app.use(express.static(path.resolve(__dirname, 'uploads')))

app.use(ErrorHandlingMiddleware)

const PORT: number | string = process.env.PORT || 8080;

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        app.listen(PORT, () => {
            console.log('\x1b[36m\x1b[1m%s\x1b[0m', "=================================")
            console.log("\x1b[1m", `Server started on port ${PORT}`);
            console.log('\x1b[36m%s\x1b[0m', "=================================")
        });
    }catch (e){
        console.log(e)
    }
}

start()
