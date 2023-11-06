import { createListView } from './create-list.js';
import { editListView } from './edit-lists.js';

let listsContainer = document.querySelector('#lists-container');

export function listsView() {
    clearListsContainer();

    let listsInfo = JSON.parse(localStorage.getItem('lists'));
    for (let i = 0; i < listsInfo.length; i++) {
        listView(listsInfo[i]);
    }

    let newListBtn = document.createElement('div');
    newListBtn.classList.add('list');
    newListBtn.setAttribute('id', 'new-list-btn');
    let newListBtnContent = `<i class="fa-solid fa-plus"></i>`;
    newListBtn.innerHTML = newListBtnContent;
    newListBtn.addEventListener('click', createListView);
    listsContainer.appendChild(newListBtn);
}

function listView(data) {
    let list = document.createElement('div');
    list.classList.add('list');
    let listContent = `
        <div class="list-header">
            <h4>${data.listTitle}</h4>
            <div class="menu-wrapper" id="${data._id}">
                <i class="fa-solid fa-pen-to-square"></i>
                <i class="fa-solid fa-trash-can"></i>
            </div>
        </div>`;
    list.innerHTML = listContent;

    let editBtn = list.querySelector('.fa-pen-to-square');
    editBtn.addEventListener('click', editListView);

    let deleteBtn = list.querySelector('.fa-trash-can');
    deleteBtn.addEventListener('click', deleteList);

    let tasksInfo = data.tasks;
    for (let i = 0; i < tasksInfo.length; i++) {
        taskView(tasksInfo[i], list);
    }

    listsContainer.appendChild(list);
}

function taskView(data, list) {
    let formatedDeadline = new Date(data.deadline)
        .toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    let task = document.createElement('div');
    task.classList.add('task-container');
    let taskContent = `
            <input type="checkbox" name="taskTitle" id="${data._id}">
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
            </div>`;
    task.innerHTML = taskContent;

    let checkbox = task.querySelector('input[type="checkbox"]');
    if (data.checked) {
        checkbox.setAttribute('checked', '');
    }

    checkbox.addEventListener('click', isCheckedActions);
    
    let time = task.querySelector('time');
    time.addEventListener('DOMContentLoaded', function(event) {
        console.log(event.target.dateTime);
        let deadline = new Date(event.target.dateTime);
        let now = new Date();
        let milliseconds = deadline.getTime() - now.getTime();
        if (milliseconds > 0) {
          window.setTimeout(function() {
            task.style.color = '#a3a3a3';
            time.style.color = '#a3a3a3';
            checkbox.setAttribute('disabled', '');
          }, milliseconds);
        }
        else {
          task.style.color = '#a3a3a3';
          time.style.color = '#a3a3a3';
          checkbox.setAttribute('disabled', '');
        } 
      });
      list.appendChild(task);
      
      let event = new Event('DOMContentLoaded');
      time.dispatchEvent(event);
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
    } else {
        lists[indexWantedList].tasks[indexWantedTask].checked = true;
    }

    localStorage.setItem('lists', JSON.stringify(lists));
}

function clearListsContainer() {
    listsContainer.innerHTML = '';
}