// Float frontend - v0.1
const MOCK_TRANSFERS = [
  {
    recipientId: "bank_deposit",
    amount: 1500.0,
    memo: "Bank deposit",
    createdAt: "2026-05-14T09:12:00Z",
  },
  {
    recipientId: "float_team",
    amount: 25.0,
    memo: "Welcome bonus",
    createdAt: "2026-05-12T16:40:00Z",
  },
  {
    recipientId: "bank_deposit",
    amount: 500.0,
    memo: "Bank deposit",
    createdAt: "2026-05-09T08:05:00Z",
  },
  {
    recipientId: "float_team",
    amount: 10.0,
    memo: "Referral bonus",
    createdAt: "2026-05-05T12:30:00Z",
  },
];

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
      <div class="font-medium text-emerald-600">+$${t.amount.toFixed(2)}</div>
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

renderActivity(MOCK_TRANSFERS);
