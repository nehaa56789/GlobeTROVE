// Run with: node seeder.js
// To clear DB:  node seeder.js --destroy

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Destination = require("./models/Destination");
const Flight = require("./models/Flight");
const Hotel = require("./models/Hotel");
const User = require("./models/User");

const destinations = [
  { city: "Santorini", country: "Greece", desc: "Iconic blue domes perched above the sparkling Aegean Sea.", price: 108000, rating: 4.9, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", tag: "Romantic", isPopular: true },
  { city: "Bali", country: "Indonesia", desc: "Lush rice terraces, ancient temples and legendary sunsets.", price: 74900, rating: 4.8, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tag: "Tropical", isPopular: true },
  { city: "Tokyo", country: "Japan", desc: "Where neon-lit modernity meets centuries of tradition.", price: 124900, rating: 4.9, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", tag: "Culture", isPopular: true },
  { city: "Amalfi Coast", country: "Italy", desc: "Pastel villages cascade down dramatic Mediterranean cliffs.", price: 98900, rating: 4.7, img: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=800&q=80", tag: "Scenic" },
  { city: "Maldives", country: "Indian Ocean", desc: "Crystal-clear lagoons with overwater bungalows.", price: 191500, rating: 5.0, img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80", tag: "Luxury", isPopular: true },
  { city: "Patagonia", country: "Argentina", desc: "Towering granite spires above vast wind-swept steppes.", price: 149900, rating: 4.8, img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", tag: "Adventure" },
  { city: "Marrakech", country: "Morocco", desc: "Labyrinthine medinas alive with color, spice and sound.", price: 66500, rating: 4.6, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tag: "Exotic" },
  { city: "Kyoto", country: "Japan", desc: "Ethereal bamboo groves and timeless zen gardens.", price: 116500, rating: 4.9, img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", tag: "Culture", isPopular: true },
];

const flights = [
  { from: "Mumbai", to: "Paris", airline: "Air France", dep: "08:30", arr: "22:15", dur: "7h 45m", price: 54000, stops: 0, class: "Economy" },
  { from: "Mumbai", to: "Paris", airline: "IndiGo", dep: "11:00", arr: "01:30+1", dur: "8h 30m", price: 49000, stops: 1, class: "Economy" },
  { from: "Delhi", to: "Tokyo", airline: "ANA", dep: "14:00", arr: "18:20+1", dur: "9h 20m", price: 91500, stops: 0, class: "Business" },
  { from: "Bangalore", to: "Bali", airline: "Singapore Air", dep: "00:30", arr: "11:15+1", dur: "7h 45m", price: 73200, stops: 1, class: "Economy" },
  { from: "Chennai", to: "Dubai", airline: "Emirates", dep: "03:15", arr: "06:00", dur: "3h 45m", price: 28500, stops: 0, class: "Economy" },
  { from: "Delhi", to: "London", airline: "British Airways", dep: "09:00", arr: "13:30", dur: "9h 30m", price: 82000, stops: 0, class: "Business" },
];

const hotels = [
  { name: "The Azure Palace", city: "Santorini", stars: 5, price: 35000, rating: 9.6, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80", amenities: ["Pool", "Spa", "Breakfast", "Sea View"] },
  { name: "Ubud Jungle Retreat", city: "Bali", stars: 4, price: 15000, rating: 9.2, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", amenities: ["Pool", "Yoga", "Garden", "Bar"] },
  { name: "Shinjuku Grand", city: "Tokyo", stars: 5, price: 25800, rating: 9.4, img: "https://images.unsplash.com/photo-1540304453527-62f979142a17?w=800&q=80", amenities: ["Gym", "Restaurant", "WiFi", "City View"] },
  { name: "Overwater Villa", city: "Maldives", stars: 5, price: 70800, rating: 9.8, img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", amenities: ["Private Pool", "Spa", "Butler", "Beach"] },
  { name: "Riad Al Andalus", city: "Marrakech", stars: 4, price: 12000, rating: 8.9, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", amenities: ["Rooftop", "Breakfast", "Hammam"] },
  { name: "Kyoto Zen Lodge", city: "Kyoto", stars: 4, price: 18500, rating: 9.1, img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", amenities: ["Garden", "Tea Ceremony", "Onsen"] },
];

const importData = async () => {
  try {
    await connectDB();
    await Destination.deleteMany();
    await Flight.deleteMany();
    await Hotel.deleteMany();

    await Destination.insertMany(destinations);
    await Flight.insertMany(flights);
    await Hotel.insertMany(hotels);

    console.log("✅ Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Destination.deleteMany();
    await Flight.deleteMany();
    await Hotel.deleteMany();
    await User.deleteMany();

    console.log("🗑️  All data destroyed!");
    process.exit();
  } catch (error) {
    console.error("❌ Destroy error:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "--destroy") {
  destroyData();
} else {
  importData();
}
