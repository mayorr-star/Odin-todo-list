function saveToLocalStorage(key, item) {
    const stringifiedItem = JSON.stringify(item);
    localStorage.setItem(key, stringifiedItem);
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export {saveToLocalStorage, getFromLocalStorage};