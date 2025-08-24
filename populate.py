import requests

# URL of your running Flask API
BASE_URL = "http://127.0.0.1:5000/tasks/"

# List of tasks to populate
tasks = [
    {
        "title": "Buy groceries",
        "description": "Get milk, eggs, bread, and vegetables",
        "completed": False,
    },
    {
        "title": "Walk the dog",
        "description": "Take Bruno for a 30-minute walk",
        "completed": True,
    },
    {
        "title": "Finish Flask project",
        "description": "Complete REST API and test endpoints",
        "completed": False,
    },
    {
        "title": "Read a book",
        "description": "Read at least 50 pages of 'Clean Code'",
        "completed": False,
    },
    {
        "title": "Workout for 30 minutes",
        "description": "Push-ups, squats, planks",
        "completed": True,
    },
    {"title": "Call mom", "description": "Check in with mom", "completed": False},
    {
        "title": "Clean the kitchen",
        "description": "Wash dishes, wipe counters, sweep floor",
        "completed": False,
    },
    {
        "title": "Write blog post",
        "description": "Draft a post about Flask REST APIs",
        "completed": True,
    },
    {
        "title": "Pay bills",
        "description": "Pay electricity, water, and internet bills",
        "completed": False,
    },
    {
        "title": "Prepare dinner",
        "description": "Cook a healthy meal with protein, veggies, carbs",
        "completed": False,
    },
]

# Send POST request for each task
for task in tasks:
    response = requests.post(BASE_URL, json=task)
    if response.status_code == 201:
        print(f"Created task: {task['title']}")
    else:
        print(
            f"Failed to create task: {task['title']} | Status code: {response.status_code}"
        )
