const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");
const Schema = mongoose.Schema;

main()
  .then((res) => {
    console.log("Connection Successfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
const initDB = async () => {
  await Listing.deleteMany({});
  data.data = data.data.map((obj) => ({
    ...obj,
    owner: "666b2c783eaa546c4a45faf7",
  }));
  await Listing.insertMany(data.data);
  console.log("Data was initialized");
};
initDB();
