const imgurClientId = '73c75cbd34b8579';




const fetchImgur = async (url) => {
    if (url.search(/^https?:\/\/i\.imgur\.com/) === 0) {
        // direct link to imgur image: only replace ".gif" and ".gifv" with ".mp4"
        return fetchImgurDirectLink(url);
    }
    if (url.search(/\/a\/|\/gallery\//) > -1) {
        // link to an album: get album info and return direct links
        return fetchImgurAlbum(url);
    }
    // link to an image page: figure out if image or video and return direct link
    return fetchImgurPage(url);
};



const fetchImgurDirectLink = (url) => {
    //TODO verify that mp4 always works
    return url.replace(/\.(gifv|gif)$/, '.mp4');
}


const fetchImgurAlbum = async (url) => {
    return new Promise(async (resolve, reject) => {
        let parts = url.replace(/^https?:\/\/[^\/]+/, '').split('/');
        let id = parts[parts.length-1];
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.imgur.com/3/album/${id}`, true);
        xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientId}`);
        xhr.addEventListener('load', ()=>{
            let data = JSON.parse(xhr.responseText);
            if (data.data.images.length > 0) {
                resolve(data.data.images.map(it=>fetchImgurDirectLink(it.link)));
            } else {
                reject();
            }
        });
        xhr.addEventListener('error', ()=>{
            resolve();
        });
        xhr.send();
    });
}


const fetchImgurPage = async (url) => {
    return new Promise(async (resolve, reject) => {
        let parts = url.replace(/^https?:\/\/[^\/]+/, '').split('/');
        let id = parts[parts.length-1];
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.imgur.com/3/image/${id}`, true);
        xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientId}`);
        xhr.addEventListener('load', ()=>{
            let data = JSON.parse(xhr.responseText);
            resolve(fetchImgurDirectLink(data.data.link));
        });
        xhr.addEventListener('error', ()=>{
            resolve();
        });
        xhr.send();
    });
};




export default fetchImgur;