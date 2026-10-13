from flask import Flask, jsonify

app = Flask(__name__)

students = [
    {
        "student_id": "S001",
        "name": "Rahul Sharma",
        "course": "Python Backend Development"
    },
    {
        "student_id": "S002",
        "name": "Priya Verma",
        "course": "AWS Cloud Computing"
    },
    {
        "student_id": "S003",
        "name": "Arjun Patel",
        "course": "Docker and Kubernetes"
    }
]


@app.route("/")
def home():
    return jsonify({
        "message": "Student Management API",
        "status": "running",
        "endpoints": ["/health", "/students"]
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "flask-backend"
    })


@app.route("/students")
def get_students():
    return jsonify({
        "total_students": len(students),
        "students": students
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
