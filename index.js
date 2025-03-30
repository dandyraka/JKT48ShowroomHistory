import fs from "fs";
import fetch from "node-fetch";
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta').locale('id');

async function getLive() {
    const url = 'https://www.showroom-live.com/api/live/onlives';
    try {
        const response = await fetch(url);
        const json = await response.json();
        const data = response.data.onlives;

        const OnlivesIdol = data.filter(onlvs => onlvs.genre_name == "Popularity" || onlvs.genre_name == "global");
        const combinedLives = OnlivesIdol.reduce((acc, genre) => {
            return acc.concat(genre.lives);
        }, []);
        const filterAll = combinedLives.filter(live => live.room_url_key.includes('JKT48') && live.premium_room_type === 0 && live.follower_num >= 5000);

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
