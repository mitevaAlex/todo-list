import { html, render } from '../node_modules/lit-html/lit-html.js';
import { listsView } from './lists.js';

export let pageBg = document.getElementById('page-bg');
export let formContainer = document.getElementById('create-form-container');

export function createListView(event) {
    pageBg.style.filter = 'blur(5px)';
    formContainer.style.display = 'block';

    let createForm = html`
        <form>
            <div class="list-content">
                <label>
                    List Title
                    <input type="text" name="listTitle">
                </label>
                <div class="tasks">
                    
                </div>
            </div>
            <div class="btn-wrapper">
                <button type="reset" @click=${closeForm}>
                    <i class="fa-solid fa-trash-can"></i>
                </button>
                <button type="button" class="new-task-btn" @click=${addTaskInput}>
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button type="submit" @click=${saveNewList}>
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        </form>`;

    render(createForm, formContainer);

    addTaskInput();
}

export function addTaskInput() {
    let tasks = document.getElementsByClassName('tasks')[0];

    let task = document.createElement('div');
    task.classList.add('task');
    let taskContent = `
        <label>
            Task Title
            <input type="text" name="taskTitle">
        </label>
        <label>
            Description
            <textarea name="description" cols="30" rows="3"></textarea>
        </label>
        <label>
            Deadline
            <input type="datetime-local" name="deadline">
        </label>`;
    task.innerHTML = taskContent;
    tasks.appendChild(task);
}

export function closeForm(event) {
    pageBg.style.filter = 'none';
    formContainer.style.display = 'none';
    let form = document.getElementsByTagName('form')[0];
    form.reset();
    let tasks = document.getElementsByClassName('tasks')[0];
    tasks.innerHTML = '';
}

function saveNewList(event) {
    event.preventDefault();
    let form = document.querySelector('form');
    let formData = new FormData(form);

    if (!isFormDataValid(formData)) {
        window.alert("All fields must be filled");
        return;
    }

    let listId = Math.random().toString(16).slice(2);
    let listObj = {
        _id: listId,
        listTitle: formData.get('listTitle'),
        tasks: []
    }

    formData.delete('listTitle');

    let tasksInfo = Array.from(formData);
    for (let i = 0; i < tasksInfo.length; i += 3) {
        let taskId = Math.random().toString(16).slice(2);
        let task = {
            _id: taskId,
            taskTitle: tasksInfo[i][1],
            description: tasksInfo[i + 1][1],
            deadline: tasksInfo[i + 2][1],
            checked: false
        };

        listObj.tasks.push(task);
    }

    let lists = JSON.parse(localStorage.getItem('lists'));
    lists.push(listObj);
    localStorage.setItem('lists', JSON.stringify(lists));

    closeForm();
    listsView();
}

export function isFormDataValid(formData) {
    for (const pair of formData.entries()) {
        if (!pair[1]) {
            return false;
        }
    }

    return true;
}