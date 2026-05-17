const data = require('./glossary.js');
const knownPhrases = data.trim().split(/\n/).map(normalizeText).filter(blanks);

const phrases = getPhraseCollection(knownPhrases);
const keys = [...new Set(phrases.map(([k]) => k))];

module.exports = { keys, phrases, test, clean: sanitizeText, normalizeText };

function blanks(s = null) {
    return s ? true : false;
}

function normalizeText(string = '') {
    // replace conjunctives, trim whitespace
    // and augment common multiple word groups

    let text = `${string}`.trim();
    const ignore = /(^#|^$)/.test(text);
    if (ignore) return null;

    text = text.replace(/\s+/g, " ");
    text = text.replace(/ (&|n|and) /i, ' (&|n|and) ');
    text = text.replace(/ (his|her) /i, ' (his|her) ');
    text = text.replace(/([\s^])?(your|my) /i, '$1(your|my) ');
    text = text.replace(/([\s^])?(you|we) /gi, '$1(you|we) ');

    return text;
}

function getPhraseCollection(array) {
    return array.map((s) => {
        const phrases = s.toLowerCase().split(/\s+/g);
        return phrases;
    });
}

function test(sentence = null) {
    if (!sentence) return null;

    const words = sanitizeText(sentence).split(' ');
    let array = getKeyWords(words).map(matchedPhrases);

    array = [].concat
        .apply([], array)
        .filter((array) => containsPhrase(array, sentence))
        .map((array) => array.join(' '));

    return array && array.length ? array : null;
}

function sanitizeText(text) {
    // remove non-word characters (aka not letters)
    // punctuation, quotes, apostrophe etc.
    return text
        .split(/\s+/g)
        .map((s) => s.replace(/\W+/g, ''))
        .join(' ');
}

function getKeyWords(wordArray) {
    // Return a Set of unique key words,
    // ie the word that matches the first word of a cliche phase
    // to reduce the work the original word array is de-duplicated

    const dictionary = [...new Set(wordArray)];
    const match = dictionary
        .map((s) => (keys.indexOf(s) + 1 ? s : null))
        .filter((s) => s);

    return match;
}

function containsPhrase(phrases, sentence) {
    // does the phase exist in the sentence?
    const text = phrases.join(' ');
    const rex = new RegExp(`${text}`, 'i');
    const match = rex.test(sentence);

    return match;
}

function matchedPhrases(keyword) {
    // return all relevant phrases for keyword
    //
    // For example "ace" returns
    // ace in the hole
    // ace up (his|her) sleeve
    return phrases.filter(([word]) => word === keyword); //?
}
