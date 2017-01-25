import {DAYS, getDayOfWeek, fetchHtml} from "./index";

export default async function parse(restaurant) {

    let dom = await fetchHtml("http://nepalbrno.cz/weekly-menu/");

    let everything = (dom.querySelectorAll(".the_content_wrapper > table")[0]);

    let today = DAYS[getDayOfWeek()];


    let foods = [];

    if (today !== null) {
        let lines = everything.innerText;

        let dayStarted = false;
        for (let line of lines.split("\n")) {
            line = line.trim();
            if (line.length === 0)
                continue;
            if (line.toUpperCase().indexOf(today) !== -1) {
                dayStarted = true;
                continue;
            }
            if (!dayStarted)
                continue;

            if (DAYS.some(d => line.toUpperCase().indexOf(d) !== -1)) {
                break;
            }
            if (line.startsWith("Obsažené")) {
                break;
            }

            if (line.indexOf("Kč") !== -1)
                continue;

            line = line.replace(/Polévka:/, "");
            line = line.replace(/[1-9][0-9]{1,2}g/, "");
            line = line.replace(/\([0-9, ]+\)/, "");
            line = line.replace(/[1-4]\./, "");
            line = line.trim();
            let isSoup = foods.length === 0;
            foods.push({name: line, period: "day", isSoup: isSoup});
        }
    }
    return foods;

}