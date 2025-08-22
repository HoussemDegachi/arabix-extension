import axios from 'axios';

const isUrlValid = (str: string) => {
    const urlRegex = new RegExp("((http|https)://)?(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)");
    return urlRegex.test(str)
}

const isEmailValid = (str: string) => {
    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    return emailRegex.test(str)
}

const areAllCharactersInValid = (str: string) => {
    const charactersRegex = new RegExp("^[^a-zA-Z0-9]*$")
    return charactersRegex.test(str)
}

export const isTransliteratable = (str: string) => {
    if (isUrlValid(str) || isEmailValid(str) || Number(str) || areAllCharactersInValid(str)) return false
    return true
}

const getIgnoredWord = (str: string) => {
    // return the word that is inside this expression
    // /ignore{...}
    const ignoreRegex = new RegExp("\/ignore\{([^}]*)\}")
    return str.match(ignoreRegex) ? str.match(ignoreRegex)[1] : null;
}


export const getApiTransliteration = async (word: string): (Promise<string> | null) => {

    const url = `https://api.yamli.com/transliterate.ashx?word=${encodeURIComponent(word)}&tool=api&account_id=000006&prot=https&hostname=AliMZaini&path=yamli-api&build=5515`;
    if (!isTransliteratable(word)) return word

    const ignoredWord = getIgnoredWord(word)
    if (ignoredWord) return ignoredWord

    try {
        const response = await axios.get(url);
        const rawData = response.data; // JSON string
        const candidates = rawData["r"].split("|").map((x: string) => x.slice(0, -2));

        return candidates[0];
    } catch (error) {
        console.error("Error fetching transliteration:", error);
        throw `Unable to make api calls: ${error.message}`
    }
}