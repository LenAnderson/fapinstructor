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



const fetchImgurDirectLink = async (url) => {
    //TODO verify that mp4 always works
    let finalUrl = url.replace(/\.(gifv|gif)$/, '.mp4');
    if (finalUrl.search(/mp4$/) === -1) {
        return await new Promise((resolve, reject)=>{
            let img = new Image();
            img.addEventListener('load', ()=>{
                if (img.naturalHeight === 81 && img.naturalWidth === 161) resolve();
                else resolve(finalUrl);
            });
            img.addEventListener('error', ()=>{
                resolve();
            });
            img.src = finalUrl;
        });
    }
    return finalUrl;
}


const fetchImgurAlbum = async (url) => {
    return new Promise(async (resolve, reject) => {
        let parts = url.replace(/^https?:\/\/[^/]+/, '').split('/');
        let id = parts[parts.length-1];
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.imgur.com/3/album/${id}`, true);
        xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientId}`);
        xhr.addEventListener('load', ()=>{
            try {
                let data = JSON.parse(xhr.responseText);
                if (data.data.images.length > 0) {
                    resolve(Promise.all(data.data.images.map(it=>fetchImgurDirectLink(it.link))));
                } else {
                    resolve();
                }
            } catch (ex) {
                resolve();
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
        let parts = url.replace(/^https?:\/\/[^/]+/, '').split('/');
        let id = parts[parts.length-1];
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.imgur.com/3/image/${id}`, true);
        xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientId}`);
        xhr.addEventListener('load', ()=>{
            try {
                let data = JSON.parse(xhr.responseText);
                resolve(fetchImgurDirectLink(data.data.link));
            } catch (ex) {
                resolve();
            }
        });
        xhr.addEventListener('error', ()=>{
            resolve();
        });
        xhr.send();
    });
};




export default fetchImgur;