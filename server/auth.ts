import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthRequest extends Request {
  userId?: number;
  userType?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; userType: string };
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; userType: string };
      req.userId = decoded.userId;
      req.userType = decoded.userType;
    } catch (error) {
      // Token is invalid, but we continue without auth
    }
  }
  next();
};

export const requireLandlord = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userType !== "landlord") {
    return res.status(403).json({ message: "This action requires landlord privileges" });
  }
  next();
};

export const requireTenant = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userType !== "tenant") {
    return res.status(403).json({ message: "This action requires tenant privileges" });
  }
  next();
};

export const generateToken = (userId: number, userType: string): string => {
  return jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: "7d" });
};
