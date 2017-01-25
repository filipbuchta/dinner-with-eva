export function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        fetch(`https://cors-anywhere.herokuapp.com/${url}`)
            .then((response) => response.text())
            .then(text => {
                let parser = new DOMParser();
                let dom = parser.parseFromString(text, "text/html");
                resolve(dom);
            })
    });
}


export const DAYS = ["PONDĚLÍ", "ÚTERÝ", "STŘEDA", "ČTVRTEK", "PÁTEK"];


export function getDayOfWeek() {
    let day = new Date().getDay();
    if (day === 0) {
        day = 6;
    } else {
        day--;
    }
    return day;
}


import lokofu from "./lokofu"
import vulcano from "./vulcano"
import kfc from "./kfc"
import nepal from "./nepal"
import buddha from "./buddha"
import montebu from "./montebu"
import myslivna from "./myslivna"
import zakki from "./zakki"

export {lokofu, vulcano, kfc, nepal, buddha, montebu, /*myslivna,*/ zakki}