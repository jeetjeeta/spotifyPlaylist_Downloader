const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8082;
const fs = require("fs");
const fetch = require("node-fetch");
const {getLink}=require('./getlink')

// fs.readFileSync('csd',{encoding: 'binary'})

const {
  HOST,
  expiryTimeInDays,
  illegalChar,
  uploadService,
} = require("./constants");
const { getData } = require("./getData");
const { upload } = require("./upload");
const { ipFsUpload } = require("./ipfsUpload");

const responseState = require("./responseState");

const { createFileBin } = require("./createFilebin");
const { FileSystemCache } = require("./FileSystemCache_1");
const { redisClient } = require("./redis");

const {
  getNamesFromPlaylist,
  getPlaylistTracks,
  getToken,
  getURLfromNames,
  getNamesFromTracks,
} = require("./helper");

const app = express();

app.use(express.static(__dirname + "/build"));
app.use(cors({ credentials: true }));
app.use(express.json());

const redisTracksCache = new FileSystemCache({ basePath: "spotify_track" });
const redisPlaylistCache = new FileSystemCache({
  basePath: "spotify_playlist",
});

const getAudioDownloadLink = async (url) => {
  // const title = await getData(url);

  try {
    // const res = await fetch(`${HOST}/getLink`, {
    //   method: "post",
    //   mode: "cors",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({ url, q: 128 }),
    // });
    // const data = await res.json();
    const data=await getLink(url)

    let { urlDown, title } = data;

    console.log(
      "🚀 ~ file: app.js ~ line 49 ~ getAudioDownloadLink ~ title",
      title
    );

    console.log('urldown: ',urlDown)
     let initialTime = Date.now();

    const res2 = await fetch(urlDown);
    const file = await res2.blob();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("got blob");
      console.log("Took " + (Date.now() - initialTime) / 1000 + "s");

    // console.log("bytelength: ", buffer.byteLength());
    // console.log(
    //   "🚀 ~ file: app.js ~ line 59 ~ getAudioDownloadLink ~ buffer",
    //   buffer
    // );
    //   const buffer = Buffer.from(file, "binary");
    //   file.pipe(fs.createWriteStream(`${title}.mp4`));
    // fs.writeFileSync(`./${title}.mp3`, buffer);

    //
    const regex = new RegExp(`[${illegalChar}]`, "g");
    title = title.replace(regex, "");
    fs.writeFileSync(`music/${title}.mp3`, buffer);

    return title;
  } catch (err) {
    console.log(err);
  }
};

app.post("/getDownloadLinksPlaylist", async (req, res) => {
  responseState.setState(false);
  responseState.setData(null);

  const { playlistURL } = req.body;
  const token = await getToken();
  console.log("🚀 ~ file: app.js ~ line 24 ~ app.post ~ token", token);

  const { playListData, playlistID, error } = await getPlaylistTracks(
    token,
    playlistURL
  );

  if (error) {
    responseState.setState(true);
    responseState.setData({ status: "error" });
    // res.status(500).json("Something wrong");
    res.json("getting list");
    return;
  }

  const playListName = playListData.name;

  let gatewayURLS = [];
  let binname = "";
  if (await redisPlaylistCache.fileExists(playlistID)) {
    if (uploadService === "ipfs") {
      const { gatewayURLS, playListName } = await redisPlaylistCache.get(
        playlistID
      );
      responseState.setData({
        status: "ok",
        gatewayURLS,
        playListName,
        type: "ipfs",
      });
    } else {
      const { binname, playListName } = await redisPlaylistCache.get(
        playlistID
      );
      responseState.setData({
        status: "ok",
        playListName,
        binname,
        type: "filebin",
      });
    }
    // const { binname, playListName } = await redisPlaylistCache.get(playlistID);
    // const obj = await redisPlaylistCache.get(playlistID);
    console.log("playlist cache exist");
    responseState.setState(true);

    res.json("getting list");
    return;
  }

  console.log("🚀 ~ file: app.js ~ line 23 ~ app.post ~ tracks", playListData);
  const names = getNamesFromPlaylist(playListData);
  console.log("names: ", names);
  const urls = await getURLfromNames(names);
  console.log("data urls: ", urls);

  binname = await createFileBin();
  console.log(binname);

  const titles = [];
  try {
    for (let url of urls) {
      const title = await getAudioDownloadLink(url);
      titles.push(title);
      if (uploadService === "filebin")
        await upload(binname, `music/${title}.mp3`);
    }
    let gatewayURLS = [];
    if (uploadService === "ipfs") {
      gatewayURLS = await ipFsUpload(titles);
      redisPlaylistCache.setExpiry(
        playlistID,
        { gatewayURLS, playListName },
        expiryTimeInDays * 60 * 60 * 24
      );
      responseState.setState(true);
      responseState.setData({
        status: "ok",
        gatewayURLS,
        playListName,
        type: "ipfs",
      });
    } else {
      redisPlaylistCache.setExpiry(
        playlistID,
        { binname, playListName },
        expiryTimeInDays * 60 * 60 * 24
      );
      responseState.setState(true);
      responseState.setData({
        status: "ok",
        binname,
        playListName,
        type: "filebin",
      });
    }

    // res.json({ status: "ok", binname });
  } catch (err) {
    console.log(err);
    responseState.setState(true);
    responseState.setData({
      status: "some error",
      binname: "",
      playListName: "",
    });
    // res.status(500).json("some error");
  }

  res.json("getting list");
  // await upload(binname,"./Alice in Chains - Them Bones (2022 Remaster).mp3");
  //   const link = await upload("./AliceinChainsThemBones2022Remaster.mp3");
  //   console.log("link: ", link);
  //   await upload(
  //     "./Conway Twitty Loretta Lynn Louisiana Woman , Mississippi Man.mp3"
  //   );
});

app.post("/getDownloadLinksIndividual", async (req, res) => {
  responseState.setState(false);
  responseState.setData(null);
  const { tracks } = req.body;
  const token = await getToken();
  console.log("🚀 ~ file: app.js ~ line 86 ~ app.post ~ token", token);

  const { names, trackIDS, error } = await getNamesFromTracks(token, tracks);
  console.log(names);

  if (error) {
    responseState.setState(true);
    responseState.setData({ status: "Something wrong" });
    // res.status(500).json("Something wrong");
    res.json("getting list");
    return;
  }

  const titles = [];
  let gatewayURLS = [];
  let binname = "";
  if (await redisTracksCache.fileExists(trackIDS)) {
    if (uploadService === "ipfs") {
      gatewayURLS = await redisTracksCache.get(trackIDS);
      responseState.setData({ status: "ok", gatewayURLS, type: "ipfs" });
    } else {
      binname = await redisTracksCache.get(trackIDS);
      responseState.setData({ status: "ok", binname, type: "filebin" });
    }
    console.log("track cache exist");
    responseState.setState(true);

    // res.json({ status: "ok", binname });
    res.json("getting list");
    return;
  }

  const urls = await getURLfromNames(names);
  console.log("data urls: ", urls);

  binname = await createFileBin();
  console.log(binname);

  try {
    for (let url of urls) {
      const title = await getAudioDownloadLink(url);
      titles.push(title);
      if (uploadService === "filebin")
        await upload(binname, `music/${title}.mp3`);
    }

    if (uploadService === "ipfs") {
      const gatewayURLS = await ipFsUpload(titles);
      redisTracksCache.setExpiry(
        trackIDS,
        gatewayURLS,
        expiryTimeInDays * 60 * 60 * 24
      );
      responseState.setData({ status: "ok", gatewayURLS, type: "ipfs" });
    } else {
      redisTracksCache.setExpiry(
        trackIDS,
        binname,
        expiryTimeInDays * 60 * 60 * 24
      );
      responseState.setData({ status: "ok", binname, type: "filebin" });
    }

    responseState.setState(true);

    res.json("getting list");
    // res.json({ status: "ok", binname });
  } catch (err) {
    console.log(err);
    responseState.setState(true);
    responseState.setData({ status: "error" });
    res.json("getting list");
    // res.status(500).json("some error");
  }
});

app.get("/getResponseState", (req, res) => {
  console.log(responseState);
  res.json({ state: responseState.currentState, data: responseState.data });
});

app.listen(PORT, () => {
  console.log("app is running in PORT ", PORT);
  // redisClient.FLUSHALL("sync"); //("ASYNC", function (err, succeeded)
});
