import axios from 'axios';

export const getTempTransliteration = async (word: string): (Promise<string> | null) => {

    const url = `https://api.yamli.com/transliterate.ashx?word=${encodeURIComponent(word)}&tool=api&account_id=000006&prot=https&hostname=AliMZaini&path=yamli-api&build=5515`;

    try {
        const response = await axios.get(url);
        const rawData = response.data; // JSON string
        const candidates = rawData["r"].split("|").map(x => x.slice(0, -2));

        console.log(candidates[0]);
        return candidates[0];
    } catch (error) {
        console.error("Error fetching transliteration:", error);
        return null;
    }
}