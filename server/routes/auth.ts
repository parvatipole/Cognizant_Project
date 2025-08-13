import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN_SECONDS = 60 * 60 * 24; // 24 hours

interface MockUser {
  id: string;
  username: string;
  password: string;
  role: "technician" | "admin";
  name: string;
  assignedLocation?: string;
  assignedOffice?: string;
}

const mockUsers: MockUser[] = [
  {
    id: "t1",
    username: "ashutosh",
    password: "cdc123",
    role: "technician",
    name: "Ashutosh",
    assignedLocation: "Pune",
    assignedOffice: "CDC Office",
  },
  {
    id: "t2",
    username: "rahul",
    password: "rahul123",
    role: "technician",
    name: "Rahul Verma",
    assignedLocation: "Mumbai",
    assignedOffice: "Andheri Tech Center",
  },
  {
    id: "a1",
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
];

export const handleSignIn: RequestHandler = (req, res) => {
  const { username, password } = req.body || {};

  const user = mockUsers.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = {
    sub: user.username,
    role: user.role,
    name: user.name,
    assignedLocation: user.assignedLocation,
    assignedOffice: user.assignedOffice,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  });

  return res.status(200).json({
    accessToken: token,
    tokenType: "Bearer",
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    authorities: [user.role],
  });
};

export const handleSignOut: RequestHandler = (_req, res) => {
  return res.status(200).json({ message: "Signed out" });
};