const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certHash: {
      type: String,
      require: true,
    },
    certCode: {
      type: String,
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

module.exports = mongoose.model("Certificate", certificateSchema);
