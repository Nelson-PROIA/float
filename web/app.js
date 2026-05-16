// Float frontend - v0.2
const API = "/api";
const TOKEN = "user_alex_demo";
const DAILY_LIMIT = 500;

async function fetchActivity() {
  const res = await fetch(`${API}/transfers`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function sendMoney(recipientId, amount, memo) {
  const res = await fetch(`${API}/transfers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipientId, amount, memo }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function renderActivity(items) {
  const list = document.getElementById("activityList");
  if (items.length === 0) {
    list.innerHTML = `<li class="px-6 py-8 text-center text-slate-400 text-sm">No activity yet.</li>`;
    return;
  }
  list.innerHTML = items
    .map((item) => {
      const sent = item.direction === "sent";
      const amountSign = sent ? "-" : "+";
      const amountColor = sent ? "text-slate-900" : "text-emerald-600";
      const otherParty = sent ? item.recipientId : item.senderId;
      const directionLabel = sent
        ? `<span class="text-[10px] font-medium uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">sent</span>`
        : `<span class="text-[10px] font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">received</span>`;
      return `
      <li class="px-6 py-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-slate-200"></div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <div class="font-medium">${escapeHtml(otherParty)}</div>
            ${directionLabel}
          </div>
          <div class="text-sm text-slate-500">${escapeHtml(item.memo || "")} &middot; ${formatDate(item.createdAt)}</div>
        </div>
        <div class="font-medium ${amountColor}">${amountSign}$${item.amount.toFixed(2)}</div>
      </li>
    `;
    })
    .join("");
}

function updateSpentToday(items) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const spent = items
    .filter((i) => i.direction === "sent" && new Date(i.createdAt) >= startOfDay)
    .reduce((sum, i) => sum + i.amount, 0);
  document.getElementById("spentToday").innerHTML =
    `$${spent.toFixed(2)} <span class="text-slate-400 font-normal">of $${DAILY_LIMIT} daily limit</span>`;
  document.getElementById("spentBar").style.width =
    `${Math.min((spent / DAILY_LIMIT) * 100, 100)}%`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function formatDate(s) {
  return new Date(s).toLocaleDateString();
}

document.getElementById("sendBtn").addEventListener("click", async () => {
  const recipientId = prompt("Send to (user ID):");
  if (!recipientId) return;
  const amount = parseFloat(prompt("Amount:"));
  if (!amount) return;
  const memo = prompt("Memo (optional):") || undefined;
  try {
    await sendMoney(recipientId, amount, memo);
    await init();
  } catch (err) {
    alert(err.message);
  }
});

async function init() {
  try {
    const data = await fetchActivity();
    renderActivity(data.activity);
    updateSpentToday(data.activity);
  } catch (err) {
    console.error(err);
    document.getElementById("activityList").innerHTML =
      `<li class="px-6 py-8 text-center text-slate-400 text-sm">Failed to load.</li>`;
  }
}

init();
