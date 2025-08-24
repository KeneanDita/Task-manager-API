from flask import Blueprint, request, jsonify
from .models import Task
from . import db

task_bp = Blueprint("tasks", __name__)
main_bp = Blueprint("main", __name__)


@main_bp.route("/", methods=["GET"])
def home():
    return (
        """
    <h1>Welcome to the Task Manager API</h1>
    <p>Use the <code>/tasks/</code> endpoint to access tasks.</p>
    """,
        200,
    )


# Create task
@task_bp.route("/", methods=["POST"])
def create_task():
    data = request.get_json()
    new_task = Task(
        title=data["title"],
        description=data.get("description", ""),
        completed=data.get("completed", False),
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201


# Get all tasks
@task_bp.route("/", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])


# Get single task
@task_bp.route("/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict())


# Update task
@task_bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.completed = data.get("completed", task.completed)

    db.session.commit()
    return jsonify(task.to_dict())


# Delete task
@task_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return "", 204
