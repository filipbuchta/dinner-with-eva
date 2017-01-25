import {fetchHtml} from "./index";

export default async function parse(restaurant) {
    let url = "http://grill-vulcano.cz/tydenni-menu--2297.html";
    let dom = await fetchHtml(url);

    let everything = dom.querySelectorAll("div.supernad")[0];
    everything.querySelectorAll(".lead")[0].remove();

    let foods = [];

    let lines = everything.innerText;
    let currentName = "";
    for (let line of lines.split("\n")) {
        //    console.log(line);
        line = line.trim();
        if (line.length === 0)
            continue;
        if (line.startsWith("Těšíme"))
            continue;
        if (line.startsWith("Z našeho"))
            continue;
        if (line.startsWith("TÝDENNÍ MENU"))
            continue;
        if (line.startsWith("Týdenní"))
            continue;

        if (line.indexOf(",-") !== -1) {
            currentName = currentName.replace(/[1-9][0-9]{1,2}g/, "");
            currentName = currentName.trim();
            let isSoup = foods.length === 0;
            foods.push({name: currentName, period: "week", isSoup: isSoup});
            currentName = "";
        } else {
            currentName += " " + line;
        }
    }

    return foods;
}