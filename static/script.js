// ===== SEARCH WITH DEBOUNCE =====
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

document.getElementById("search").addEventListener("keyup", debounce(function() {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#internTable tr");
    rows.forEach((row, i) => {
        if (i === 0) return; // skip header
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
}, 200)); // 200ms debounce

// ===== SORT TABLE =====
function sortTable(colIndex) {
    let table = document.getElementById("internTable");
    let rows = Array.from(table.rows).slice(1);
    let asc = table.getAttribute("data-sort") !== "asc";

    rows.sort((a, b) => {
        let x = a.cells[colIndex].innerText.trim();
        let y = b.cells[colIndex].innerText.trim();

        // Try numeric comparison first
        let numX = parseFloat(x), numY = parseFloat(y);
        if (!isNaN(numX) && !isNaN(numY)) {
            return asc ? numX - numY : numY - numX;
        }

        return asc ? x.localeCompare(y) : y.localeCompare(x);
    });

    rows.forEach(r => table.appendChild(r));
    table.setAttribute("data-sort", asc ? "asc" : "desc");
}

// ===== CHART =====
fetch("/stats")
.then(res => res.json())
.then(data => {
    new Chart(document.getElementById("chart"), {
        type: "pie",
        data: {
            labels: ["Active", "Completed"],
            datasets: [{
                data: [data.active, data.completed],
                backgroundColor: ["#3498db", "#2ecc71"],
                borderColor: "#ffffff",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed} interns`;
                        }
                    }
                }
            }
        }
    });
});

// ===== COMPANY CHART =====
fetch("/company-stats")
.then(r => r.json())
.then(data => {
    new Chart(document.getElementById("companyChart"), {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Number of Interns',
                data: Object.values(data),
                backgroundColor: "#ff6b6b",
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} interns`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { ticks: { autoSkip: false } }
            }
        }
    });
});
