const express = require("express");
require("dotenv").config()

const app = express();

const PORT: number | string = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

