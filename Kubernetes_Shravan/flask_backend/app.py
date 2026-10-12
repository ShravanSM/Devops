
from flask import Flask, jsonify, request

app = Flask(__name__)

students = [
    {"id": 1, "name": "Rahul", "course": "Python"},
    {"id": 2, "name": "Priya", "course": "AWS"}
]


@app.route("/")
def home():
    return jsonify({
        "message": "Student Management API is running"
    })


@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)


@app.route("/students", methods=["POST"])
def add_student():
    data = request.get_json()

    if not data or not data.get("name") or not data.get("course"):
        return jsonify({
            "error": "Name and course are required"
        }), 400

    student = {
        "id": max((s["id"] for s in students), default=0) + 1,
        "name": data["name"],
        "course": data["course"]
    }

    students.append(student)

    return jsonify(student), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
