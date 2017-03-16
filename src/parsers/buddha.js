import {DAYS, getDayOfWeek, fetchHtml} from "./index";

export default async function parse(restaurant) {

    let today = DAYS[getDayOfWeek()];

    let dom = await fetchHtml("http://www.indian-restaurant-buddha.cz/");

    let foods = [];

    if (today != null) {
        let everything = (dom.querySelectorAll("#jidelnilisteklong")[0]).innerText;

        let dayStarted = false;
        for (let line of everything.split("\n")) {
            line = line.trim();
            if (line.length === 0)
                continue;
            if (line.indexOf(today) !== -1) {
                dayStarted = true;
                continue;
            }
            if (!dayStarted)
                continue;
            if (line.toLowerCase().indexOf("příloha") !== -1)
                break;
            if (line.startsWith("("))
                continue;

            line = line.replace(/Polévka\s?:/, "");
            line = line.replace(/0\s?,\s?2\s?l/i, "");
            line = line.replace(/[1-9][0-9]{1,2}g/, "");
            line = line.replace(/[1-9][0-9]{1,2},- Kč/, "");
            line = line.replace(/, A:[0-9 +]*/, "");
            line = line.trim();
            let isSoup = foods.length === 0;
            foods.push({name: line, period: "day", isSoup: isSoup});
        }
    }
    return foods;


}