const express = require("express");

const app = express();
const PORT = 3000;

// ECS will provide the internal Flask service URL.
const BACKEND_URL = process.env.BACKEND_URL || "http://flask:5000";

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "express",
  });
});

// The ALB routes /api/* requests to the Flask target group.
app.get("/api/health", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({
      status: "error",
      message: "Flask backend is unavailable",
    });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/students`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({
      message: "Unable to connect to Flask backend",
    });
  }
});

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management Dashboard</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f3f6fb;
            color: #243047;
        }

        header {
            background: #183b70;
            color: white;
            padding: 25px 8%;
        }

        main {
            max-width: 1000px;
            margin: 35px auto;
            padding: 0 20px;
        }

        section {
            background: white;
            padding: 25px;
            margin-bottom: 25px;
            border-radius: 12px;
        }

        button {
            background: #2563eb;
            color: white;
            border: 0;
            border-radius: 7px;
            padding: 12px 18px;
            cursor: pointer;
        }

        #status { margin-left: 10px; }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th, td {
            padding: 14px 10px;
            border-bottom: 1px solid #e7ebf2;
        }

        th { background: #f5f8fd; }

        .active {
            color: #187448;
            background: #e0f2e8;
            padding: 6px 10px;
            border-radius: 20px;
        }
    </style>
</head>
<body>
    <header>
        <h1>Student Management Dashboard</h1>
        <p>Express Frontend + Flask Backend on ECS Fargate</p>
    </header>

    <main>
        <section>
            <h2>Student Overview</h2>
            <p>Student records are loaded from the Flask API.</p>
            <button onclick="loadStudents()">Load Students</button>
            <span id="status">Loading...</span>
        </section>

        <section>
            <h2>Student Records</h2>
            <p id="count">Loading student records...</p>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="students"></tbody>
            </table>
        </section>
    </main>

    <script>
        async function loadStudents() {
            const status = document.getElementById("status");
            const table = document.getElementById("students");
            const count = document.getElementById("count");

            status.textContent = "Loading...";
            table.replaceChildren();

            try {
                const response = await fetch("/api/students");

                if (!response.ok) {
                    throw new Error("Backend request failed");
                }

                const data = await response.json();
                count.textContent = "Total students: " + data.total_students;

                data.students.forEach(student => {
                    const row = document.createElement("tr");

                    [
                        student.student_id,
                        student.name,
                        student.course
                    ].forEach(value => {
                        const cell = document.createElement("td");
                        cell.textContent = value;
                        row.appendChild(cell);
                    });

                    const statusCell = document.createElement("td");
                    const badge = document.createElement("span");
                    badge.className = "active";
                    badge.textContent = "Active";
                    statusCell.appendChild(badge);
                    row.appendChild(statusCell);

                    table.appendChild(row);
                });

                status.textContent = "Backend connected";
            } catch (error) {
                count.textContent = "Could not load student records.";
                status.textContent = "Backend unavailable";
            }
        }

        loadStudents();
    </script>
</body>
</html>
    `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express frontend running on port ${PORT}`);
});
