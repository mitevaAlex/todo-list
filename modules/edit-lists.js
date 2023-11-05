import { html, render } from '../node_modules/lit-html/lit-html.js';
import { addTaskInput, closeForm, formContainer, isFormDataValid, pageBg } from './create-list.js';
import { listsView } from './lists.js';

let listId;
let lists;
let wantedList;

export function editListView(event) {
    pageBg.style.filter = 'blur(5px)';
    formContainer.style.display = 'block';

    listId = event.target.parentElement.id;
    lists = JSON.parse(localStorage.lists);
    wantedList = lists.find(list => list._id === listId);

    let editForm = html`
        <form>
            <div class="list-content">
                <label>
                    List Title
                    <input type="text" name="listTitle" value="${wantedList.listTitle}">
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
                <button type="submit" @click=${editList}>
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        </form>`;

    render(editForm, formContainer);

    addEditTaskInputs(wantedList.tasks);
}

function addEditTaskInputs(tasksInfo) {
    let tasks = document.getElementsByClassName('tasks')[0];
    for (let i = 0; i < tasksInfo.length; i++) {
        let taskInfo = tasksInfo[i];
        console.log(taskInfo.taskTitle);
        let task = document.createElement('div');
        task.classList.add('task');

        let taskContent = `
            <label>
                Task Title
                <input type="text" name="taskTitle" value="${taskInfo.taskTitle}">
            </label>
            <label>
                Description
                <textarea name="description" cols="30" rows="3">${taskInfo.description}</textarea>
            </label>
            <label>
                Deadline
                <input type="datetime-local" name="deadline" value="${taskInfo.deadline}">
            </label>`;
        task.innerHTML = taskContent;

        tasks.appendChild(task);
    }
}

function editList(event) {
    event.preventDefault();
    let form = document.querySelector('form');
    let formData = new FormData(form);

    if (!isFormDataValid(formData)) {
        window.alert("All fields must be filled");
        return;
    }

    wantedList.listTitle = formData.get('listTitle');
    wantedList.tasks = [];

    formData.delete('listTitle');

    let tasksInfo = Array.from(formData);
    for (let i = 0; i < tasksInfo.length; i += 3) {
        let taskId = Math.random().toString(16).slice(2);
        let task = {
            _id: taskId,
            taskTitle: tasksInfo[i][1],
            description: tasksInfo[i + 1][1],
            deadline: tasksInfo[i + 2][1],
            ckecked: false
        };

        wantedList.tasks.push(task);
    }

    let indexWantedList = lists.indexOf(wantedList);
    lists.splice(indexWantedList, 1, wantedList);
    localStorage.setItem('lists', JSON.stringify(lists));

    closeForm();
    listsView();
}