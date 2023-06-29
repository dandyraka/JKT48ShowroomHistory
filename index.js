import fs from "fs";
import fetch from "node-fetch";
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta').locale('id');

async function getLive() {
    const url = 'https://www.showroom-live.com/api/live/onlives';
    try {
        const response = await fetch(url);
        const json = await response.json();
        const data = json.onlives;

        const OnlivesIdol = data.find(onlvs => onlvs.genre_id === 102);
        const livesOnlivesIdol = OnlivesIdol ? OnlivesIdol.lives : [];
        const OnlivesMusic = data.find(onlvs => onlvs.genre_id === 101);
        const livesOnlivesMusic = OnlivesMusic ? OnlivesMusic.lives : [];
        const allLives = livesOnlivesIdol.concat(livesOnlivesMusic);
        const filterAll = allLives.filter(live => live.room_url_key.includes('JKT48') && live.premium_room_type != 1);

        const filePath = 'history.txt';

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
        }

        const existingData = fs.readFileSync(filePath, 'utf8');

        for (const data of filterAll) {
            const username = (data.main_name || 'No Name').trim();
            const startTimestamp = data.started_at;
            const started = moment.unix(startTimestamp).format("dddd, D MMM YYYY HH:mm:ss");
            
            const newData  = `${username} | ${started}`
            if (existingData.includes(newData)) {
                console.log('Data already exists. Not appended to file.');
            } else {
                fs.appendFileSync(filePath, newData + '\n');
                console.log('Data appended to file successfully.');
            }
        }
    } catch (error) {
        console.log(`Fetch Error: ${error}`);
    }
}

await getLive();