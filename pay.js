// Настройка приёма оплаты.
// Вставь свои ссылки/адреса — пока поле пустое, кнопка показывает «Скоро будет».
// Это добровольная поддержка сайта, а не продажа игровых ₿.
const PAY_LINKS = {
  cards: "",   // Карты России: ссылка на страницу приёма (например, ЮMoney или LAVA)
  sbp: "",     // СБП: ссылка на оплату по QR или в платёжном сервисе
  foreign: "", // Иностранные карты: ссылка на платёжную страницу
  crypto: "",  // Крипта: адрес кошелька (USDT TRC20 / BTC) или ссылка на платёж
};

const PAY_LABELS = {
  cards: "карт России",
  sbp: "СБП",
  foreign: "иностранных карт",
  crypto: "криптовалюты",
};

function payToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(payToast.timer);
  payToast.timer = setTimeout(() => el.classList.remove("show"), 3800);
}

function isPayUrl(value) {
  return /^https?:\/\//i.test(value);
}

document.querySelectorAll(".pay-card").forEach((card) => {
  const key = card.dataset.pay;
  const link = String(PAY_LINKS[key] || "").trim();
  const cta = card.querySelector(".pay-cta");

  if (!link) {
    card.classList.add("pay-off");
    if (cta) cta.textContent = "Скоро будет";
  } else if (cta) {
    cta.textContent = isPayUrl(link) ? "Перейти →" : "Скопировать адрес";
  }

  card.addEventListener("click", () => {
    if (!link) {
      payToast("Приём " + PAY_LABELS[key] + " ещё не настроен: владелец сайта должен вставить ссылку в pay.js");
      return;
    }
    if (isPayUrl(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(
        () => payToast("Адрес скопирован — отправь средства туда"),
        () => payToast("Адрес: " + link)
      );
    } else {
      payToast("Адрес: " + link);
    }
  });
});
