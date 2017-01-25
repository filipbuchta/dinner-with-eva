import {DAYS, getDayOfWeek, fetchHtml} from "./index";

export default async function parse(restaurant) {


    let dom = await fetchHtml("http://www.monte-bu.cz/menu.php");

    let everything = (dom.querySelectorAll(".menu")[0]);


    everything.querySelector("h2").remove();
    for (let element of everything.querySelectorAll(".cena")) {
        element.remove();
    }

    let foods = [];

    for (let element of everything.querySelectorAll("p")) {
        let isSoup = foods.length == 0;

        let line = element.innerText;
        line = line.replace(/[1-4]\./, "");
        line = line.trim();

        foods.push({name: line, period: "day", isSoup: isSoup});
    }


    return foods;

}