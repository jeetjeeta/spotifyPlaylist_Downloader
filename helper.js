const dotenv = require("dotenv");
dotenv.config();

const {youtube} =require('scrape-youtube')

const clientID = process.env.clientID;

const clientSecret = process.env.clientSecret;

const key = process.env.key;

const BASE_URL = "https://api.spotify.com/v1";

const youtubeBASE_URL = "https://youtube.googleapis.com/youtube/v3/";

const fetch = require("node-fetch");

const getToken = async () => {
  console.log("🚀 ~ file: helper.js ~ line 2 ~ clientID", clientID);
  console.log("🚀 ~ file: helper.js ~ line 4 ~ clientSecret", clientSecret);
  const url = "https://accounts.spotify.com/api/token";

  const authOptions = {
    method: "post",
    // url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " + new Buffer(clientID + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",

    // json: true,
  };

  const result = await fetch(url, authOptions);
  const data = await result.json();
  return data.access_token;
};

const getPlaylistTracks = async (token, playlistID) => {
  if (
    playlistID.length > 4 &&
    playlistID.substr(0, 4).toLowerCase() === "http"
  ) {
    console.log("http url");
    const regex = /playlist\/(.*)[\/?]*/;
    playlistID = regex.exec(playlistID)[1];
    // return null;
  }

  const playListURL = BASE_URL + "/playlists/" + playlistID + "/tracks";
  console.log("playlisturl: ", playListURL);

  try {
    const res = await fetch(playListURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(
    //   "🚀 ~ file: helper.js ~ line 62 ~ getPlaylistTracks ~ data",
    //   data
    // );
    return { playListData: data, playlistID };
  } catch (err) {
    console.log(
      "🚀 ~ file: helper.js ~ line 64 ~ getPlaylistTracks ~ err",
      err
    );

    return { error: "something wrong" };
  }
};

const getNamesFromPlaylist = (playListData) => {
  console.log(
    "🚀 ~ file: helper.js ~ line 65 ~ getNamesFromPlaylist ~ playListData",
    playListData
  );
  const names = playListData.tracks.items.map((item) => {
    const artistsArray = item.track.artists.map((artist) => artist.name);
    const artistsString = artistsArray.join(" ");
    return item.track.name + " " + artistsString;
  });
  return names;
};

const getURLfromNames = async (names) => {
  const videoUrls = [];
  for (let name of names) {
    // const ytAPIURL =
    //   youtubeBASE_URL +
    //   "search" +
    //   "?" +
    //   "part=snippet" +
    //   "&q=" +
    //   encodeURIComponent(name) +
    //   "&key=" +
    //   key;

    // const res = await fetch(ytAPIURL, {
    //   method: "get",
    // });
    // const ytSearchData = await res.json();

    const ytSearchData=await youtube.search(name)
    const vidid=ytSearchData.videos[0].id

    // videoUrls.push(
    //   "https://www.youtube.com/watch?v=" + ytSearchData.items[0].id.videoId
    // );

    videoUrls.push("https://www.youtube.com/watch?v=" +vidid)
  }
  return videoUrls;
};

const getNamesFromTracks = async (token, tracks) => {
  const names = [];
  const trackIDS = [];
  for (let track of tracks) {
    let trackID = track;
    if (track.length > 4 && track.substr(0, 4).toLowerCase() === "http") {
      console.log("http url");
      const regex = /track\/(.*)[\/?]*/;
      trackID = regex.exec(track)[1];
      // return null;
    }

    trackIDS.push(trackID);

    const trackURL = BASE_URL + "/tracks/" + trackID;

    try {
      const res = await fetch(trackURL, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // console.log(data);
      const artistsArray = data.artists.map((artist) => artist.name);
      const artistsString = artistsArray.join(" ");
      const name = data.name + " " + artistsString;
      names.push(name);
    } catch (err) {
      console.log(
        "🚀 ~ file: helper.js ~ line 145 ~ getNamesFromTracks ~ err",
        err
      );
      return { error: "something wrong" };
    }
  }
  return { names, trackIDS };
};

module.exports = {
  getToken,
  getPlaylistTracks,
  getURLfromNames,
  getNamesFromPlaylist,
  getNamesFromTracks,
};
