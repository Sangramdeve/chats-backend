const mongose = require("mongoose");

async function connectDb(url) {
  mongose
    .connect(url)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log("error:", err));
}
module.exports = { connectDb };
