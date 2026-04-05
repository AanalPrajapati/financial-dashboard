let transactions = JSON.parse(localStorage.getItem("data")) || [
  {amount: 5000, category: "Salary", type: "income"},
  {amount: 200, category: "Food", type: "expense"},
  {amount: 1000, category: "Shopping", type: "expense"}
];

function save() {
  localStorage.setItem("data", JSON.stringify(transactions));
}

function updateUI() {
  let income = 0, expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = "Income ₹" + income;
  document.getElementById("expense").innerText = "Expense ₹" + expense;
  document.getElementById("balance").innerText = "Balance ₹" + (income - expense);

  renderTable();
  renderInsights();
  renderCharts();
}

function renderTable() {
    let role=document.getElementById("role").value;
    console.log(document.getElementById("role").value);
  let search = document.getElementById("search").value.toLowerCase();
  let table = document.getElementById("table");

  table.innerHTML = `
    <tr>
      <th>Amount</th>
      <th>Category</th>
      <th>Type</th>
      ${role === "admin"?"<th>Action</th>":""}
    </tr>
  `;

  transactions
    .filter(t => t.category.toLowerCase().includes(search))
    .forEach((t, i) => {
      table.innerHTML += `
        <tr>
          <td>${t.amount}</td>
          <td>${t.category}</td>
          <td>${t.type}</td>
          <td>${role === "admin"?`<button onclick="deleteTx(${i})">Delete</button>`:""}</td>
        </tr>
      `;
    });
}

function addTransaction() {
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("category").value;
  let type = document.getElementById("type").value;
  let role= document.getElementById("role").value;

  if (!amount || !category) return alert("Enter data");

  transactions.push({amount: +amount, category, type});
  save();
  updateUI();
}

function deleteTx(i) {
  transactions.splice(i, 1);
  save();
  updateUI();
}

function renderInsights() {
  let map = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  let highest = Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b, "");

  document.getElementById("insights").innerHTML =` 
📊 Highest Spending: ${highest} <br>
💰 Total Transactions: ${transactions.length}
`;
}

/* Charts */
let lineChart, pieChart;

function renderCharts() {
  try {
    let income = transactions
      .filter(t => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    let expense = transactions
      .filter(t => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    if (pieChart) pieChart.destroy();

    let pieCanvas = document.getElementById("pieChart");
    if (!pieCanvas) return;

    pieChart = new Chart(pieCanvas, {
      type: 'pie',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          data: [income, expense],
          backgroundColor: ['#22c55e', '#ef4444']
        }]
      }
    });

    if (lineChart) lineChart.destroy();

    let lineCanvas = document.getElementById("lineChart");
    if (!lineCanvas) return;

    lineChart = new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels: transactions.map((_, i) => "T" + (i + 1)),
        datasets: [{
          label: "Trend",
          data: transactions.map(t =>
            t.type === "income" ? t.amount : -t.amount
          )
        }]
      }
    });

  } catch (err) {
    console.log("Chart error:", err);
  }
}
/* Role */
document.getElementById("role").addEventListener("change", (e) => {
  let role = e.target.value;
  document.getElementById("form").style.display =
    role === "admin" ? "block" : "none";
    renderTable();
});

/* Init */
updateUI();

