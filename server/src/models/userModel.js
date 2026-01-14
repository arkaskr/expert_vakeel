// models/user.model.js

class TravelPreferenceModel {
  constructor({ chattiness = null, smoking = null, music = null, pets = null } = {}) {
    this.chattiness = chattiness;
    this.smoking = smoking;
    this.music = music;
    this.pets = pets;
  }

  static fromData(data = {}) {
    if (!data) return null;
    return new TravelPreferenceModel({
      chattiness: data.chattiness ?? null,
      smoking: data.smoking ?? null,
      music: data.music ?? null,
      pets: data.pets ?? null,
    });
  }

  toJSON() {
    return {
      chattiness: this.chattiness ?? null,
      smoking: this.smoking ?? null,
      music: this.music ?? null,
      pets: this.pets ?? null,
    };
  }
}

class UserModel {
  constructor({
    id = null,
    email = null,
    loginType = null,
    profilePic = null,
    fcmToken = null,
    countryCode = null,
    phoneNumber = null,
    walletAmount = "0.0",
    isActive = null,
    isVerify = null,
    travelPreference = null, // TravelPreferenceModel | null
    createdAt = null, // Firestore Timestamp | Date | null
    reviewCount = "0.0",
    reviewSum = "0.0",
    bio = "",
    // legal professional
    userType = null, // "individual" | "law_firm"
    fullName = null,
    specializations = null, // string[]
    services = null, // string[]
    courts = null, // string[]
    city = null,
    completeAddress = null,
    isAddressPublic = null,
    yearsOfExperience = null,
    languages = null, // string[]
    // new field
    gender = null, // "male" | "female" | "other"
    // online status
    isOnline = null,
  } = {}) {
    this.id = id;
    this.email = email;
    this.loginType = loginType;
    this.profilePic = profilePic;
    this.fcmToken = fcmToken;
    this.countryCode = countryCode;
    this.phoneNumber = phoneNumber;
    this.walletAmount = walletAmount;
    this.isActive = isActive;
    this.isVerify = isVerify;
    this.travelPreference = travelPreference
      ? TravelPreferenceModel.fromData(travelPreference)
      : null;
    this.createdAt = createdAt;
    this.reviewCount = reviewCount;
    this.reviewSum = reviewSum;
    this.bio = bio;
    this.userType = userType;
    this.fullName = fullName;
    this.specializations = specializations;
    this.services = services;
    this.courts = courts;
    this.city = city;
    this.completeAddress = completeAddress;
    this.isAddressPublic = isAddressPublic;
    this.yearsOfExperience = yearsOfExperience;
    this.languages = languages;
    this.gender = gender;
    this.isOnline = isOnline;
  }

  static fromData(data = {}) {
    if (!data) return null;
    return new UserModel({
      ...data,
      travelPreference: data.travelPreference
        ? TravelPreferenceModel.fromData(data.travelPreference)
        : null,
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      loginType: this.loginType,
      profilePic: this.profilePic,
      fcmToken: this.fcmToken,
      countryCode: this.countryCode,
      phoneNumber: this.phoneNumber,
      walletAmount: this.walletAmount,
      isActive: this.isActive,
      isVerify: this.isVerify,
      travelPreference: this.travelPreference
        ? this.travelPreference.toJSON()
        : null,
      createdAt: this.createdAt,
      reviewCount: this.reviewCount,
      reviewSum: this.reviewSum,
      bio: this.bio,
      userType: this.userType,
      fullName: this.fullName,
      specializations: this.specializations,
      services: this.services,
      courts: this.courts,
      city: this.city,
      completeAddress: this.completeAddress,
      isAddressPublic: this.isAddressPublic,
      yearsOfExperience: this.yearsOfExperience,
      languages: this.languages,
      gender: this.gender,
      isOnline: this.isOnline,
    };
  }
}

// Firestore converter (so you can use .withConverter() in queries)
const userConverter = {
  toFirestore(user) {
    return user.toJSON();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return UserModel.fromData({ ...data, id: snapshot.id });
  },
};

export { UserModel, TravelPreferenceModel, userConverter };
