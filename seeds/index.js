const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');



async function main() {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp", {
        useNewUrlParser:true,
        // useCreateIndex: true,
        useUnifiedTopology:true
    });
}

main().catch(err => console.log(err));
const db = mongoose.connection;

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const citySample = sample(cities);
        const price = Math.floor(Math.random() * 20) * 10;
        const camp = new Campground({
            title:`${sample(places)} ${sample(descriptors)}`,
            image:'https://source.unsplash.com/collection/483251',
            price: `${price}`,
            author: "6229a2d62f2c1244efbfe1e8",
            location: `${citySample.city}, ${citySample.state}`,
            description: 'Lorem ipsum dolor, is corporis id corrupti. Ratione natus voluptatem incidunt voluptates eveniet commodi tempora illum, maxime recusandae doloribus?'
        });
        await camp.save();
    }
}

seedDB();
