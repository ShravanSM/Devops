const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post("/submit", async (req, res) => {
    try {
        const response = await fetch("http://backend:5000/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                name: req.body.name,
                age: req.body.age
            })
        });

        const result = await response.text();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Could not connect to backend");
    }
});

app.listen(3000, () => {
    console.log("Frontend running on port 3000");
});