const express = require("express");

const app = express();
const PORT = 3000;
const BACKEND_URL = "http://127.0.0.1:5000";

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "express",
  });
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
        * { box-sizing: border-box; }

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

        header h1 { margin: 0 0 8px; }
        header p { margin: 0; color: #dce8ff; }

        main {
            max-width: 1000px;
            margin: 35px auto;
            padding: 0 20px;
        }

        .summary {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 3px 12px #0000000d;
            margin-bottom: 25px;
        }

        .summary h2 { margin-top: 0; }

        button {
            background: #2563eb;
            color: white;
            border: 0;
            border-radius: 7px;
            padding: 12px 18px;
            cursor: pointer;
            font-size: 15px;
        }

        button:hover { background: #1749b5; }

        #status { margin-left: 12px; font-size: 14px; }

        .table-wrap {
            overflow-x: auto;
            background: white;
            border-radius: 12px;
            padding: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th, td {
            padding: 15px 12px;
            border-bottom: 1px solid #e7ebf2;
        }

        th { background: #f5f8fd; }

        .badge {
            background: #e0f2e8;
            color: #187448;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 12px;
        }

        footer {
            text-align: center;
            color: #64748b;
            padding: 25px;
        }
    </style>
</head>
<body>
    <header>
        <h1>Student Management Dashboard</h1>
        <p>A demo application powered by Express.js and Flask</p>
    </header>

    <main>
        <section class="summary">
            <h2>Student Overview</h2>
            <p>View student records loaded from the Flask backend API.</p>
            <button onclick="loadStudents()">Load Students</button>
            <span id="status">Not loaded yet</span>
        </section>

        <section class="table-wrap">
            <h2>Student Records</h2>
            <p id="count">Click "Load Students" to view records.</p>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="students">
                    <tr>
                        <td colspan="4">No records loaded.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>

    <footer>
        Terraform Assignment 8 | Express Frontend + Flask Backend
    </footer>

    <script>
        async function loadStudents() {
            const status = document.getElementById("status");
            const table = document.getElementById("students");
            const count = document.getElementById("count");

            status.textContent = "Loading...";
            table.innerHTML = "";

            try {
                const response = await fetch("/api/students");

                if (!response.ok) {
                    throw new Error("Backend request failed");
                }

                const data = await response.json();

                count.textContent =
                    "Total students: " + data.total_students;

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
                    badge.className = "badge";
                    badge.textContent = "Active";
                    statusCell.appendChild(badge);
                    row.appendChild(statusCell);

                    table.appendChild(row);
                });

                status.textContent = "Backend connected";
            } catch (error) {
                status.textContent = "Unable to load students";
                count.textContent =
                    "Please check whether the Flask backend is running.";

                const row = document.createElement("tr");
                const cell = document.createElement("td");
                cell.colSpan = 4;
                cell.textContent = "Could not retrieve student records.";
                row.appendChild(cell);
                table.appendChild(row);
            }
        }

        loadStudents();
    </script>
</body>
</html>
    `);
});

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express frontend running on port ${PORT}`);
});
