export default (restaurant) => {
    let menu = [];
    menu.push({name: "Kuřecí maso s nudlemi", period: "permanent"});
    return Promise.resolve(menu);
}