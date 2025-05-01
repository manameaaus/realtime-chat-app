import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  {
    email: "tuntun.mausi@example.com",
    fullName: "Tuntun Mausi",
    password: "123456",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDIXsX8Scw5jwqnMbiAcjUosOxGCpF1CDcsw&s",
  },
  {
    email: "mia.johnson@example.com",
    fullName: "Mia Johnson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },

  {
    email: "gajodhar.badmas@example.com",
    fullName: "Gajodhar Badmas",
    password: "123456",
    profilePic:
      "https://qph.cf2.quoracdn.net/main-qimg-9a7e164bdf0314c003a72cac9db910c9-lq",
  },
  {
    email: "daniel.rodriguez@example.com",
    fullName: "Daniel Rodriguez",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
