import {DAYS, getDayOfWeek, fetchHtml} from "./index";

export default async function parse(restaurant) {

    let foods = [];

    let dom = await fetchHtml("http://www.hotelmyslivna.cz/poledni-menu/");

    let everything = (dom.querySelectorAll("#hotelw")[0]);

    let today = DAYS[getDayOfWeek()];


    if (today != null) {
        let lines = everything.innerText;

        let dayStarted = false;
        let currentName = "";


        for (let line of lines.split("\n")) {
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

            if (line.indexOf(",-") != -1) {
                continue;
            }

            let foodEnd = line.indexOf("Alergeny") != -1 || line.startsWith("I.") || line.startsWith("II.") || line.startsWith("III.");
            //console.log(line, foodEnd, currentName);
            if (foodEnd && currentName.length != 0) {
                currentName = currentName.replace(/[1-9][0-9]{1,2}[\s]?g/, "");
                currentName = currentName.replace(/0.25[\s]?l/, "");
                currentName = currentName.trim();
                currentName = currentName.trim();
                let isSoup = foods.length == 0;
                foods.push({name: currentName, period: "day", isSoup: isSoup});
                currentName = "";
            } else if (!foodEnd) {
                currentName += line;
            }
        }
    }
    return foods;
}
