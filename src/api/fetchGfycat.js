const fetchGfycat = async (url) => {
    return new Promise((resolve, reject)=>{
        let id = url.replace(/^.*gfycat.com\/([^/?]+)(?:[/?].*)?$/, '$1');
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.gfycat.com/v1/gfycats/${id}`, true);
        xhr.addEventListener('load', ()=>{
            try {
                let data = JSON.parse(xhr.responseText);
                resolve(data.gfyItem.webmUrl);
            } catch (ex) {
                resolve();
            }
        });
        xhr.addEventListener('error', ()=>resolve());
        xhr.send();
    });
};

export default fetchGfycat;