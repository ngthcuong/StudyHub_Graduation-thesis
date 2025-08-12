const config = require("../configs/config");
const { Web3Storage, File } = require("web3.storage");

const w3 = new Web3Storage({ token: config.w3sToken });

async function uploadFileBuffer(filename, buffer, mime) {
  const files = [new File([buffer], filename, { type: mime })];
  const cid = await w3.put(files, { wrapWithDirectory: false });
  return { cid, uri: `ipfs://${cid}`, gateway: `https://w3s.link/ipfs/${cid}` };
}

async function uploadJSON(obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const file = new File([blob], "metadata.json", { type: "application/json" });
  const cid = await w3.put([file], { wrapWithDirectory: false });
  return { cid, uri: `ipfs://${cid}`, gateway: `https://w3s.link/ipfs/${cid}` };
}

module.exports = {
  uploadFileBuffer,
  uploadJSON,
};
