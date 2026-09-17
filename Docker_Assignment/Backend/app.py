from flask import Flask, request

app = Flask(__name__)


@app.route("/submit", methods=["POST"])
def submit():
    if request.method=="POST":
        name = request.form.get("name")
        age = request.form.get("age")

        print("Name:", name)
        print("Age:", age)

        return "Data received successfully!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000 )