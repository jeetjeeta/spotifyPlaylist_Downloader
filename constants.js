// const HOST = "https://ytdownloadapi.onrender.com";
// const HOST = "http://localhost:8080";
const HOST = "https://spotifydownspace-1-q6405485.deta.app";

const goFileToken = "qPkKm2vFsKaSWYwDhfJlinjcJYsztHVO";
const parentFolderID = "27be1c0f-370c-4e48-b9c1-a1a3090fffe8";

const phantomKey = "ak-p8sz9-nkg08-1et8k-w0fbd-nf7en";
const phantomKey2 = "ak-cdz8m-8ahga-2b49t-5ccqw-j4r2f";
const phantomKey3 = "ak-te4r3-c2ty3-61cmm-k72nt-vqc33";
const expiryTimeInDaysStr = process.env.EXPIRY_TIME_IN_DAYS || "6";
const expiryTimeInDays = Number(expiryTimeInDaysStr);
// console.log("exporyDays: ", expiryTimeInDays);
// const expiryTimeInDays = 1 / (60 * 60 * 24);

const uploadService = process.env.UPLOAD_SERVICE || "ipfs"; // 'ipfs' or 'filebin'

const illegalChar = "#%&{}\\<>*?/$!'\":@`+|=";

module.exports = {
  HOST,
  goFileToken,
  parentFolderID,
  phantomKey,
  phantomKey2,
  phantomKey3,
  expiryTimeInDays,
  illegalChar,
  uploadService,
};
