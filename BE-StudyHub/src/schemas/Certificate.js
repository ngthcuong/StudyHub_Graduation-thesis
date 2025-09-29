const mongoose = require("mongoose");
const { generateCertCode } = require("../utils/helper");

const certificateSchema = new mongoose.Schema(
  {
    certHash: {
      type: String,
      require: true,
    },
    certCode: {
      type: String,
      unique: true,
      require: true,
    },
    issuer: {
      type: String,
      require: true,
    },
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    learnerAddress: {
      type: String,
      require: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseName: {
      type: String,
      require: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    metadataURI: { type: String, trim: true }, // metadataURI is the URI of the certificate metadata
    metadataCID: { type: String, trim: true, index: true }, // metadataCID is the CID of the certificate metadata
    fileCID: { type: String, trim: true }, // fileCID is the CID of the certificate file
    txHash: { type: String, trim: true, index: true }, // txHash is the transaction hash of the certificate
    network: { type: String, default: "sepolia" }, // network is the network of the certificate
  },
  { timestamps: true }
);

// Middleware: auto generate certCode trước khi lưu
certificateSchema.pre("save", async function (next) {
  if (!this.certCode) {
    let newCode;
    let exists = true;

    // Lặp cho tới khi tìm được code chưa trùng
    while (exists) {
      newCode = generateCertCode(this.issueDate, this.learnerId, this.courseId);
      const check = await mongoose.models.Certificate.findOne({
        certCode: newCode,
      });
      if (!check) exists = false;
    }

    this.certCode = newCode;
  }
  next();
});

module.exports = mongoose.model("Certificate", certificateSchema);
