import { listsView } from './lists.js';

setLocalStorage();
listsView();

function setLocalStorage(){
    let lists = localStorage.getItem('lists');
    if (lists === null) {
        localStorage.setItem('lists', JSON.stringify([]));
    }
}