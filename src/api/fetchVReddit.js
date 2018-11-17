const fetchVReddit = async (post) => {
    let media = post.media ? post.media.reddit_video : (post.secure_media) ? post.secure_media.reddit_video : null;

    if (media) {
        return media.fallback_url;
    }
};

export default fetchVReddit;