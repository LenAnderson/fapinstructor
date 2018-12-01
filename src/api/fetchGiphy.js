const fetchGiphy = async (url) => {
    let giphy =  /^https?:\/\/giphy\.com\/gifs\/(?:[^/]+-)?([^-/]+)(?:\/.*)?$/;
    let media =  /^https?:\/\/media\.giphy\.com\/media\/([^-/]+)\/giphy\.[^.]+$/;
    let iGiphy = /^https?:\/\/i\.giphy\.com\/media\/([^-/]+)\.[^.]+$/;
    let id;
    if (url.search(giphy) === 0) {
        id = url.replace(giphy, '$1');
    } else if (url.search(media) === 0) {
        id = url.replace(media, '$1');
    } else if (url.search(iGiphy) === 0) {
        id = url.replace(iGiphy, '$1');
    } else {
        return null;
    }
    return `https://i.giphy.com/media/${id}/giphy.mp4`;
};

export default fetchGiphy;