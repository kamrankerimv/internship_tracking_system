from flask import Flask, render_template, request, redirect, jsonify
import csv, os

app = Flask(__name__)
FILE = "interns.csv"

def read_interns():
    interns = []
    if os.path.exists(FILE):
        with open(FILE, newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            for i, row in enumerate(reader):
                interns.append([i] + row)
    return interns

def write_all(interns):
    with open(FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for i in interns:
            writer.writerow(i[1:])

@app.route("/")
def index():
    return render_template("index.html", interns=read_interns())

@app.route("/add", methods=["POST"])
def add():
    data = [
        request.form["name"],
        request.form["university"],
        request.form["company"],
        request.form["duration"],
        request.form["mentor"],
        request.form["status"],
        request.form["performance"]
    ]
    with open(FILE, "a", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow(data)
    return redirect("/")

@app.route("/delete/<int:id>")
def delete(id):
    interns = read_interns()
    interns.pop(id)
    write_all(interns)
    return redirect("/")

@app.route("/stats")
def stats():
    interns = read_interns()
    active = sum(1 for i in interns if i[6] == "Active")
    completed = len(interns) - active
    return jsonify({"active": active, "completed": completed})

from flask import send_file
@app.route("/export")
def export():
    try:
        return send_file("interns.csv",
                         mimetype="text/csv",
                         download_name="interns.csv",
                         as_attachment=True)
    except Exception as e:
        return str(e)

@app.route("/company-stats")
def company_stats():
    interns = read_interns()
    stats = {}
    for i in interns:
        company = i[3]
        stats[company] = stats.get(company, 0) + 1
    return jsonify(stats)


if __name__ == "__main__":
    app.run(debug=True)
