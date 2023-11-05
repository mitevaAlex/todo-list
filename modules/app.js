import { html, render } from '../node_modules/lit-html/lit-html.js';

import { listsView } from './lists.js';
import { createListView } from './create-list.js';

setLocalStorage();
listsView();
setCreateListBtn();

function setLocalStorage(){
    let lists = localStorage.getItem('lists');
    if (lists === null) {
        localStorage.setItem('lists', JSON.stringify([]));
    }
}

function setCreateListBtn(){
    let createBtn = document.querySelector('#new-list-btn');
    createBtn.addEventListener('click', createListView);
}