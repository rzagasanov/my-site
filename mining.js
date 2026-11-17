/* Майнинг токенов: тапаем монету с лицом, покупаем бафы и предметы коллекции. */
(() => {
  const KEY = "mineSave_v1";

  const BUFFS = [
    { id: "cursor", icon: "🖱️", name: "Кибер-курсор", desc: "+1 ₿ за каждый тап", base: 15, growth: 1.6, kind: "tap", amount: 1, max: Infinity },
    { id: "auto", icon: "⚙️", name: "Авто-копка", desc: "+0,5 ₿ каждую секунду", base: 40, growth: 1.7, kind: "sec", amount: 0.5, max: Infinity },
    { id: "core", icon: "🔋", name: "Энерго-ядро", desc: "+3 ₿ за каждый тап", base: 150, growth: 1.8, kind: "tap", amount: 3, max: Infinity },
    { id: "farm", icon: "🏭", name: "Ферма майнинга", desc: "+5 ₿ каждую секунду", base: 400, growth: 1.9, kind: "sec", amount: 5, max: Infinity },
    { id: "ai", icon: "🧠", name: "ИИ-помощник", desc: "+15 ₿ каждую секунду", base: 1200, growth: 2, kind: "sec", amount: 15, max: Infinity },
    { id: "rocket", icon: "🚀", name: "Ракетный ускоритель", desc: "×2 ко всему доходу", base: 3000, growth: 3, kind: "mult", amount: 2, max: 5 },
  ];

  const ITEMS = [
    { id: "first", icon: "🪙", name: "Первый биткоин", desc: "С чего всё начиналось", price: 25 },
    { id: "frame", icon: "🖼️", name: "Портрет в рамке", desc: "Тот самый человек", price: 100 },
    { id: "gem", icon: "💎", name: "Алмаз", desc: "Блестит даже в темноте", price: 300 },
    { id: "cup", icon: "🏆", name: "Кубок чемпиона", desc: "За упорные тапы", price: 750 },
    { id: "crown", icon: "👑", name: "Корона", desc: "Для настоящего майнера", price: 1800 },
    { id: "ufo", icon: "🛸", name: "НЛО", desc: "Пришельцы тоже майнят", price: 4500 },
    { id: "dragon", icon: "🐉", name: "Дракон", desc: "Охраняет твою ферму", price: 11000 },
    { id: "galaxy", icon: "🌌", name: "Галактика", desc: "Целая вселенная в кармане", price: 27000 },
    { id: "temple", icon: "🏛️", name: "Храм", desc: "Памятник твоему труду", price: 65000 },
    { id: "end", icon: "💫", name: "Сингулярность", desc: "Конец бесконечности", price: 150000 },
    { id: "fedya", photo: "assets/fedya.jpg", name: "Федя", desc: "Первый из легенд", price: 500000 },
    { id: "adilet", photo: "assets/adilet.jpg", name: "Адилет", desc: "Редкий экспонат", price: 500000 },
    { id: "rza", photo: "assets/rza.jpg", name: "Рза", desc: "Тот самый Рза", price: 500000 },
    { id: "sabir", photo: "assets/sabir.jpg", name: "Сабир", desc: "Хранитель коллекции", price: 500000 },
    { id: "vugar", photo: "assets/vugar.jpg", name: "Вугар", desc: "Финальный трофей", price: 500000 },
  ];

  const el = {
    coin: document.getElementById("coin"),
    stage: document.getElementById("coin-stage"),
    floats: document.getElementById("float-layer"),
    coins: document.getElementById("coins"),
    total: document.getElementById("total-mined"),
    taps: document.getElementById("tap-count"),
    crits: document.getElementById("crit-count"),
    perTap: document.getElementById("per-tap"),
    perSec: document.getElementById("per-sec"),
    buffs: document.getElementById("shop-buffs"),
    items: document.getElementById("shop-collection"),
    shelf: document.getElementById("shelf"),
    shelfCount: document.getElementById("collection-count"),
    reset: document.getElementById("mine-reset"),
  };

  if (!el.coin) return;

  function fresh() {
    return { coins: 0, total: 0, taps: 0, crits: 0, owned: {}, items: {} };
  }

  function load() {
    const base = fresh();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      return {
        coins: Number(saved.coins) || 0,
        total: Number(saved.total) || 0,
        taps: Number(saved.taps) || 0,
        crits: Number(saved.crits) || 0,
        owned: saved.owned && typeof saved.owned === "object" ? saved.owned : {},
        items: saved.items && typeof saved.items === "object" ? saved.items : {},
      };
    } catch (error) {
      return base;
    }
  }

  let save = load();
  let saveTimer = 0;

  function saveNow() {
    try {
      localStorage.setItem(KEY, JSON.stringify(save));
    } catch (error) {
      /* приватный режим — просто не сохраняем */
    }
  }

  function saveSoon() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = 0;
      saveNow();
    }, 2000);
  }

  function fmt(value) {
    if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
    if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
    if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
    if (value < 100) return String(Math.round(value * 10) / 10).replace(".", ",");
    return Math.floor(value).toLocaleString("ru-RU");
  }

  function rates() {
    let tap = 1;
    let sec = 0;
    let mult = 1;
    BUFFS.forEach((buff) => {
      const count = save.owned[buff.id] || 0;
      if (!count) return;
      if (buff.kind === "tap") tap += buff.amount * count;
      if (buff.kind === "sec") sec += buff.amount * count;
      if (buff.kind === "mult") mult *= Math.pow(buff.amount, count);
    });
    return { tap: tap * mult, sec: sec * mult };
  }

  function buffCost(buff) {
    return Math.ceil(buff.base * Math.pow(buff.growth, save.owned[buff.id] || 0));
  }

  function floatText(text, crit, event) {
    const bounds = el.floats.getBoundingClientRect();
    const node = document.createElement("span");
    node.className = "float" + (crit ? " crit" : "");
    node.textContent = text;
    const x = event && event.clientX ? event.clientX - bounds.left : bounds.width / 2;
    const y = event && event.clientY ? event.clientY - bounds.top : bounds.height / 2;
    node.style.left = x + "px";
    node.style.top = y + "px";
    el.floats.appendChild(node);
    setTimeout(() => node.remove(), 900);
  }

  function renderBalance() {
    const r = rates();
    el.coins.textContent = fmt(save.coins);
    el.total.textContent = fmt(save.total);
    el.taps.textContent = fmt(save.taps);
    el.crits.textContent = fmt(save.crits);
    el.perTap.textContent = "+" + fmt(r.tap);
    el.perSec.textContent = "+" + fmt(r.sec);
  }

  function renderShop() {
    el.buffs.innerHTML = BUFFS.map((buff) => {
      const count = save.owned[buff.id] || 0;
      const maxed = count >= buff.max;
      const cost = buffCost(buff);
      const can = !maxed && save.coins >= cost;
      return (
        '<button class="shop-item' + (can ? " can" : "") + '" type="button" data-buff="' + buff.id + '"' + (maxed ? " disabled" : "") + ">" +
        '<span class="si-icon">' + buff.icon + "</span>" +
        '<span class="si-body"><b>' + buff.name + "</b><small>" + buff.desc + "</small>" +
        "<em>" + (maxed ? "МАКСИМУМ" : "Уровень " + count) + "</em></span>" +
        '<span class="si-price">' + (maxed ? "★" : fmt(cost) + " ₿") + "</span>" +
        "</button>"
      );
    }).join("");

    el.items.innerHTML = ITEMS.map((item) => {
      const owned = Boolean(save.items[item.id]);
      const can = !owned && save.coins >= item.price;
      return (
        '<button class="item-card' + (owned ? " owned" : "") + (can ? " can" : "") + '" type="button" data-item="' + item.id + '"' + (owned ? " disabled" : "") + ">" +
        (item.photo
          ? '<span class="ic-photo-wrap"><img class="ic-photo" src="' + item.photo + '" alt="' + item.name + '"></span>'
          : '<span class="ic-icon">' + item.icon + "</span>") +
        "<b>" + item.name + "</b><small>" + item.desc + "</small>" +
        '<span class="ic-price">' + (owned ? "ЕСТЬ ✓" : fmt(item.price) + " ₿") + "</span>" +
        "</button>"
      );
    }).join("");

    const ownedCount = ITEMS.filter((item) => save.items[item.id]).length;
    el.shelfCount.textContent = ownedCount + " / " + ITEMS.length;
    el.shelf.innerHTML = ITEMS.map((item) => {
      const owned = Boolean(save.items[item.id]);
      const face = owned && item.photo
        ? '<img class="shelf-photo" src="' + item.photo + '" alt="' + item.name + '">'
        : owned ? item.icon : "?";
      return '<div class="shelf-item ' + (owned ? "owned" : "locked") + '" title="' + (owned ? item.name : "Не найдено") + '">' + face + "</div>";
    }).join("");
  }

  function renderAll() {
    renderBalance();
    renderShop();
  }

  function shake(node) {
    node.classList.remove("shake");
    void node.offsetWidth;
    node.classList.add("shake");
  }

  el.coin.addEventListener("click", (event) => {
    let gain = rates().tap;
    let crit = false;
    if (Math.random() < 1 / 12) {
      gain *= 5;
      crit = true;
      save.crits += 1;
    }
    save.coins += gain;
    save.total += gain;
    save.taps += 1;

    floatText("+" + fmt(gain), crit, event);
    el.coin.classList.remove("hit");
    void el.coin.offsetWidth;
    el.coin.classList.add("hit");

    renderAll();
    saveNow();
  });

  el.buffs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-buff]");
    if (!button) return;
    const buff = BUFFS.find((item) => item.id === button.dataset.buff);
    if (!buff) return;
    const cost = buffCost(buff);
    if (save.coins < cost || (save.owned[buff.id] || 0) >= buff.max) {
      shake(button);
      return;
    }
    save.coins -= cost;
    save.owned[buff.id] = (save.owned[buff.id] || 0) + 1;
    renderAll();
    saveNow();
  });

  el.items.addEventListener("click", (event) => {
    const button = event.target.closest("[data-item]");
    if (!button) return;
    const item = ITEMS.find((entry) => entry.id === button.dataset.item);
    if (!item || save.items[item.id] || save.coins < item.price) {
      if (button) shake(button);
      return;
    }
    save.coins -= item.price;
    save.items[item.id] = true;
    renderAll();
    saveNow();
  });

  document.querySelectorAll(".shop-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".shop-tab").forEach((item) => item.classList.toggle("active", item === tab));
      document.querySelectorAll(".shop-view").forEach((view) => {
        view.classList.toggle("active", view.id === "shop-" + tab.dataset.shop);
      });
    });
  });

  el.reset.addEventListener("click", () => {
    if (!window.confirm("Сбросить весь прогресс майнинга?")) return;
    save = fresh();
    saveNow();
    renderAll();
  });

  setInterval(() => {
    const income = rates().sec;
    if (income <= 0) return;
    save.coins += income;
    save.total += income;
    renderBalance();
    saveSoon();
  }, 1000);

  renderAll();
})();
