// SEARCH
document.getElementById("search").addEventListener("keyup", function() {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#internTable tr");
    rows.forEach((row, i) => {
        if (i === 0) return;
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});

// CHART
fetch("/stats")
.then(res => res.json())
.then(data => {
    new Chart(document.getElementById("chart"), {
        type: "pie",
        data: {
            labels: ["Active", "Completed"],
            datasets: [{
                data: [data.active, data.completed],
                backgroundColor: ["#3498db", "#2ecc71"]
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false
        }
    });
});

function sortTable(colIndex) {
    let table = document.getElementById("internTable");
    let rows = Array.from(table.rows).slice(1);
    let asc = table.getAttribute("data-sort") !== "asc";

    rows.sort((a, b) => {
        let x = a.cells[colIndex].innerText;
        let y = b.cells[colIndex].innerText;
        return asc ? x.localeCompare(y, undefined, {numeric:true}) 
                   : y.localeCompare(x, undefined, {numeric:true});
    });

    rows.forEach(r => table.appendChild(r));
    table.setAttribute("data-sort", asc ? "asc" : "desc");
}

fetch("/company-stats")
.then(r => r.json())
.then(data => {
    new Chart(document.getElementById("companyChart"), {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data)
            }]
        },
        options: {
            responsive: false
        }
    });
});
