const config = require("../configs/config");
const pinataSDK = require("@pinata/sdk");
const { Readable } = require("stream");

const pinata = new pinataSDK({ pinataJWTKey: config.pinataJwt });

function ipfsUriToCid(uri) {
  return uri?.startsWith("ipfs://") ? uri.slice(7) : uri;
}

async function fetchJSONFromIPFS(uriOrCid) {
  const cid = ipfsUriToCid(uriOrCid);
  const url = `${config.pinataGatewayBase}/ipfs/${cid}`;
  const { data } = await axios.get(url, { responseType: "json" });
  return data;
}

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function uploadFileBuffer(filename, buffer, mime) {
  const fileStream = bufferToStream(buffer);
  const options = {
    pinataMetadata: { name: filename },
    pinataOptions: { cidVersion: 1 },
  };
  const result = await pinata.pinFileToIPFS(fileStream, options);
  const cid = result.IpfsHash;
  return {
    cid,
    uri: `ipfs://${cid}`,
    gateway: `${config.pinataGatewayBase}/ipfs/${cid}`,
    mime,
  };
}

async function uploadJSON(obj, meta = {}) {
  const options = {
    pinataMetadata: {
      name: meta.name || "metadata.json",
      ...(meta.keyvalues ? { keyvalues: meta.keyvalues } : {}),
    },
    pinataOptions: { cidVersion: 1 },
  };
  const result = await pinata.pinJSONToIPFS(obj, options);
  const cid = result.IpfsHash;
  return {
    cid,
    uri: `ipfs://${cid}`,
    gateway: `${config.pinataGatewayBase}/ipfs/${cid}`,
  };
}

async function searchMetadataByKeyvalues(
  keyvalues = {},
  pageLimit = 50,
  pageOffset = 0
) {
  const options = {
    status: "pinned",
    pageLimit,
    pageOffset,
    metadata: {
      name: "metadata.json",
      keyvalues,
    },
  };
  const result = await pinata.pinList(options);
  return (
    result?.rows?.map((row) => ({
      cid: row.ipfs_pin_hash,
      uri: `ipfs://${row.ipfs_pin_hash}`,
      gateway: `${config.pinataGatewayBase}/ipfs/${row.ipfs_pin_hash}`,
      metadata: row.metadata,
      size: row.size,
      date_pinned: row.date_pinned,
      date_unpinned: row.date_unpinned,
    })) || []
  );
}

module.exports = {
  uploadFileBuffer,
  uploadJSON,
  searchMetadataByKeyvalues,
  fetchJSONFromIPFS,
};
