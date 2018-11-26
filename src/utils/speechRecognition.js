import createNotification from "engine/createNotification";


const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
rec.maxAlternatives = 1;
rec.addEventListener('end', rec.start.bind(rec));
rec.start();
let words = {};
rec.addEventListener('result', (result) => {
    let word = result.results[0][0].transcript.toLowerCase();
    console.log('[speechRecognition]', result.results[0][0]);
    createNotification(`You said: "${word}" (${Math.round(result.results[0][0].confidence*100)}%)`)
    if (words[word]) {
        words[word]();
    }
});

export const listenFor = async (word, callback) => {
    word = word.toLowerCase();
    if (words[word]) throw `Already listening for "${word}"!`;
    words[word] = callback;
};
export const stopListeningFor = (word) => {
    word = word.toLowerCase();
    if (words[word]) {
        delete words[word];
    }
};