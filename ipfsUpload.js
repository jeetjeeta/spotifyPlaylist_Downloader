const { ThirdwebStorage } = require("@thirdweb-dev/storage");

const fs = require("fs");

const storage = new ThirdwebStorage();

const ipFsUpload = async (titles) => {
  //   const upload = await storage.upload({
  //     metadata: { name: "ghu.mp3" },
  //     alwaysUpload: true,
  //   });

  // const buffers = titles.map((title) => fs.readFileSync(`music/${title}.mp3`));
  const buffers = titles.map((titleObj) => titleObj.buffer);
  //   const uploads = await storage.uploadBatch([
  //     fs.readFileSync("Holiday_Boulevard_of_Broken_Dreams.mp3"),
  //     fs.readFileSync("test.txt"),
  //   ]);

  const uploads = await storage.uploadBatch(buffers);
  //   const upload = await storage.upload({
  // name: "gh.mp3",
  // file: fs.readFileSync("test.txt"),
  //   });

  // const gatewayURLS = uploads.map((upload) => storage.resolveScheme(upload));
  const gatewayURLS = [];

  for (let i = 0; i < uploads.length; i++) {
    const upload = uploads[i];
    const titleObj = titles[i];

    const gatewayURL = storage.resolveScheme(upload);

    const obj = { url: gatewayURL, title: titleObj.title };
    gatewayURLS.push(obj);
  }

  console.log("gateway urls: ", gatewayURLS);

  return gatewayURLS;

  //   console.log(`Gateway URL - ${storage.resolveScheme(upload[0])}`);
};

module.exports = { ipFsUpload };
