// Modal Functions
function showAddTaskModal() {
    document.getElementById('addTaskModal').classList.add('show');
    document.getElementById('addTaskForm').reset();
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').classList.remove('show');
}

function showEditTaskModal() {
    document.getElementById('editTaskModal').classList.add('show');
}

function closeEditTaskModal() {
    document.getElementById('editTaskModal').classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addTaskModal');
    const editModal = document.getElementById('editTaskModal');

    if (event.target === addModal) {
        closeAddTaskModal();
    }
    if (event.target === editModal) {
        closeEditTaskModal();
    }
}

// Notification Functions
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add Task
async function addTask(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const taskData = {
        title: formData.get('title'),
        description: formData.get('description') || '',
        completed: false
    };

    try {
        const response = await fetch('/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            showNotification('Task added successfully!');
            closeAddTaskModal();
            // Reload page to show new task
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            const error = await response.json();
            showNotification('Error: ' + (error.error || 'Failed to add task'), true);
        }
    } catch (error) {
        showNotification('Error: Failed to add task', true);
        console.error('Error:', error);
    }
}

// Edit Task - Load task data
async function editTask(taskId) {
    try {
        const response = await fetch(`/tasks/${taskId}`);
        if (response.ok) {
            const task = await response.json();

            document.getElementById('editTaskId').value = task.id;
            document.getElementById('editTaskTitle').value = task.title;
            document.getElementById('editTaskDescription').value = task.description || '';
            document.getElementById('editTaskCompleted').checked = task.completed;

            showEditTaskModal();
        } else {
            showNotification('Error: Failed to load task', true);
        }
    } catch (error) {
        showNotification('Error: Failed to load task', true);
        console.error('Error:', error);
    }
}

// Update Task
async function updateTask(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const taskId = formData.get('id');

    const taskData = {
        title: formData.get('title'),
        description: formData.get('description') || '',
        completed: document.getElementById('editTaskCompleted').checked
    };

    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            showNotification('Task updated successfully!');
            closeEditTaskModal();
            // Reload page to show updated task
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            const error = await response.json();
            showNotification('Error: ' + (error.error || 'Failed to update task'), true);
        }
    } catch (error) {
        showNotification('Error: Failed to update task', true);
        console.error('Error:', error);
    }
}

// Delete Task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok || response.status === 204) {
            showNotification('Task deleted successfully!');
            // Reload page to show updated list
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showNotification('Error: Failed to delete task', true);
        }
    } catch (error) {
        showNotification('Error: Failed to delete task', true);
        console.error('Error:', error);
    }
}

// Toggle Task Status
async function toggleTaskStatus(taskId, completed) {
    try {
        // First get the current task data
        const getResponse = await fetch(`/tasks/${taskId}`);
        if (!getResponse.ok) {
            showNotification('Error: Failed to load task', true);
            return;
        }

        const task = await getResponse.json();

        // Update only the completed status
        const taskData = {
            title: task.title,
            description: task.description,
            completed: completed
        };

        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            showNotification(completed ? 'Task marked as completed!' : 'Task marked as pending!');

            // Update UI immediately
            const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
            const taskTitle = taskCard.querySelector('.task-title');

            if (completed) {
                taskCard.classList.remove('pending');
                taskCard.classList.add('completed');
                taskTitle.classList.add('strikethrough');
                taskCard.setAttribute('data-status', 'completed');
            } else {
                taskCard.classList.remove('completed');
                taskCard.classList.add('pending');
                taskTitle.classList.remove('strikethrough');
                taskCard.setAttribute('data-status', 'pending');
            }

            // Update stats
            updateStats();
        } else {
            // Revert checkbox on error
            const checkbox = document.getElementById(`task-${taskId}`);
            checkbox.checked = !completed;
            showNotification('Error: Failed to update task', true);
        }
    } catch (error) {
        // Revert checkbox on error
        const checkbox = document.getElementById(`task-${taskId}`);
        checkbox.checked = !completed;
        showNotification('Error: Failed to update task', true);
        console.error('Error:', error);
    }
}

// Filter Tasks
function filterTasks(filter) {
    const taskCards = document.querySelectorAll('.task-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter tasks
    taskCards.forEach(card => {
        const status = card.getAttribute('data-status');

        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Update Stats
function updateStats() {
    const taskCards = document.querySelectorAll('.task-card');
    const completedTasks = document.querySelectorAll('.task-card.completed').length;
    const pendingTasks = document.querySelectorAll('.task-card.pending').length;

    document.getElementById('total-tasks').textContent = taskCards.length;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press 'N' to open add task modal
    if (event.key === 'n' || event.key === 'N') {
        if (!document.getElementById('addTaskModal').classList.contains('show') &&
            !document.getElementById('editTaskModal').classList.contains('show')) {
            showAddTaskModal();
        }
    }

    // Press 'Escape' to close modals
    if (event.key === 'Escape') {
        closeAddTaskModal();
        closeEditTaskModal();
    }
});
