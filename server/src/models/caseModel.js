// models/caseModel.js

/**
 * Case Model
 * Represents a legal case in the system
 */
class CaseModel {
  constructor({
    id,
    createdById = "",
    caseNumber = "",
    caseTypeAndRegistration = "",
    firNumber = "",
    partitionarName = "",
    clientNumber = "",
    respondentName = "",
    secondPartyNumber = "",
    courtName = "",
    roomNumber = "",
    amountReceived = null,
    judgeName = "",
    judgePost = "",
    remarks = "",
    purpose = "",
    status = "OPEN",
    nextHearingDate = null,
    lastHearingDate = null,
    remindMeDate = null,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.createdById = createdById;
    this.caseNumber = caseNumber;
    this.caseTypeAndRegistration = caseTypeAndRegistration;
    this.firNumber = firNumber;
    this.partitionarName = partitionarName;
    this.clientNumber = clientNumber;
    this.respondentName = respondentName;
    this.secondPartyNumber = secondPartyNumber;
    this.courtName = courtName;
    this.roomNumber = roomNumber;
    this.amountReceived = amountReceived;
    this.judgeName = judgeName;
    this.judgePost = judgePost;
    this.remarks = remarks;
    this.purpose = purpose;
    this.status = status;
    this.nextHearingDate = nextHearingDate;
    this.lastHearingDate = lastHearingDate;
    this.remindMeDate = remindMeDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDoc(doc) {
    const data = doc?.data?.() ?? {};
    return new CaseModel({
      id: doc.id,
      createdById: String(data.createdById ?? ""),
      caseNumber: String(data.caseNumber ?? ""),
      caseTypeAndRegistration: String(data.caseTypeAndRegistration ?? ""),
      firNumber: String(data.firNumber ?? ""),
      partitionarName: String(data.partitionarName ?? ""),
      clientNumber: String(data.clientNumber ?? ""),
      respondentName: String(data.respondentName ?? ""),
      secondPartyNumber: String(data.secondPartyNumber ?? ""),
      courtName: String(data.courtName ?? ""),
      roomNumber: String(data.roomNumber ?? ""),
      amountReceived: data.amountReceived !== undefined ? Number(data.amountReceived) : null,
      judgeName: String(data.judgeName ?? ""),
      judgePost: String(data.judgePost ?? ""),
      remarks: String(data.remarks ?? ""),
      purpose: String(data.purpose ?? ""),
      status: String(data.status ?? "OPEN"),
      nextHearingDate: data.nextHearingDate,
      lastHearingDate: data.lastHearingDate,
      remindMeDate: data.remindMeDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  toJson() {
    return {
      createdById: this.createdById,
      caseNumber: this.caseNumber,
      caseTypeAndRegistration: this.caseTypeAndRegistration,
      firNumber: this.firNumber,
      partitionarName: this.partitionarName,
      clientNumber: this.clientNumber,
      respondentName: this.respondentName,
      secondPartyNumber: this.secondPartyNumber,
      courtName: this.courtName,
      roomNumber: this.roomNumber,
      amountReceived: this.amountReceived,
      judgeName: this.judgeName,
      judgePost: this.judgePost,
      remarks: this.remarks,
      purpose: this.purpose,
      status: this.status,
      nextHearingDate: this.nextHearingDate,
      lastHearingDate: this.lastHearingDate,
      remindMeDate: this.remindMeDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Optional Firestore converter
const caseConverter = {
  toFirestore(model) {
    return model.toJson();
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return CaseModel.fromDoc({ id: snapshot.id, data: () => data });
  },
};

export { CaseModel, caseConverter };
