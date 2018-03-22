export default (restaurant) => {
    let menu = [];
    menu.push({name: "<img src='/smazak.png' />", period: "permament"});
    return Promise.resolve(menu);
}