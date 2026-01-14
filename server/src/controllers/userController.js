// controllers/userController.js
import { db, admin } from '../config/firebase.js';
import { UserModel } from '../models/userModel.js';

const COLLECTION = 'users';

// POST /users  (create)
export async function createUser(req, res) {
  try {
    const {
      email = null,
      loginType = null,
      profilePic = null,
      fcmToken = null,
      countryCode = null,
      phoneNumber = null,
      walletAmount = "0.0",
      isActive = null,
      isVerify = null,
      travelPreference = null,
      reviewCount = "0.0",
      reviewSum = "0.0",
      bio = "",
      userType = null,
      fullName = null,
      specializations = null,
      services = null,
      courts = null,
      city = null,
      completeAddress = null,
      isAddressPublic = null,
      yearsOfExperience = null,
      languages = null,
      gender = null,
      isOnline = null,
    } = req.body || {};

    // Minimal guard (tweak as needed)
    if (!email) return res.status(400).json({ success: false, error: 'email is required' });

    const docRef = db.collection(COLLECTION).doc(); // auto id
    const payload = new UserModel({
      id: docRef.id,
      email,
      loginType,
      profilePic,
      fcmToken,
      countryCode,
      phoneNumber,
      walletAmount,
      isActive,
      isVerify,
      travelPreference,
      createdAt: admin.firestore.Timestamp.now(),
      reviewCount,
      reviewSum,
      bio,
      userType,
      fullName,
      specializations,
      services,
      courts,
      city,
      completeAddress,
      isAddressPublic,
      yearsOfExperience,
      languages,
      gender,
      isOnline,
    });

    await docRef.set(payload.toJSON());
    const saved = await docRef.get();
    return res.status(201).json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /users/:id
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /users  (get all with filters)
export async function getAllUsers(req, res) {
  try {
    const {
      limit,
      startAfter,
      court,
      city,
      specialization,
      exp,
      language,
      profileType,
      verified,
      category,
      search
    } = req.query;

    const take = Math.min(Number(limit) || 50, 200);

    // Check for incompatible filter combinations
    const arrayFilters = [court, specialization, language].filter(f => f && f !== 'all');
    if (arrayFilters.length > 1) {
      return res.status(400).json({
        success: false,
        error: 'Cannot combine multiple array filters (court, specialization, language). Please use only one array filter at a time.'
      });
    }

    // Get base query
    let q = db.collection(COLLECTION).orderBy('createdAt', 'desc');
    let useClientSideFiltering = false;

    // Apply filters one by one, with fallbacks for complex queries
    if (court && court !== 'all') {
      q = q.where('courts', 'array-contains', court);
    }

    if (city && city !== 'all') {
      q = q.where('city', '==', city);
    }

    if (specialization && specialization !== 'all') {
      q = q.where('specializations', 'array-contains', specialization);
    }

    if (language && language !== 'all') {
      q = q.where('languages', 'array-contains', language);
    }

    if (profileType && profileType !== 'all') {
      q = q.where('userType', '==', profileType);
    }

    if (verified && verified !== 'all') {
      const isVerified = verified === 'Verified';
      q = q.where('isVerify', '==', isVerified);
    }

    // Handle experience filter - use client-side filtering to avoid compound query issues
    let experienceFilter = null;
    if (exp && exp !== 'all') {
      useClientSideFiltering = true;
      experienceFilter = exp;
    }

    // Handle category filter - use client-side filtering to avoid complex queries
    let categoryFilter = null;
    if (category && category !== 'all') {
      useClientSideFiltering = true;
      categoryFilter = category;
    }

    if (startAfter) {
      const cursorDoc = await db.collection(COLLECTION).doc(startAfter).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    // If using client-side filtering, get more data to filter
    const queryLimit = useClientSideFiltering ? Math.min(take * 3, 500) : take;
    const snaps = await q.limit(queryLimit).get();
    let data = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    // Apply client-side filters
    if (experienceFilter) {
      data = data.filter(user => {
        const expYears = user.yearsOfExperience;
        if (typeof expYears !== 'number') return false;

        switch (experienceFilter) {
          case '0–1': return expYears >= 0 && expYears <= 1;
          case '2–4': return expYears >= 2 && expYears <= 4;
          case '5–7': return expYears >= 5 && expYears <= 7;
          case '8–10': return expYears >= 8 && expYears <= 10;
          case '10+': return expYears >= 10;
          default: return true;
        }
      });
    }

    if (categoryFilter) {
      data = data.filter(user => {
        const specs = user.specializations || [];
        const courts = user.courts || [];

        switch (categoryFilter) {
          case 'Family Matters':
            return specs.some(s => ['Family', 'Divorce', 'Child Custody', 'Marriage'].includes(s));
          case 'Criminal Matters':
            return specs.some(s => ['Criminal', 'Crime', 'FIR', 'Bail'].includes(s));
          case 'Civil Matters':
            return specs.some(s => ['Civil', 'Property', 'Contract', 'Recovery'].includes(s));
          case 'Supreme Court Matters':
            return courts.includes('Supreme Court of India');
          default: return true;
        }
      });
    }

    // Apply search filter (always client-side)
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      data = data.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm) ||
        user.courts?.some(court => court.toLowerCase().includes(searchTerm)) ||
        user.specializations?.some(spec => spec.toLowerCase().includes(searchTerm)) ||
        user.city?.toLowerCase().includes(searchTerm)
      );
    }

    // Limit results to requested amount
    data = data.slice(0, take);

    return res.json({ success: true, data });
  } catch (err) {
    console.error('getAllUsers error:', err);
    console.error('Error stack:', err.stack);
    console.error('Error message:', err.message);

    // Handle specific Firestore errors
    if (err.message && err.message.includes('requires an index')) {
      console.log('Index error detected');
      return res.status(500).json({
        success: false,
        error: 'Database index error. Please try removing some filters or contact support.'
      });
    }

    if (err.message && err.message.includes('complex query')) {
      console.log('Complex query error detected');
      return res.status(500).json({
        success: false,
        error: 'Query too complex. Please try using fewer filters.'
      });
    }

    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}

// PUT /users/:id  (replace all fields)
export async function updateUserById(req, res) {
  try {
    const { id } = req.params;

    const existingRef = db.collection(COLLECTION).doc(id);
    const existing = await existingRef.get();
    if (!existing.exists) return res.status(404).json({ success: false, error: 'Not found' });

    // Build a full replacement object (no merge)
    const {
      email = null,
      loginType = null,
      profilePic = null,
      fcmToken = null,
      countryCode = null,
      phoneNumber = null,
      walletAmount = "0.0",
      isActive = null,
      isVerify = null,
      travelPreference = null,
      createdAt, // optional: keep original if not sent
      reviewCount = "0.0",
      reviewSum = "0.0",
      bio = "",
      userType = null,
      fullName = null,
      specializations = null,
      services = null,
      courts = null,
      city = null,
      completeAddress = null,
      isAddressPublic = null,
      yearsOfExperience = null,
      languages = null,
      gender = null,
      isOnline = null,
    } = req.body || {};

    const replacement = new UserModel({
      id,
      email,
      loginType,
      profilePic,
      fcmToken,
      countryCode,
      phoneNumber,
      walletAmount,
      isActive,
      isVerify,
      travelPreference,
      createdAt: createdAt || existing.data().createdAt || admin.firestore.Timestamp.now(),
      reviewCount,
      reviewSum,
      bio,
      userType,
      fullName,
      specializations,
      services,
      courts,
      city,
      completeAddress,
      isAddressPublic,
      yearsOfExperience,
      languages,
      gender,
      isOnline,
    }).toJSON();

    await existingRef.set(replacement, { merge: false });
    const saved = await existingRef.get();
    return res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (err) {
    console.error('updateUserById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /users/:id
export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteUserById error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE /users  (danger: delete all)
export async function deleteAllUsers(req, res) {
  try {
    const batchSize = 300;
    let deleted = 0;

    async function deleteBatch() {
      const snaps = await db.collection(COLLECTION).limit(batchSize).get();
      if (snaps.empty) return false;

      const batch = db.batch();
      snaps.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      deleted += snaps.size;
      return snaps.size === batchSize;
    }

    // Keep deleting until empty
    // ⚠️ Lock this down in production (admin-only)
    // eslint-disable-next-line no-constant-condition
    while (await deleteBatch()) {}

    return res.json({ success: true, deleted });
  } catch (err) {
    console.error('deleteAllUsers error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
