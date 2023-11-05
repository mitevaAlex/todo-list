import { html, render } from '../node_modules/lit-html/lit-html.js';
import { editListView } from './edit-lists.js';

export function listsView() {
    let listsContainer = document.querySelector('#lists-container');
    let listsInfo = JSON.parse(localStorage.getItem('lists'));

    let lists = html`
        ${(listsInfo.length !== 0)
            ? listsInfo.map(listView)
            : html``}
        <div id="new-list-btn" class="list">
            <i class="fa-solid fa-plus"></i>
        </div>`;
    render(lists, listsContainer);
}

function listView(data) {
    let tasksInfo = data.tasks;
    return html`
        <div class="list">
            <div class="list-header">
                <h4>${data.listTitle}</h4>
                <div class="menu-wrapper" id="${data._id}">
                    <i class="fa-solid fa-pen-to-square" @click=${editListView}></i>
                    <i class="fa-solid fa-trash-can" @click=${deleteList}></i>
                </div>
            </div>
            ${tasksInfo.map(taskView)}
        </div>`;
}

function taskView(data) {
    let formatedDeadline = new Date(data.deadline)
        .toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    return html`
        <div class="task-container">
            <input type="checkbox" name="taskTitle" id="${data._id}" ?checked=${data.checked} @click=${isCheckedActions}>
            <label for="${data._id}">${data.taskTitle}</label>
            <div class="task-content">
                <p>
                    <i class="fa-solid fa-pencil"></i>
                    ${data.description}
                </p>
                <time datetime="${data.deadline}">
                    <i class="fa-solid fa-calendar-days"></i>
                    ${formatedDeadline}
                </time>
            </div>
        </div>`;
}

function deleteList(event) {
    let shallDelete = window.confirm('Do you want to delete this list?');
    if (shallDelete) {
        let listId = event.target.parentElement.id;
        let lists = JSON.parse(localStorage.lists);
        let wantedList = lists.find(list => list._id === listId);
        let indexWantedList = lists.indexOf(wantedList);
        lists.splice(indexWantedList, 1);
        localStorage.setItem('lists', JSON.stringify(lists));
        listsView();
    }
}

function isCheckedActions(event) {
    let taskId = event.target.id;
    let lists = JSON.parse(localStorage.getItem('lists'));

    let indexWantedList;
    let indexWantedTask;
    for (let list of lists) {
        let wantedTask = list.tasks.find(task => task._id === taskId);
        if (wantedTask) {
            indexWantedList = lists.indexOf(list);
            indexWantedTask = list.tasks.indexOf(wantedTask);
            break;
        }
    }

    let isChecked = event.target.hasAttribute('checked');

    if (isChecked) {
        lists[indexWantedList].tasks[indexWantedTask].checked = false;
    } else  {
        lists[indexWantedList].tasks[indexWantedTask].checked = true;
    }

    localStorage.setItem('lists', JSON.stringify(lists));
}