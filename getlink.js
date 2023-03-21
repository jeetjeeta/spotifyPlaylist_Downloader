

const ytdl = require("ytdl-core");



const getDownloadLinkByItag = (formats, itag) => {
  const formatObj = formats.find((format) => format.itag === Number(itag));
  if (formatObj.itag === 140) {
    return { url: formatObj.url, cL: formatObj.contentLength };
  }
  return formatObj.url;
};

const getLink= async (url) => {
  
  console.log("url: ", url);

  const info = await ytdl.getInfo(url);
  const { formats } = info;
  const title = info.videoDetails.title;

  const itag = "140";
  let dobj = getDownloadLinkByItag(formats, itag);
  let dURL = dobj.url;
  const end = dobj.cL;
  dURL = dURL + `&title=${encodeURIComponent(title)}&range=0-${end}`;

  console.log("audio durl: ", dURL);

  // const urlDown = await tiny.shorten(dURL);

  return { urlDown: dURL, title }

  
};

module.exports={getLink}

