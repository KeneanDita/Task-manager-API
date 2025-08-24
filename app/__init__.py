from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Initialize database object
db = SQLAlchemy()


def create_app():
    """Factory function to create Flask app"""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object("instance.config.Config")

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    from .routes import task_bp, main_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(task_bp, url_prefix="/tasks")

    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    return app
