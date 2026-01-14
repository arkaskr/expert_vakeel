import { verifyToken } from "../utils/jwt.js";
import { getClientByEmail } from "../models/clientModel.js";
import { db } from "../config/firebase.js";

/**
 * Protect routes – verify JWT and attach client to req.client
 */
export async function authenticate(req, res, next) {
  try {
    let token;

    // Check for token in Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // Check for token in cookies
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyToken(token);

    const client = await getClientByEmail(payload.email);
    if (!client) return res.status(401).json({ message: "Client not found" });

    req.client = {
      id: client.id,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone || '',
      role: client.role,
      fullName: client.fullName
    };
    next();
  } catch (err) {
    console.error("Auth error:", err.message || err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * Role based guard
 */
export function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.client) return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.length) return next();
    if (!allowedRoles.includes(req.client.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

/**
 * Authenticate admin/sub-admin – verify JWT and attach user to req.user
 */
export async function authenticateAdmin(req, res, next) {
  try {
    let token;

    // Check for token in Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // Check for token in cookies
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const payload = verifyToken(token);

    // Verify user exists in database
    let userData = null;
    let collection = null;

    if (payload.role === 'admin') {
      collection = 'admins';
    } else if (payload.role === 'subAdmin') {
      collection = 'subAdmins';
    } else {
      return res.status(401).json({ success: false, error: "Invalid role" });
    }

    const snapshot = await db.collection(collection).doc(payload.id).get();
    if (!snapshot.exists) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    userData = snapshot.data();

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      isActive: userData.isActive,
      allowedTabs: userData.allowedTabs || []
    };

    next();
  } catch (err) {
    console.error("Admin auth error:", err.message || err);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

