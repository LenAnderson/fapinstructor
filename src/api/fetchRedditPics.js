// import fetchErome from "./fetchErome";
import fetchGfycat from "./fetchGfycat"
import store from "store";
import createNotification from "engine/createNotification";
import fetchImgur from "./fetchImgur";
import fetchImgurDirectLink from "./fetchImgur";
import fetchVReddit from "./fetchVReddit";

let after = {};

const fetchRedditPics = id => {
  return fetch(
    `https://www.reddit.com/r/${encodeURIComponent(id)}/hot/.json?after=${
      after[id] || ""
    }`
  )
    .then(response => response.json())
    .then(({ data }) => {
      after[id] = data.after;

      const images = data.children.map(
        ({ data: post }) => {
          switch (post.domain){
            case "gfycat.com": {
               return fetchGfycat(post.url);
            }
            case "erome.com": {
              return null; // fetchErome(post.url)
            }
            case "i.imgur.com": {
              return fetchImgurDirectLink(post.url);
            }
            case "imgur.com": {
              return fetchImgur(post.url);
            }
            case "i.redd.it": {
              return post.url;
            }
            case "v.redd.it": {
              return fetchVReddit(post);
            }
            default: {
              return null;
            }
          }
        }
      );

      return Promise.all(images);
    })
    .then(images=>images.flat().filter(image => !!image))
    .catch((error) => {
      if(id && !store.config["failedIds"].includes(id)){
         const redditIds = store.config["redditId"];
         let ids = redditIds.split(",").map(id => id.trim());

         ids.splice(ids.indexOf(id), 1);

         store.config["redditId"] = ids.join(",");
         store.config["failedIds"].push(id);

         createNotification(`${id} failed to retrieve and will not be included in this game.`, {}, false);
      }
      return [];
    });
};

export default fetchRedditPics;
