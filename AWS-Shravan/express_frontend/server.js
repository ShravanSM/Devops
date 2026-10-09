
const express = require("express");

const app = express();
const PORT = 3000;
const FLASK_API = "http://127.0.0.1:5000";

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const response = await fetch(`${FLASK_API}/students`);
        const students = await response.json();

        const studentRows = students.map(student => `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
            </tr>
        `).join("");

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Management Portal</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 50px auto;
                        background: #f4f6f9;
                        padding: 20px;
                    }
                    h1 { color: #1d3557; }
                    form, table {
                        background: white;
                        padding: 20px;
                        width: 100%;
                        box-sizing: border-box;
                        margin-bottom: 25px;
                    }
                    input, button {
                        padding: 10px;
                        margin: 5px 0;
                    }
                    input { width: 95%; }
                    button {
                        background: #1d3557;
                        color: white;
                        border: none;
                        cursor: pointer;
                    }
                    table { border-collapse: collapse; }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    th { background: #457b9d; color: white; }
                </style>
            </head>
            <body>
                <h1>Student Management Portal</h1>

                <h2>Add Student</h2>
                <form action="/add-student" method="POST">
                    <input name="name" placeholder="Student name" required>
                    <input name="course" placeholder="Course name" required>
                    <button type="submit">Add Student</button>
                </form>

                <h2>Registered Students</h2>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Course</th>
                    </tr>
                    ${studentRows}
                </table>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(502).send(
            "Cannot connect to Flask backend. Check whether Flask is running."
        );
    }
});

app.post("/add-student", async (req, res) => {
    try {
        const response = await fetch(`${FLASK_API}/students`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: req.body.name,
                course: req.body.course
            })
        });

        if (!response.ok) {
            return res.status(response.status).send(
                "Could not add student."
            );
        }

        res.redirect("/");
    } catch (error) {
        res.status(502).send("Cannot connect to Flask backend.");
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express frontend running on port ${PORT}`);
});
