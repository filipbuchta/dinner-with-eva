import {DAYS, getDayOfWeek, fetchHtml} from "./index";

export default async function parse(restaurant) {

    let foods = [];

    var today = DAYS[getDayOfWeek()];

    let dom = await fetchHtml("http://www.pizzazakki.cz/brno/pizzerie/poledni-menu");
    if (today != null) {
        let everything = (dom.querySelectorAll(".poledni-menu")[0]).innerText;

        let dayStarted = false;
        for (let line of everything.split("\n")) {
            line = line.trim();
            if (line.length == 0)
                continue;
            if (line.toUpperCase().indexOf(today) != -1) {
                dayStarted = true;
                continue;
            }
            if (!dayStarted)
                continue;

            if (DAYS.some(d => line.toUpperCase().indexOf(d) != -1)) {
                break;
            }

            if (line.indexOf("Kč") != -1)
                continue;

            line = line.replace(/\([1-9][0-9]{1,2},-\)/, "");
            line = line.replace(/Menu [1-3]:/, "");
            line = line.trim();
            let isSoup = foods.length == 0;
            foods.push({ name: line, period: "day", isSoup: isSoup});
        }
    }

    return foods;
}