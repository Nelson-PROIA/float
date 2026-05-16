// Float frontend - v0.1
const API = "/api";
const TOKEN = "user_alex_demo";

async function fetchTransfers() {
  const res = await fetch(`${API}/transfers`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function renderActivity(transfers) {
  const list = document.getElementById("activityList");
  if (transfers.length === 0) {
    list.innerHTML = `<li class="px-6 py-8 text-center text-slate-400 text-sm">No activity yet.</li>`;
    return;
  }
  list.innerHTML = transfers
    .map(
      (t) => `
    <li class="px-6 py-4 flex items-center gap-4">
      <div class="w-10 h-10 rounded-full bg-slate-100"></div>
      <div class="flex-1">
        <div class="font-medium">${escapeHtml(t.recipientId)}</div>
        <div class="text-sm text-slate-500">${escapeHtml(t.memo || "")} &middot; ${formatDate(t.createdAt)}</div>
      </div>
      <div class="font-medium text-slate-900">-$${t.amount.toFixed(2)}</div>
    </li>
  `,
    )
    .join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function formatDate(s) {
  return new Date(s).toLocaleDateString();
}

async function init() {
  try {
    const data = await fetchTransfers();
    renderActivity(data.transfers);
  } catch (err) {
    console.error(err);
    document.getElementById("activityList").innerHTML =
      `<li class="px-6 py-8 text-center text-slate-400 text-sm">Failed to load.</li>`;
  }
}

init();
