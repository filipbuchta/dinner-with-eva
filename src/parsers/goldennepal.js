import {DAYS, getDayOfWeek, fetchHtml} from "./index";

export default async function parse(restaurant) {

    let today = DAYS[getDayOfWeek()];

    let dom = await fetchHtml("http://goldennepal.cz/denni-menu/");

    let foods = [];

    if (today !== null) {
        let everything = (dom.querySelectorAll(".page__content")[0]).innerText;

        let i = 0;
        let dayStarted = false;
        for (let line of everything.split("\n")) {
            line = line.trim();
            if (line.length === 0)
                continue;

            if (today == line.toUpperCase()) {
                dayStarted = true;
                continue;
            }
            if (!dayStarted)
                continue;

            if (dayStarted && (DAYS.some(d => line.toUpperCase().indexOf(d) !== -1) || line.toUpperCase().indexOf("SOBOTA") !== -1)) {
                break;
            }

            i++;

            if (i === 2) { // description
                continue;
            } else if (i === 3) { // price
                i = 0;
                continue;
            }


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