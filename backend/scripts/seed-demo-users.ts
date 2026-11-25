import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database";
import { ProfileModel } from "../src/modules/profiles/profile.model";
import { UserModel } from "../src/modules/auth/user.model";

const demoUsers = [
  {
    email: "student.a@skillbridge.demo", password: "StudentA-Demo-2026!", full_name: "Student A",
    department: "Computer Science", year: 3,
    bio: "Project creator building an AI-powered campus navigation experience.",
    skills: ["Python", "Machine Learning", "Product Planning"], interests: ["AI", "Smart Campus", "Accessibility"],
  },
  {
    email: "student.b@skillbridge.demo", password: "StudentB-Demo-2026!", full_name: "Student B",
    department: "Computer Science", year: 2,
    bio: "Frontend developer interested in building useful tools for campus life.",
    skills: ["React", "JavaScript", "TypeScript", "CSS"], interests: ["Frontend", "Accessibility", "Campus Apps"],
  },
];

async function seedDemoUsers() {
  await connectDatabase();
  for (const demo of demoUsers) {
    const user = await UserModel.findOneAndUpdate(
      { email: demo.email },
      { $set: { full_name: demo.full_name, passwordHash: await bcrypt.hash(demo.password, 12) }, $setOnInsert: { email: demo.email } },
      { upsert: true, new: true, runValidators: true },
    );
    await ProfileModel.findOneAndUpdate(
      { userId: String(user._id) },
      { $set: { full_name: demo.full_name, department: demo.department, year: demo.year, bio: demo.bio, skills: demo.skills, interests: demo.interests } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    console.info(`Seeded ${demo.full_name}: ${demo.email}`);
  }
}

seedDemoUsers().catch(error => {
  console.error("Could not seed demo users.", error);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
