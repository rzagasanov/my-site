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
    { id: "fedya", photo: "assets/fedya.jpg", name: "Федя", desc: "Первый из легенд", price: 5000000000 },
    { id: "adilet", photo: "assets/adilet.jpg", name: "Адилет", desc: "Редкий экспонат", price: 5000000000 },
    { id: "rza", photo: "assets/rza.jpg", name: "Рза", desc: "Тот самый Рза", price: 5000000000 },
    { id: "sabir", photo: "assets/sabir.jpg", name: "Сабир", desc: "Хранитель коллекции", price: 5000000000 },
    { id: "vugar", photo: "assets/vugar.jpg", name: "Вугар", desc: "Финальный трофей", price: 5000000000 },
    { id: "r_coffee", photo: "assets/items/coffee.jpg", name: "Чашка кофе", desc: "С чего начинается день", price: 500 },
    { id: "r_sneakers", photo: "assets/items/sneakers.jpg", name: "Кроссовки", desc: "Бегом за деньгами", price: 2500 },
    { id: "r_iphone", photo: "assets/items/iphone.png", name: "iPhone", desc: "Всегда на связи", price: 15000 },
    { id: "r_rolex", photo: "assets/items/rolex.png", name: "Rolex", desc: "Время — деньги", price: 100000 },
    { id: "r_ferrari", photo: "assets/items/ferrari.png", name: "Ferrari", desc: "Гонки по городу", price: 500000 },
    { id: "r_yacht", photo: "assets/items/yacht.jpg", name: "Яхта", desc: "Отдых на волнах", price: 2000000 },
    { id: "r_jet", photo: "assets/items/jet.jpg", name: "Самолёт", desc: "Первый класс всегда", price: 10000000 },
    { id: "r_mansion", photo: "assets/items/mansion.jpg", name: "Особняк", desc: "Дом мечты", price: 50000000 },
    { id: "r_island", photo: "assets/items/island.jpg", name: "Свой остров", desc: "Только ты и океан", price: 200000000 },
    { id: "r_painting", photo: "assets/items/painting.jpg", name: "Звёздная ночь", desc: "Настоящий Ван Гог", price: 400000000 },
    { id: "r_oilrig", photo: "assets/items/oilrig.jpg", name: "Нефтяная вышка", desc: "Чёрное золото", price: 600000000 },
    { id: "r_rocket", photo: "assets/items/rocket.jpg", name: "Космический корабль", desc: "Полёт к звёздам", price: 800000000 },
    { id: "r_asteroid", photo: "assets/items/asteroid.jpg", name: "Астероид", desc: "Небесное тело твоё", price: 950000000 },
    { id: "r_sun", photo: "assets/items/sun.jpg", name: "Солнце", desc: "Всё освещает тебе", price: 1000000000 },
  ];

  // По возрастанию цены
  ITEMS.sort((a, b) => a.price - b.price);

  const STOCKS = [
    { id: "apple", name: "Apple", ticker: "AAPL", logo: "assets/logos/apple.png", base: 420, vol: 0.06 },
    { id: "tesla", name: "Tesla", ticker: "TSLA", logo: "assets/logos/tesla.png", base: 780, vol: 0.09 },
    { id: "nvidia", name: "NVIDIA", ticker: "NVDA", logo: "assets/logos/nvidia.png", base: 1250, vol: 0.08 },
    { id: "google", name: "Google", ticker: "GOOG", logo: "assets/logos/google.png", base: 610, vol: 0.05 },
    { id: "amazon", name: "Amazon", ticker: "AMZN", logo: "assets/logos/amazon.png", base: 890, vol: 0.06 },
    { id: "microsoft", name: "Microsoft", ticker: "MSFT", logo: "assets/logos/microsoft.png", base: 730, vol: 0.05 },
    { id: "coca", name: "Coca-Cola", ticker: "KO", logo: "assets/logos/coca.png", base: 180, vol: 0.04 },
    { id: "mcd", name: "McDonald's", ticker: "MCD", logo: "assets/logos/mcd.png", base: 260, vol: 0.04 },
    { id: "visa", name: "Visa", ticker: "V", logo: "assets/logos/visa.png", base: 540, vol: 0.05 },
    { id: "samsung", name: "Samsung", ticker: "SSNLF", logo: "assets/logos/samsung.png", base: 320, vol: 0.06 },
  ];

  const BUSINESS = [
    { id: "stall", icon: "🥤", name: "Ларёк", desc: "+2 ₿ в секунду", base: 1000, growth: 1.5, income: 2 },
    { id: "cafe", icon: "☕", name: "Кафе", desc: "+15 ₿ в секунду", base: 10000, growth: 1.5, income: 15 },
    { id: "shop", icon: "🏪", name: "Магазин", desc: "+120 ₿ в секунду", base: 100000, growth: 1.5, income: 120 },
    { id: "mall", icon: "🏬", name: "Торговый центр", desc: "+1 000 ₿ в секунду", base: 1000000, growth: 1.5, income: 1000 },
    { id: "factory", icon: "🏭", name: "Завод", desc: "+8 000 ₿ в секунду", base: 10000000, growth: 1.5, income: 8000 },
    { id: "oil", icon: "🛢️", name: "Нефтекомпания", desc: "+60 000 ₿ в секунду", base: 100000000, growth: 1.5, income: 60000 },
    { id: "bank", icon: "🏦", name: "Банк", desc: "+250 000 ₿ в секунду", base: 500000000, growth: 1.5, income: 250000 },
    { id: "corp", icon: "🌐", name: "Корпорация", desc: "+1 000 000 ₿ в секунду", base: 1000000000, growth: 1.5, income: 1000000 },
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
    stocks: document.getElementById("shop-stocks"),
    business: document.getElementById("shop-business"),
    loan: document.getElementById("loan-btn"),
    overlay: document.getElementById("haram-overlay"),
  };

  if (!el.coin) return;

  function fresh() {
    return { coins: 0, total: 0, taps: 0, crits: 0, owned: {}, items: {}, stocks: {}, business: {}, migrated5b: true };
  }

  const PEOPLE_CONFISCATE = ["fedya", "adilet", "rza", "sabir", "vugar"];

  function load() {
    const base = fresh();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      const result = {
        coins: Number(saved.coins) || 0,
        total: Number(saved.total) || 0,
        taps: Number(saved.taps) || 0,
        crits: Number(saved.crits) || 0,
        owned: saved.owned && typeof saved.owned === "object" ? saved.owned : {},
        items: saved.items && typeof saved.items === "object" ? saved.items : {},
        stocks: saved.stocks && typeof saved.stocks === "object" ? saved.stocks : {},
        business: saved.business && typeof saved.business === "object" ? saved.business : {},
        migrated5b: saved.migrated5b === true,
      };
      // Разовая конфискация 5 людей: изначально они стоили слишком дёшево.
      // Дальше не повторяется — купленные заново останутся.
      if (!result.migrated5b) {
        PEOPLE_CONFISCATE.forEach((id) => {
          delete result.items[id];
        });
        result.migrated5b = true;
        try {
          localStorage.setItem(KEY, JSON.stringify(result));
        } catch (error) {
          /* игнорируем */
        }
      }
      return result;
    } catch (error) {
      return base;
    }
  }

  let save = load();
  let saveTimer = 0;

  const stockPrices = {};
  const stockPrev = {};
  STOCKS.forEach((stock) => {
    stockPrices[stock.id] = stock.base;
    stockPrev[stock.id] = stock.base;
  });

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
    BUSINESS.forEach((item) => {
      const count = save.business[item.id] || 0;
      if (count) sec += item.income * count;
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

  function businessCost(item) {
    return Math.ceil(item.base * Math.pow(item.growth, save.business[item.id] || 0));
  }

  function renderBusiness() {
    el.business.innerHTML = BUSINESS.map((item) => {
      const count = save.business[item.id] || 0;
      const cost = businessCost(item);
      const can = save.coins >= cost;
      return (
        '<button class="shop-item' + (can ? " can" : "") + '" type="button" data-biz="' + item.id + '">' +
        '<span class="si-icon">' + item.icon + "</span>" +
        '<span class="si-body"><b>' + item.name + "</b><small>" + item.desc + "</small>" +
        "<em>Куплено: " + count + "</em></span>" +
        '<span class="si-price">' + fmt(cost) + " ₿</span>" +
        "</button>"
      );
    }).join("");
  }

  function renderStocks() {
    let value = 0;
    let cost = 0;
    let qty = 0;
    STOCKS.forEach((stock) => {
      const held = save.stocks[stock.id];
      if (!held || !held.qty) return;
      qty += held.qty;
      value += stockPrices[stock.id] * held.qty;
      cost += held.avg * held.qty;
    });
    const profit = value - cost;

    el.stocks.innerHTML =
      '<div class="stocks-summary">' +
      "<span>В портфеле: <b>" + qty + "</b> акций</span>" +
      "<span>Стоимость: <b>" + fmt(value) + " ₿</b></span>" +
      '<span class="' + (profit >= 0 ? "up" : "down") + '">' + (profit >= 0 ? "+" : "") + fmt(profit) + " ₿</span>" +
      "</div>" +
      STOCKS.map((stock) => {
        const price = stockPrices[stock.id];
        const previous = stockPrev[stock.id] || price;
        const delta = ((price - previous) / previous) * 100;
        const held = save.stocks[stock.id];
        const heldQty = held ? held.qty : 0;
        return (
          '<div class="stock-card">' +
          '<img class="stock-logo" src="' + stock.logo + '" alt="' + stock.name + '">' +
          '<div class="stock-info"><b>' + stock.name + "</b><small>" + stock.ticker + " · у тебя " + heldQty + "</small></div>" +
          '<div class="stock-price"><b>' + fmt(price) + " ₿</b>" +
          '<small class="' + (delta >= 0 ? "up" : "down") + '">' + (delta >= 0 ? "▲" : "▼") + " " + Math.abs(delta).toFixed(1) + "%</small></div>" +
          '<div class="stock-actions">' +
          '<button type="button" data-buy="' + stock.id + '">Купить</button>' +
          '<button type="button" data-sell="' + stock.id + '"' + (heldQty ? "" : " disabled") + ">Продать</button>" +
          "</div></div>"
        );
      }).join("");
  }

  function renderAll() {
    renderBalance();
    renderShop();
    renderStocks();
    renderBusiness();
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

  el.stocks.addEventListener("click", (event) => {
    const buyBtn = event.target.closest("[data-buy]");
    const sellBtn = event.target.closest("[data-sell]");

    if (buyBtn) {
      const stock = STOCKS.find((item) => item.id === buyBtn.dataset.buy);
      if (!stock) return;
      const price = stockPrices[stock.id];
      if (save.coins < price) {
        shake(buyBtn);
        return;
      }
      save.coins -= price;
      const held = save.stocks[stock.id] || { qty: 0, avg: 0 };
      held.avg = (held.avg * held.qty + price) / (held.qty + 1);
      held.qty += 1;
      save.stocks[stock.id] = held;
      renderAll();
      saveNow();
      return;
    }

    if (sellBtn) {
      const stock = STOCKS.find((item) => item.id === sellBtn.dataset.sell);
      if (!stock) return;
      const held = save.stocks[stock.id];
      if (!held || held.qty < 1) {
        shake(sellBtn);
        return;
      }
      save.coins += stockPrices[stock.id];
      held.qty -= 1;
      if (!held.qty) delete save.stocks[stock.id];
      renderAll();
      saveNow();
    }
  });

  el.business.addEventListener("click", (event) => {
    const button = event.target.closest("[data-biz]");
    if (!button) return;
    const item = BUSINESS.find((entry) => entry.id === button.dataset.biz);
    if (!item) return;
    const cost = businessCost(item);
    if (save.coins < cost) {
      shake(button);
      return;
    }
    save.coins -= cost;
    save.business[item.id] = (save.business[item.id] || 0) + 1;
    renderAll();
    saveNow();
  });

  el.loan.addEventListener("click", () => {
    save.coins = 0;
    saveNow();
    renderAll();
    el.overlay.classList.add("show");
    el.overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      el.overlay.classList.remove("show");
      el.overlay.setAttribute("aria-hidden", "true");
    }, 2200);
  });

  setInterval(() => {
    STOCKS.forEach((stock) => {
      stockPrev[stock.id] = stockPrices[stock.id];
      const drift = (Math.random() - 0.5) * 2 * stock.vol;
      let next = stockPrices[stock.id] * (1 + drift);
      next = Math.max(stock.base * 0.3, Math.min(stock.base * 3.5, next));
      stockPrices[stock.id] = next;
    });
    renderStocks();
  }, 900);

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
