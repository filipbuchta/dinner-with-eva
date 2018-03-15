export default (restaurant) => {
    let menu = [];
    menu.push({name: "Velmi červené rizoto s ajdamem", period: "permament"});
    menu.push({name: "Krém Bryléé bez bílků", period: "permament"});
    return Promise.resolve(menu);
}