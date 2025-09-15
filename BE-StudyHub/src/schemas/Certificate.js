const mongoose = require("mongoose");
const crypto = require("crypto");

function generateCertCode(issueDate = new Date(), learnerId, courseId) {
  // Format ngày: YYMMDD
  const datePart = issueDate.toISOString().slice(2, 10).replace(/-/g, "");

  // Sinh chuỗi gốc để hash (dựa trên learnerId + courseId + thời gian + random salt)
  const raw = `${learnerId}-${courseId}-${Date.now()}-${Math.random()}`;

  // Hash → base36 để rút gọn
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const encoded = parseInt(hash.slice(0, 8), 16).toString(36).toUpperCase();

  // Lấy 6 ký tự
  const codePart = encoded.slice(0, 6);

  return `CERT-${datePart}-${codePart}`;
}

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
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
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
