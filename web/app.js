// Float frontend - v0.2
const DAILY_LIMIT = 500;

const MOCK_ACTIVITY = [
  {
    direction: "sent",
    recipientId: "marc_dubois",
    amount: 30.0,
    memo: "Pizza night",
    createdAt: new Date().toISOString(),
  },
  {
    direction: "sent",
    recipientId: "jules_renard",
    amount: 75.0,
    memo: "Concert ticket",
    createdAt: new Date().toISOString(),
  },
  {
    direction: "received",
    senderId: "bank_deposit",
    amount: 1500.0,
    memo: "Bank deposit",
    createdAt: "2026-05-14T09:12:00Z",
  },
  {
    direction: "received",
    senderId: "lea_martin",
    amount: 45.0,
    memo: "Dinner split",
    createdAt: "2026-05-13T20:05:00Z",
  },
  {
    direction: "received",
    senderId: "float_team",
    amount: 25.0,
    memo: "Welcome bonus",
    createdAt: "2026-05-12T16:40:00Z",
  },
  {
    direction: "received",
    senderId: "bank_deposit",
    amount: 500.0,
    memo: "Bank deposit",
    createdAt: "2026-05-09T08:05:00Z",
  },
];

const activity = [...MOCK_ACTIVITY];

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

function showToast(message) {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2 rounded-full shadow-lg";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function formatDate(s) {
  return new Date(s).toLocaleDateString();
}

document.getElementById("sendBtn").addEventListener("click", () => {
  activity.unshift({
    direction: "sent",
    recipientId: "demo_friend",
    amount: 12.0,
    memo: "Demo transfer",
    createdAt: new Date().toISOString(),
  });
  renderActivity(activity);
  updateSpentToday(activity);
  showToast("Demo: transfer simulated");
});

renderActivity(activity);
updateSpentToday(activity);
