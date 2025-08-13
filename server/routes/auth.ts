import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { findUserByUsername, verifyPassword, isDbEnabled } from "../db";

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

export const handleSignIn: RequestHandler = async (req, res) => {
  const { username, password } = req.body || {};

  // Try DB first if configured
  if (isDbEnabled()) {
    try {
      const dbUser = await findUserByUsername(username);
      if (dbUser) {
        const ok = await verifyPassword(password, dbUser.password_hash);
        if (!ok) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
          sub: dbUser.username,
          role: dbUser.role,
          name: dbUser.name,
          assignedLocation: dbUser.assigned_location || undefined,
          assignedOffice: dbUser.assigned_office || undefined,
        };
        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN_SECONDS,
        });
        return res.status(200).json({
          accessToken: token,
          tokenType: "Bearer",
          id: dbUser.id,
          username: dbUser.username,
          name: dbUser.name,
          role: dbUser.role,
          authorities: [dbUser.role],
          assignedLocation: dbUser.assigned_location || undefined,
          assignedOffice: dbUser.assigned_office || undefined,
        });
      }
    } catch (e) {
      // fall through to mock
    }
  }

  // Fallback to mock users
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
    assignedLocation: user.assignedLocation,
    assignedOffice: user.assignedOffice,
  });
};

export const handleSignOut: RequestHandler = (_req, res) => {
  return res.status(200).json({ message: "Signed out" });
};