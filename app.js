const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const fs = require("fs");
const fetch = require("node-fetch");

const { HOST, expiryTimeInDays } = require("./constants");
const { getData } = require("./getData");
const { upload } = require("./upload");
const responseState = require("./responseState");

const { createFileBin } = require("./createFilebin");
const { FileSystemCache } = require("./FileSystemCache_1");

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
  const title = await getData(url);

  try {
    const res = await fetch(`${HOST}/getLink`, {
      method: "post",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ url, q: 128 }),
    });
    const file = await res.blob();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    //   const buffer = Buffer.from(file, "binary");
    //   file.pipe(fs.createWriteStream(`${title}.mp4`));
    fs.writeFileSync(`${title}.mp3`, buffer);

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

  if (await redisPlaylistCache.fileExists(playlistID)) {
    const { binname, playListName } = await redisPlaylistCache.get(playlistID);
    console.log("playlist cache exist");
    responseState.setState(true);
    responseState.setData({ status: "ok", playListName, binname });
    res.json("getting list");
    return;
  }

  console.log("🚀 ~ file: app.js ~ line 23 ~ app.post ~ tracks", playListData);
  const names = getNamesFromPlaylist(playListData);
  console.log("names: ", names);
  const urls = await getURLfromNames(names);
  console.log("data urls: ", urls);

  const binname = await createFileBin();
  console.log(binname);

  try {
    for (let url of urls) {
      const title = await getAudioDownloadLink(url);
      await upload(binname, `./${title}.mp3`);
    }
    redisPlaylistCache.setExpiry(
      playlistID,
      { binname, playListName },
      expiryTimeInDays * 60 * 60 * 24
    );
    responseState.setState(true);
    responseState.setData({ status: "ok", binname, playListName });
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

  if (await redisTracksCache.fileExists(trackIDS)) {
    const binname = await redisTracksCache.get(trackIDS);
    console.log("track cache exist");
    responseState.setState(true);
    responseState.setData({ status: "ok", binname });
    // res.json({ status: "ok", binname });
    res.json("getting list");
    return;
  }

  const urls = await getURLfromNames(names);
  console.log("data urls: ", urls);

  const binname = await createFileBin();
  console.log(binname);

  try {
    for (let url of urls) {
      const title = await getAudioDownloadLink(url);
      await upload(binname, `./${title}.mp3`);
    }
    redisTracksCache.setExpiry(
      trackIDS,
      binname,
      expiryTimeInDays * 60 * 60 * 24
    );
    responseState.setState(true);
    responseState.setData({ status: "ok", binname });
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
});
