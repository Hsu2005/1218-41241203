const apiUrl = 'https://nfutest.pythonanywhere.com/todos'; // 替換為實際 API 地址

// 顯示學生代辦事項
async function displayTasks(studentId) {
    const taskListDiv = document.getElementById('task-list');
    taskListDiv.innerHTML = ''; // 清空代辦事項列表

    try {
        const response = await fetch(`${apiUrl}?student_id=${studentId}`);
        const data = await response.json();
        
        if (data.todos.length > 0) {
            data.todos.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.innerHTML = `
                    <span>${task.task} - ${task.completed ? '完成' : '未完成'}</span>
                    <button onclick="editTask(${task.id}, '${task.task}', ${task.completed})">編輯</button>
                    <button onclick="deleteTask(${task.id})">刪除</button>
                `;
                taskListDiv.appendChild(taskItem);
            });
        } else {
            taskListDiv.innerHTML = '<p>此學生沒有代辦事項。</p>';
        }
    } catch (error) {
        console.error("錯誤:", error);
    }
}

// 新增代辦事項
async function addNewTask() {
    const studentId = document.getElementById('student-id').value;
    const taskName = document.getElementById('new-task-input').value;
    
    if (!studentId || !taskName) {
        alert('請填寫學號和任務名稱');
        return;
    }

    const newTask = {
        student_id: studentId,
        task: taskName
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            alert('代辦事項新增成功！');
            displayTasks(studentId); // 更新代辦事項列表
        } else {
            alert('新增代辦事項失敗');
        }
    } catch (error) {
        console.error("錯誤:", error);
    }
}

// 編輯代辦事項
function editTask(id, task, completed) {
    document.getElementById('edit-task-form').style.display = 'block';
    document.getElementById('edit-task-input').value = task;
    document.getElementById('edit-completed').checked = completed;

    document.getElementById('save-task-btn').onclick = () => saveTask(id);
    document.getElementById('cancel-task-btn').onclick = () => cancelEdit();
}

// 保存編輯後的代辦事項
async function saveTask(id) {
    const studentId = document.getElementById('student-id').value;
    const updatedTask = {
        student_id: studentId,
        task: document.getElementById('edit-task-input').value,
        completed: document.getElementById('edit-completed').checked
    };

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        if (response.ok) {
            alert('代辦事項已更新！');
            displayTasks(studentId); // 更新代辦事項列表
            cancelEdit(); // 隱藏編輯表單
        } else {
            alert('更新代辦事項失敗');
        }
    } catch (error) {
        console.error("錯誤:", error);
    }
}

// 取消編輯
function cancelEdit() {
    document.getElementById('edit-task-form').style.display = 'none';
}

// 刪除代辦事項
async function deleteTask(id) {
    const studentId = document.getElementById('student-id').value;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_id: studentId })
        });

        if (response.ok) {
            alert('代辦事項已刪除！');
            displayTasks(studentId); // 更新代辦事項列表
        } else {
            alert('刪除代辦事項失敗');
        }
    } catch (error) {
        console.error("錯誤:", error);
    }
}

// 點擊載入代辦事項按鈕
document.getElementById('load-tasks-btn').addEventListener('click', () => {
    const studentId = document.getElementById('student-id').value;
    if (studentId) {
        displayTasks(studentId);
    } else {
        alert('請輸入學號');
    }
});

// 點擊新增代辦事項按鈕
document.getElementById('add-task-btn').addEventListener('click', addNewTask);
