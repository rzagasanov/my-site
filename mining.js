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

  // cap — капитализация, shares — всего акций, supply — сколько лежит на рынке.
  // Цена одной акции = кап / акции. Кап от 50 млн до 25 млрд.
  const STOCKS = [
    { id: "coca", name: "Coca-Cola", ticker: "KO", logo: "assets/logos/coca.png", cap: 50000000, shares: 100000000, supply: 20000, vol: 0.05 },
    { id: "mcd", name: "McDonald's", ticker: "MCD", logo: "assets/logos/mcd.png", cap: 120000000, shares: 60000000, supply: 12000, vol: 0.06 },
    { id: "samsung", name: "Samsung", ticker: "SSNLF", logo: "assets/logos/samsung.png", cap: 500000000, shares: 100000000, supply: 10000, vol: 0.07 },
    { id: "visa", name: "Visa", ticker: "V", logo: "assets/logos/visa.png", cap: 1200000000, shares: 120000000, supply: 8000, vol: 0.06 },
    { id: "google", name: "Google", ticker: "GOOG", logo: "assets/logos/google.png", cap: 2400000000, shares: 120000000, supply: 6000, vol: 0.07 },
    { id: "amazon", name: "Amazon", ticker: "AMZN", logo: "assets/logos/amazon.png", cap: 3500000000, shares: 100000000, supply: 5000, vol: 0.07 },
    { id: "microsoft", name: "Microsoft", ticker: "MSFT", logo: "assets/logos/microsoft.png", cap: 5000000000, shares: 100000000, supply: 4000, vol: 0.06 },
    { id: "tesla", name: "Tesla", ticker: "TSLA", logo: "assets/logos/tesla.png", cap: 7500000000, shares: 150000000, supply: 3000, vol: 0.09 },
    { id: "nvidia", name: "NVIDIA", ticker: "NVDA", logo: "assets/logos/nvidia.png", cap: 12000000000, shares: 120000000, supply: 2500, vol: 0.08 },
    { id: "apple", name: "Apple", ticker: "AAPL", logo: "assets/logos/apple.png", cap: 25000000000, shares: 100000000, supply: 2000, vol: 0.06 },
  ];

  // Режим цены товаров влияет и на прибыль, и на рост курса.
  const GOODS_MODES = [
    { name: "Низкая", income: 0.5, growth: 0.65 },
    { name: "Средняя", income: 1, growth: 1 },
    { name: "Высокая", income: 2, growth: 0.85 },
    { name: "Премиум", income: 4, growth: 0.6 },
  ];

  const CONTROLS = [
    { id: "ad", icon: "📢", name: "Реклама", desc: "Курс растёт быстрее", max: 5, price: 0.0004 },
    { id: "div", icon: "💰", name: "Дивиденды", desc: "Доход с каждой акции", max: 5, price: 0.0005 },
    { id: "rnd", icon: "🔬", name: "Исследования", desc: "Рост капитализации", max: 5, price: 0.0006 },
    { id: "tax", icon: "🧾", name: "Оптимизация налогов", desc: "Больше прибыли", max: 3, price: 0.0008 },
  ];

  // Бизнес: до 5 точек каждого вида, у каждой свои настройки (не как у акций).
  const BIZ_MAX = 5;
  const BIZ_PRICES = [
    { name: "Эконом", mult: 0.7, desc: "Дешевле, но меньше прибыли" },
    { name: "Стандарт", mult: 1, desc: "Обычная цена" },
    { name: "Люкс", mult: 1.8, desc: "Дорого, но прибыльнее" },
  ];
  const BIZ_UPGRADES = [
    { id: "manager", icon: "🧑‍💼", name: "Менеджер", desc: "+25% к доходу точки", max: 5, price: 0.00006 },
    { id: "equip", icon: "🔧", name: "Оборудование", desc: "+40% к доходу точки", max: 5, price: 0.0001 },
    { id: "supply", icon: "🚚", name: "Поставщики", desc: "+12% за счёт экономии", max: 3, price: 0.00015 },
  ];

  const BUSINESS = [
    { id: "stall", icon: "🥤", name: "Ларёк", desc: "Маленькая точка с большим потоком", base: 5000, growth: 1.5, income: 10 },
    { id: "cafe", icon: "☕", name: "Кафе", desc: "Кофе и выручка каждый день", base: 50000, growth: 1.5, income: 120 },
    { id: "shop", icon: "🏪", name: "Магазин", desc: "Полноценная торговля", base: 500000, growth: 1.5, income: 1500 },
    { id: "mall", icon: "🏬", name: "Торговый центр", desc: "Много арендаторов сразу", base: 5000000, growth: 1.5, income: 20000 },
    { id: "factory", icon: "🏭", name: "Завод", desc: "Своё производство", base: 50000000, growth: 1.5, income: 250000 },
    { id: "oil", icon: "🛢️", name: "Нефтекомпания", desc: "Чёрное золото идёт в гору", base: 500000000, growth: 1.5, income: 3000000 },
    { id: "bank", icon: "🏦", name: "Банк", desc: "Проценты со всего города", base: 2500000000, growth: 1.5, income: 15000000 },
    { id: "corp", icon: "🌐", name: "Корпорация", desc: "Глобальная сеть компаний", base: 10000000000, growth: 1.5, income: 60000000 },
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
    stocks: document.getElementById("stock-list"),
    stocksSummary: document.getElementById("stocks-summary"),
    business: document.getElementById("shop-business"),
    loan: document.getElementById("loan-btn"),
    overlay: document.getElementById("haram-overlay"),
    manageOverlay: document.getElementById("manage-overlay"),
    manageContent: document.getElementById("manage-content"),
    manageClose: document.getElementById("manage-close"),
    nickOverlay: document.getElementById("nick-overlay"),
    nickInput: document.getElementById("nick-input"),
    nickError: document.getElementById("nick-error"),
    nickSave: document.getElementById("nick-save"),
    nickRegister: document.getElementById("nick-register"),
    passInput: document.getElementById("pass-input"),
    nickChange: document.getElementById("nick-change"),
    accountName: document.getElementById("account-name"),
    accountLogout: document.getElementById("account-logout"),
    topList: document.getElementById("top-list"),
    topRefresh: document.getElementById("top-refresh"),
    profileBtn: document.getElementById("profile-btn"),
    guestPlay: document.getElementById("guest-play"),
    giftOverlay: document.getElementById("gift-overlay"),
    giftClose: document.getElementById("gift-close"),
    giftTitle: document.getElementById("gift-title"),
    giftSub: document.getElementById("gift-sub"),
    giftList: document.getElementById("gift-list"),
    giftError: document.getElementById("gift-error"),
    toast: document.getElementById("toast"),
  };

  if (!el.coin) return;

  function fresh() {
    return {
      coins: 0, total: 0, taps: 0, crits: 0,
      owned: {}, items: {}, stocks: {}, business: {}, gifted: {}, received: {},
      market: {}, control: {}, bizUp: {}, migrated5b: true, updated: 0,
    };
  }

  function normalizeSave(saved) {
    const base = fresh();
    if (!saved || typeof saved !== "object") return base;
    return {
      coins: Number(saved.coins) || 0,
      total: Number(saved.total) || 0,
      taps: Number(saved.taps) || 0,
      crits: Number(saved.crits) || 0,
      owned: saved.owned && typeof saved.owned === "object" ? saved.owned : {},
      items: saved.items && typeof saved.items === "object" ? saved.items : {},
      stocks: saved.stocks && typeof saved.stocks === "object" ? saved.stocks : {},
      business: saved.business && typeof saved.business === "object" ? saved.business : {},
      market: saved.market && typeof saved.market === "object" ? saved.market : {},
      control: saved.control && typeof saved.control === "object" ? saved.control : {},
      bizUp: saved.bizUp && typeof saved.bizUp === "object" ? saved.bizUp : {},
      gifted: saved.gifted && typeof saved.gifted === "object" ? saved.gifted : {},
      received: saved.received && typeof saved.received === "object" ? saved.received : {},
      migrated5b: saved.migrated5b === true,
      updated: Number(saved.updated) || 0,
    };
  }

  const PEOPLE_CONFISCATE = ["fedya", "adilet", "rza", "sabir", "vugar"];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      const result = normalizeSave(JSON.parse(raw));
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
      return fresh();
    }
  }

  let save = load();
  let saveTimer = 0;

  // Общий топ: хранилище без регистрации, данные доступны всем посетителям.
  const TOP_URL = "https://mantledb.sh/v2/rzagasanov-mining-top/leaderboard";
  const NICK_KEY = "mineNick_v1";
  const PLAYER_KEY = "minePlayerId_v1";
  const ACCOUNT_KEY = "mineAccount_v1";
  const ACCOUNT_BASE = "https://mantledb.sh/v2/rzagasanov-acc-";
  const GUEST_KEY = "mineGuestBackup_v1";
  const GIFTS_BASE = "https://mantledb.sh/v2/rzagasanov-gifts/";
  let publishTimer = 0;
  let accountTimer = 0;
  let topData = {};

  function storeGet(key) {
    try { return localStorage.getItem(key); } catch (error) { return null; }
  }
  function storeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (error) { /* игнорируем */ }
  }
  let playerId = storeGet(PLAYER_KEY);
  if (!playerId) {
    playerId = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    storeSet(PLAYER_KEY, playerId);
  }
  let nick = storeGet(NICK_KEY) || "";
  if (!nick) {
    // Гость может играть сразу — без входа и без пароля.
    nick = "Гость" + Math.random().toString(36).slice(2, 6).toUpperCase();
    storeSet(NICK_KEY, nick);
  }

  function loadSession() {
    try {
      const raw = storeGet(ACCOUNT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && data.nick && data.key ? data : null;
    } catch (error) {
      return null;
    }
  }
  let session = loadSession();

  const stockPrices = {};
  const stockPrev = {};
  const qtyDraft = {};
  const pushCooldown = {};
  let manageId = null;
  let manageKind = null;
  STOCKS.forEach((stock) => {
    const start = stock.cap / stock.shares;
    stockPrices[stock.id] = start;
    stockPrev[stock.id] = start;
  });

  function saveNow() {
    save.updated = Date.now();
    try {
      localStorage.setItem(KEY, JSON.stringify(save));
    } catch (error) {
      /* приватный режим — просто не сохраняем */
    }
    schedulePublish();
    scheduleAccountPush();
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
    if (value < 1) return value.toFixed(2).replace(".", ",");
    if (value < 100) return value.toFixed(1).replace(".", ",");
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
      if (count) sec += businessIncome(item, count);
    });
    sec += dividendsIncome();
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

    const itemFace = (item) => item.photo
      ? '<span class="ic-photo-wrap"><img class="ic-photo" src="' + item.photo + '" alt="' + item.name + '"></span>'
      : '<span class="ic-icon">' + item.icon + "</span>";

    el.items.innerHTML = ITEMS.map((item) => {
      const owned = Boolean(save.items[item.id]);
      const gifted = Boolean(save.gifted[item.id]);
      if (owned) {
        return (
          '<button class="item-card owned' + (gifted ? "" : " sell") + '" type="button"' +
          (gifted ? " disabled" : ' data-sell="' + item.id + '"') + ">" +
          itemFace(item) +
          "<b>" + item.name + "</b><small>" + item.desc + "</small>" +
          '<span class="ic-price">' + (gifted ? "🎁 НЕ ПРОДАЁТСЯ" : "Продать за " + fmt(Math.floor(item.price / 2)) + " ₿") + "</span>" +
          "</button>"
        );
      }
      const can = save.coins >= item.price;
      return (
        '<button class="item-card' + (can ? " can" : "") + '" type="button" data-item="' + item.id + '">' +
        itemFace(item) +
        "<b>" + item.name + "</b><small>" + item.desc + "</small>" +
        '<span class="ic-price">' + fmt(item.price) + " ₿" + "</span>" +
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
      const maxed = count >= BIZ_MAX;
      const cost = businessCost(item);
      const can = !maxed && save.coins >= cost;
      const income = businessIncome(item, count);
      return (
        '<div class="biz-card' + (can ? " can" : "") + '">' +
        '<button class="biz-buy" type="button" data-biz="' + item.id + '"' + (maxed ? " disabled" : "") + ">" +
        '<span class="si-icon">' + item.icon + "</span>" +
        '<span class="si-body"><b>' + item.name + "</b><small>" + item.desc + "</small>" +
        "<em>Точек: " + count + " / " + BIZ_MAX + " · +" + fmt(income) + " ₿/сек</em>" +
        (count >= BIZ_MAX ? '<span class="biz-franchise">🏆 Франшиза ×1.5</span>' : "") +
        "</span>" +
        '<span class="si-price">' + (maxed ? "МАКС" : fmt(cost) + " ₿") + "</span>" +
        "</button>" +
        '<button class="biz-setup" type="button" data-biz-setup="' + item.id + '"' + (count ? "" : " disabled") + ">⚙️ Настроить</button>" +
        "</div>"
      );
    }).join("");
  }

  function marketLeft(stock) {
    const saved = save.market[stock.id];
    return saved === undefined ? stock.supply : Math.max(0, Number(saved) || 0);
  }

  function capNow(stock) {
    return stockPrices[stock.id] * stock.shares;
  }

  function defaultControl() {
    return { ad: 0, div: 0, rnd: 0, tax: 0, goods: 1 };
  }

  function controlOf(id) {
    return save.control[id] || null;
  }

  function controlCost(stock, config, level) {
    return Math.ceil((stock.cap * config.price * Math.pow(level + 1, 1.6)) / 5) * 5;
  }

  function pushCost(stock) {
    return Math.max(5, Math.round(stockPrices[stock.id] * 8));
  }

  function dividendsIncome() {
    let total = 0;
    STOCKS.forEach((stock) => {
      const ctl = controlOf(stock.id);
      const held = save.stocks[stock.id];
      if (!ctl || !ctl.div || !held || !held.qty) return;
      const goods = GOODS_MODES[ctl.goods] || GOODS_MODES[1];
      total += stockPrices[stock.id] * ctl.div * 0.002 * held.qty * goods.income * (1 + ctl.tax * 0.15);
    });
    return total;
  }

  function renderSummary() {
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
    el.stocksSummary.innerHTML =
      "<span>В портфеле: <b>" + qty + "</b> акций</span>" +
      "<span>Стоимость: <b>" + fmt(value) + " ₿</b></span>" +
      '<span class="' + (profit >= 0 ? "up" : "down") + '">' + (profit >= 0 ? "+" : "") + fmt(profit) + " ₿</span>" +
      "<span>Дивиденды: <b>+" + fmt(dividendsIncome()) + " ₿/сек</b></span>";
  }

  function deltaText(stock) {
    const price = stockPrices[stock.id];
    const previous = stockPrev[stock.id] || price;
    const delta = ((price - previous) / previous) * 100;
    return '<small class="' + (delta >= 0 ? "up" : "down") + '">' + (delta >= 0 ? "▲" : "▼") + " " + Math.abs(delta).toFixed(1) + "%</small>";
  }

  function renderStocks() {
    renderSummary();
    el.stocks.innerHTML = STOCKS.map((stock) => {
      const price = stockPrices[stock.id];
      const held = save.stocks[stock.id];
      const heldQty = held ? held.qty : 0;
      const left = marketLeft(stock);
      const controlled = Boolean(controlOf(stock.id));
      const draft = qtyDraft[stock.id] === undefined ? 1 : qtyDraft[stock.id];
      return (
        '<div class="stock-card" data-card="' + stock.id + '">' +
        '<img class="stock-logo" src="' + stock.logo + '" alt="' + stock.name + '">' +
        '<div class="stock-info"><b>' + stock.name + "</b><small>" + stock.ticker + " · у тебя " + heldQty + "</small></div>" +
        '<div class="stock-price"><b>' + fmt(price) + " ₿</b>" + deltaText(stock) + "</div>" +
        '<div class="stock-meta"><span>Кап: <b class="cap-text">' + fmt(capNow(stock)) + " ₿</b></span>" +
        '<span class="market-text">' + (left ? "На рынке: " + fmt(left) : "Рынок выкуплен") + "</span></div>" +
        '<div class="stock-trade">' +
        '<input class="stock-qty" type="number" min="1" step="1" inputmode="numeric" value="' + draft + '" data-qty="' + stock.id + '" aria-label="Количество">' +
        '<button type="button" data-act="max" data-id="' + stock.id + '">Макс</button>' +
        '<button class="buy" type="button" data-act="buy" data-id="' + stock.id + '">Купить</button>' +
        '<button type="button" data-act="sell" data-id="' + stock.id + '"' + (heldQty ? "" : " disabled") + ">Продать</button>" +
        "</div>" +
        '<div class="stock-actions">' +
        '<button type="button" data-act="up" data-id="' + stock.id + '">📈 Поднять ' + fmt(pushCost(stock)) + "</button>" +
        '<button type="button" data-act="down" data-id="' + stock.id + '">📉 Опустить ' + fmt(pushCost(stock)) + "</button>" +
        (controlled
          ? '<button class="manage" type="button" data-act="manage" data-id="' + stock.id + '">🏛 Управление</button>'
          : "") +
        "</div></div>"
      );
    }).join("");
  }

  // Тик обновляет только цифры — чтобы поле ввода не сбрасывалось во время набора.
  function tickStocks() {
    renderSummary();
    STOCKS.forEach((stock) => {
      const card = el.stocks.querySelector('[data-card="' + stock.id + '"]');
      if (!card) return;
      card.querySelector(".stock-price b").textContent = fmt(stockPrices[stock.id]) + " ₿";
      card.querySelector(".stock-price small").outerHTML = deltaText(stock);
      card.querySelector(".cap-text").textContent = fmt(capNow(stock)) + " ₿";
    });
    if (manageId) renderManage();
  }

  function bizUpOf(id) {
    return save.bizUp[id] || { manager: 0, equip: 0, supply: 0, price: 1 };
  }

  function bizUpgradeCost(item, config, level) {
    return Math.ceil((item.base * config.price * Math.pow(level + 1, 1.7)) / 5) * 5;
  }

  function businessIncome(item, count) {
    const up = bizUpOf(item.id);
    const mode = BIZ_PRICES[up.price] || BIZ_PRICES[1];
    const manager = 1 + (up.manager || 0) * 0.25;
    const equip = 1 + (up.equip || 0) * 0.4;
    const supply = 1 + (up.supply || 0) * 0.12;
    const franchise = count >= BIZ_MAX ? 1.5 : 1;
    return item.income * count * mode.mult * manager * equip * supply * franchise;
  }

  function openManage(kind, id) {
    manageKind = kind;
    manageId = id;
    el.manageOverlay.classList.add("show");
    el.manageOverlay.setAttribute("aria-hidden", "false");
    renderManage();
  }

  function closeManage() {
    manageKind = null;
    manageId = null;
    el.manageOverlay.classList.remove("show");
    el.manageOverlay.setAttribute("aria-hidden", "true");
  }

  function renderManage() {
    if (!manageId) return;
    if (manageKind === "stock") renderStockManage();
    else renderBizManage();
  }

  function levelBar(level, max) {
    let out = "";
    for (let i = 0; i < max; i++) out += '<i class="' + (i < level ? "on" : "") + '"></i>';
    return '<span class="mg-bar">' + out + "</span>";
  }

  function renderStockManage() {
    const stock = STOCKS.find((entry) => entry.id === manageId);
    if (!stock) return closeManage();
    const ctl = controlOf(stock.id) || defaultControl();
    const held = save.stocks[stock.id];
    const heldQty = held ? held.qty : 0;
    const goods = GOODS_MODES[ctl.goods] || GOODS_MODES[1];
    const buybackCost = Math.ceil((capNow(stock) * 0.002) / 5) * 5;
    const sellGain = Math.ceil((capNow(stock) * 0.4) / 5) * 5;

    el.manageContent.innerHTML =
      '<div class="manage-head">' +
      '<img src="' + stock.logo + '" alt="' + stock.name + '">' +
      "<div><h3>" + stock.name + "</h3><small>" + stock.ticker + " · ты контролируешь компанию</small></div>" +
      "</div>" +
      '<div class="manage-stats">' +
      "<span>Капитализация: <b>" + fmt(capNow(stock)) + " ₿</b></span>" +
      "<span>Цена акции: <b>" + fmt(stockPrices[stock.id]) + " ₿</b></span>" +
      "<span>Твои акции: <b>" + heldQty + "</b></span>" +
      "<span>Дивиденды: <b>+" + fmt(dividendsIncome()) + " ₿/сек</b></span>" +
      "</div>" +
      "<h4>📢 Управление ростом</h4>" +
      '<div class="mg-grid">' +
      CONTROLS.map((config) => {
        const level = ctl[config.id] || 0;
        const maxed = level >= config.max;
        const cost = controlCost(stock, config, level);
        const can = !maxed && save.coins >= cost;
        return (
          '<button type="button" class="mg-item' + (can ? " can" : "") + '" data-mg="stock-up" data-key="' + config.id + '"' + (maxed ? " disabled" : "") + ">" +
          '<span class="mg-icon">' + config.icon + "</span>" +
          "<b>" + config.name + "</b><small>" + config.desc + "</small>" +
          levelBar(level, config.max) +
          "<em>" + (maxed ? "МАКСИМУМ" : fmt(cost) + " ₿") + "</em>" +
          "</button>"
        );
      }).join("") +
      "</div>" +
      "<h4>🏷️ Цена товаров</h4>" +
      '<div class="mg-modes">' +
      GOODS_MODES.map((mode, index) =>
        '<button type="button" class="' + (ctl.goods === index ? "active" : "") + '" data-mg="stock-goods" data-mode="' + index + '">' +
        mode.name + "<small>прибыль ×" + mode.income + " · рост ×" + mode.growth + "</small></button>"
      ).join("") +
      "</div>" +
      '<p class="mg-note">Сейчас: <b>' + goods.name + "</b>. Высокая цена даёт больше дивидендов, но замедляет рост курса.</p>" +
      '<div class="mg-extra">' +
      '<button type="button" data-mg="buyback"' + (save.coins < buybackCost ? " disabled" : "") + ">♻️ Выкупить акции · " + fmt(buybackCost) + " ₿<small>Курс +10%</small></button>" +
      '<button type="button" class="danger" data-mg="sell-company">💼 Продать контроль · +' + fmt(sellGain) + " ₿<small>Рынок снова открыт</small></button>" +
      "</div>";
  }

  function renderBizManage() {
    const item = BUSINESS.find((entry) => entry.id === manageId);
    if (!item) return closeManage();
    const up = bizUpOf(item.id);
    const count = save.business[item.id] || 0;
    const mode = BIZ_PRICES[up.price] || BIZ_PRICES[1];
    const income = businessIncome(item, count);

    el.manageContent.innerHTML =
      '<div class="manage-head biz">' +
      '<span class="mg-biz-icon">' + item.icon + "</span>" +
      "<div><h3>" + item.name + "</h3><small>Точек: " + count + " / " + BIZ_MAX + " · " + item.desc + "</small></div>" +
      "</div>" +
      '<div class="manage-stats">' +
      "<span>Доход: <b>+" + fmt(income) + " ₿/сек</b></span>" +
      "<span>Ценовая политика: <b>" + mode.name + "</b></span>" +
      "<span>Франшиза: <b>" + (count >= BIZ_MAX ? "🏆 активна ×1.5" : count + " / " + BIZ_MAX) + "</b></span>" +
      "</div>" +
      "<h4>🧑‍💼 Улучшение точек</h4>" +
      '<div class="mg-grid">' +
      BIZ_UPGRADES.map((config) => {
        const level = up[config.id] || 0;
        const maxed = level >= config.max;
        const cost = bizUpgradeCost(item, config, level);
        const can = !maxed && save.coins >= cost && count > 0;
        return (
          '<button type="button" class="mg-item' + (can ? " can" : "") + '" data-mg="biz-up" data-key="' + config.id + '"' + (maxed || !count ? " disabled" : "") + ">" +
          '<span class="mg-icon">' + config.icon + "</span>" +
          "<b>" + config.name + "</b><small>" + config.desc + "</small>" +
          levelBar(level, config.max) +
          "<em>" + (maxed ? "МАКСИМУМ" : fmt(cost) + " ₿") + "</em>" +
          "</button>"
        );
      }).join("") +
      "</div>" +
      "<h4>🏷️ Ценовая политика</h4>" +
      '<div class="mg-modes">' +
      BIZ_PRICES.map((priceMode, index) =>
        '<button type="button" class="' + (up.price === index ? "active" : "") + '" data-mg="biz-price" data-mode="' + index + '">' +
        priceMode.name + "<small>" + priceMode.desc + " · ×" + priceMode.mult + "</small></button>"
      ).join("") +
      "</div>" +
      '<p class="mg-note">Улучшения действуют на все точки этого бизнеса. Купи 5 точек — включится франшиза с бонусом ×1.5.</p>' +
      '<div class="mg-extra"><button type="button" class="danger" data-mg="biz-close">Готово</button></div>';
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
    const sellButton = event.target.closest("[data-sell]");
    if (sellButton) {
      const item = ITEMS.find((entry) => entry.id === sellButton.dataset.sell);
      if (!item || !save.items[item.id] || save.gifted[item.id]) return;
      const gain = Math.floor(item.price / 2);
      delete save.items[item.id];
      save.coins += gain;
      renderAll();
      saveNow();
      toast("Продал «" + item.name + "» за " + fmt(gain) + " ₿");
      return;
    }
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

  el.stocks.addEventListener("input", (event) => {
    const input = event.target.closest("[data-qty]");
    if (!input) return;
    qtyDraft[input.dataset.qty] = input.value;
  });

  el.stocks.addEventListener("click", (event) => {
    const button = event.target.closest("[data-act]");
    if (!button) return;
    const stock = STOCKS.find((item) => item.id === button.dataset.id);
    if (!stock) return;
    const act = button.dataset.act;
    const input = el.stocks.querySelector('[data-qty="' + stock.id + '"]');
    const readQty = () => {
      const raw = input ? parseInt(input.value, 10) : 1;
      return Math.max(1, Math.min(1000000, Number.isFinite(raw) ? raw : 1));
    };
    const startPrice = stock.cap / stock.shares;
    const clamp = (value) => Math.max(startPrice * 0.3, Math.min(startPrice * 3.5, value));

    if (act === "max") {
      const left = marketLeft(stock);
      const affordable = Math.floor(save.coins / stockPrices[stock.id]);
      qtyDraft[stock.id] = Math.max(1, Math.min(left, affordable));
      renderStocks();
      return;
    }

    if (act === "buy") {
      const left = marketLeft(stock);
      const qty = Math.min(readQty(), left);
      const unit = stockPrices[stock.id];
      const cost = unit * qty;
      if (qty < 1 || save.coins < cost) {
        shake(button);
        return;
      }
      save.coins -= cost;
      const held = save.stocks[stock.id] || { qty: 0, avg: 0 };
      held.avg = (held.avg * held.qty + cost) / (held.qty + qty);
      held.qty += qty;
      save.stocks[stock.id] = held;
      const remaining = left - qty;
      save.market[stock.id] = remaining;
      // Крупная покупка поднимает курс.
      stockPrices[stock.id] = clamp(unit * (1 + (qty / stock.supply) * 0.15));
      if (remaining === 0 && !save.control[stock.id]) {
        save.control[stock.id] = defaultControl();
      }
      renderAll();
      saveNow();
      return;
    }

    if (act === "sell") {
      const held = save.stocks[stock.id];
      const qty = Math.min(readQty(), held ? held.qty : 0);
      if (qty < 1) {
        shake(button);
        return;
      }
      const unit = stockPrices[stock.id];
      save.coins += unit * qty;
      held.qty -= qty;
      if (!held.qty) delete save.stocks[stock.id];
      stockPrices[stock.id] = clamp(unit * (1 - (qty / stock.supply) * 0.08));
      renderAll();
      saveNow();
      return;
    }

    if (act === "up" || act === "down") {
      if (pushCooldown[stock.id] && Date.now() - pushCooldown[stock.id] < 2500) {
        shake(button);
        return;
      }
      const cost = pushCost(stock);
      if (save.coins < cost) {
        shake(button);
        return;
      }
      save.coins -= cost;
      const swing = 0.03 + Math.random() * 0.04;
      stockPrices[stock.id] = clamp(stockPrices[stock.id] * (act === "up" ? 1 + swing : 1 - swing));
      pushCooldown[stock.id] = Date.now();
      renderAll();
      saveNow();
      return;
    }

    if (act === "manage") openManage("stock", stock.id);
  });

  el.manageClose.addEventListener("click", closeManage);
  el.manageOverlay.addEventListener("click", (event) => {
    if (event.target === el.manageOverlay) closeManage();
    const button = event.target.closest("[data-mg]");
    if (!button) return;
    const mg = button.dataset.mg;
    const id = manageId;
    if (!id) return;

    if (mg === "stock-up") {
      const stock = STOCKS.find((entry) => entry.id === id);
      const config = CONTROLS.find((entry) => entry.id === button.dataset.key);
      if (!stock || !config) return;
      const ctl = controlOf(id) || defaultControl();
      const level = ctl[config.id] || 0;
      if (level >= config.max) return;
      const cost = controlCost(stock, config, level);
      if (save.coins < cost) {
        shake(button);
        return;
      }
      save.coins -= cost;
      ctl[config.id] = level + 1;
      save.control[id] = ctl;
      renderManage();
      renderAll();
      saveNow();
      return;
    }

    if (mg === "stock-goods") {
      const ctl = controlOf(id) || defaultControl();
      ctl.goods = Number(button.dataset.mode);
      save.control[id] = ctl;
      renderManage();
      renderAll();
      saveNow();
      return;
    }

    if (mg === "buyback") {
      const stock = STOCKS.find((entry) => entry.id === id);
      if (!stock) return;
      const cost = Math.ceil((capNow(stock) * 0.002) / 5) * 5;
      if (save.coins < cost) {
        shake(button);
        return;
      }
      save.coins -= cost;
      const startPrice = stock.cap / stock.shares;
      stockPrices[id] = Math.min(startPrice * 3.5, stockPrices[id] * 1.1);
      renderManage();
      renderAll();
      saveNow();
      return;
    }

    if (mg === "sell-company") {
      const stock = STOCKS.find((entry) => entry.id === id);
      if (!stock) return;
      save.coins += Math.ceil((capNow(stock) * 0.4) / 5) * 5;
      delete save.control[id];
      save.market[id] = stock.supply;
      closeManage();
      renderAll();
      saveNow();
      return;
    }

    if (mg === "biz-up") {
      const item = BUSINESS.find((entry) => entry.id === id);
      const config = BIZ_UPGRADES.find((entry) => entry.id === button.dataset.key);
      if (!item || !config) return;
      const up = bizUpOf(id);
      const level = up[config.id] || 0;
      if (level >= config.max) return;
      const cost = bizUpgradeCost(item, config, level);
      if (save.coins < cost) {
        shake(button);
        return;
      }
      save.coins -= cost;
      up[config.id] = level + 1;
      save.bizUp[id] = up;
      renderManage();
      renderAll();
      saveNow();
      return;
    }

    if (mg === "biz-price") {
      const up = bizUpOf(id);
      up.price = Number(button.dataset.mode);
      save.bizUp[id] = up;
      renderManage();
      renderAll();
      saveNow();
      return;
    }

    if (mg === "biz-close") closeManage();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && manageId) closeManage();
  });

  el.business.addEventListener("click", (event) => {
    const setup = event.target.closest("[data-biz-setup]");
    if (setup) {
      openManage("biz", setup.dataset.bizSetup);
      return;
    }
    const button = event.target.closest("[data-biz]");
    if (!button) return;
    const item = BUSINESS.find((entry) => entry.id === button.dataset.biz);
    if (!item) return;
    const count = save.business[item.id] || 0;
    if (count >= BIZ_MAX) return;
    const cost = businessCost(item);
    if (save.coins < cost) {
      shake(button);
      return;
    }
    save.coins -= cost;
    save.business[item.id] = count + 1;
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
      const ctl = controlOf(stock.id);
      const goods = ctl ? GOODS_MODES[ctl.goods] || GOODS_MODES[1] : GOODS_MODES[1];
      const boost = ctl ? goods.growth * (1 + ctl.ad * 0.12 + ctl.rnd * 0.18) * (1 + ctl.tax * 0.05) : 1;
      const bias = ctl ? (ctl.ad + ctl.rnd) * 0.0006 * goods.growth : 0;
      const drift = (Math.random() - 0.5) * 2 * stock.vol * boost;
      const startPrice = stock.cap / stock.shares;
      const next = stockPrices[stock.id] * (1 + drift + bias);
      stockPrices[stock.id] = Math.max(startPrice * 0.3, Math.min(startPrice * 3.5, next));
    });
    tickStocks();
    renderBalance();
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

  // ===== Общий топ =====
  function netWorth() {
    let total = save.coins;
    ITEMS.forEach((item) => {
      if (save.items[item.id]) total += item.price;
    });
    STOCKS.forEach((stock) => {
      const held = save.stocks[stock.id];
      if (held && held.qty) total += (stock.cap / stock.shares) * held.qty;
    });
    BUSINESS.forEach((item) => {
      const count = save.business[item.id] || 0;
      if (count) total += item.base * (Math.pow(item.growth, count) - 1) / (item.growth - 1);
    });
    BUFFS.forEach((buff) => {
      const count = save.owned[buff.id] || 0;
      for (let i = 0; i < count; i++) total += Math.ceil(buff.base * Math.pow(buff.growth, i));
    });
    return Math.round(total);
  }

  function renderTop() {
    const rows = Object.entries(topData).filter((entry) => entry[1] && Number.isFinite(Number(entry[1].score)));
    rows.sort((a, b) => Number(b[1].score) - Number(a[1].score));
    el.topList.textContent = "";
    if (!rows.length) {
      el.topList.textContent = "Пока пусто — стань первым!";
      return;
    }
    const medals = ["🥇", "🥈", "🥉"];
    rows.slice(0, 15).forEach(([id, item], index) => {
      const row = document.createElement("div");
      row.className = "top-row" + (id === playerId ? " me" : "");
      const place = document.createElement("span");
      place.className = "top-place";
      place.textContent = medals[index] || String(index + 1);
      const name = document.createElement("span");
      name.className = "top-name";
      name.textContent = String(item.nick || "Без ника").slice(0, 16) + (id === playerId ? " (ты)" : "");
      const score = document.createElement("span");
      score.className = "top-score";
      score.textContent = fmt(Number(item.score)) + " ₿";
      row.append(place, name, score);
      if (id !== playerId) {
        const gift = document.createElement("button");
        gift.className = "top-gift";
        gift.type = "button";
        gift.textContent = "🎁";
        gift.title = "Подарить вещь из коллекции";
        gift.dataset.gift = id;
        gift.dataset.giftNick = String(item.nick || "Игрок");
        row.appendChild(gift);
      }
      el.topList.appendChild(row);
    });
  }

  async function topRead() {
    const response = await fetch(TOP_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    return data && typeof data === "object" ? data : {};
  }

  async function topPublish() {
    if (!nick) return;
    try {
      let data = {};
      try { data = await topRead(); } catch (error) { /* первую запись создадим сами */ }
      data[playerId] = { nick: nick, score: netWorth(), ts: Date.now() };
      topData = data;
      renderTop();
      await fetch(TOP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      el.topList.textContent = "Нет связи с топом — попробуй обновить позже";
    }
  }

  async function topRefresh() {
    try {
      topData = await topRead();
      renderTop();
    } catch (error) {
      el.topList.textContent = "Не удалось загрузить топ";
    }
  }

  function schedulePublish() {
    if (!nick || publishTimer) return;
    publishTimer = setTimeout(() => {
      publishTimer = 0;
      topPublish();
    }, 6000);
  }

  // ===== Подарки из коллекции =====
  function giftUrl(recipientId) {
    return GIFTS_BASE + encodeURIComponent(recipientId);
  }

  async function giftsRead(recipientId) {
    const response = await fetch(giftUrl(recipientId), { cache: "no-store" });
    if (response.status === 404) return {};
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    return data && typeof data === "object" ? data : {};
  }

  async function giftsWrite(recipientId, list) {
    const response = await fetch(giftUrl(recipientId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
  }

  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.toast.classList.remove("show"), 3800);
  }

  let giftTarget = null;

  function openGiftModal(recipientId, recipientName) {
    giftTarget = { id: recipientId, nick: recipientName };
    el.giftTitle.textContent = "🎁 Подарить: " + recipientName;
    el.giftSub.textContent = "Выбери вещь из своей коллекции";
    el.giftError.textContent = "";
    el.giftList.textContent = "";
    const available = ITEMS.filter((item) => save.items[item.id] && !save.gifted[item.id]);
    if (!available.length) {
      const empty = document.createElement("div");
      empty.className = "gift-empty";
      empty.textContent = "Пока нечего дарить. Купи вещь в магазине «Коллекция» — подаренные вещи подарить снова нельзя.";
      el.giftList.appendChild(empty);
    } else {
      available.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gift-item";
        button.dataset.giftItem = item.id;
        const face = document.createElement("span");
        face.className = "gi-face";
        if (item.photo) {
          const img = document.createElement("img");
          img.src = item.photo;
          img.alt = item.name;
          face.appendChild(img);
        } else {
          face.textContent = item.icon;
        }
        const body = document.createElement("span");
        body.className = "gi-body";
        const title = document.createElement("b");
        title.textContent = item.name;
        const sub = document.createElement("small");
        sub.textContent = fmt(item.price) + " ₿ · отдать совсем";
        body.append(title, sub);
        const go = document.createElement("span");
        go.className = "gi-go";
        go.textContent = "➜";
        button.append(face, body, go);
        el.giftList.appendChild(button);
      });
    }
    el.giftOverlay.classList.add("show");
    el.giftOverlay.setAttribute("aria-hidden", "false");
  }

  function closeGiftModal() {
    giftTarget = null;
    el.giftOverlay.classList.remove("show");
    el.giftOverlay.setAttribute("aria-hidden", "true");
  }

  async function sendGift(itemId) {
    if (!giftTarget) return;
    const item = ITEMS.find((entry) => entry.id === itemId);
    if (!item || !save.items[itemId] || save.gifted[itemId]) return;
    const target = giftTarget;
    el.giftError.textContent = "Отправляю…";
    try {
      const list = await giftsRead(target.id);
      const giftId = "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      list[giftId] = { from: playerId, fromNick: nick, item: itemId, ts: Date.now() };
      await giftsWrite(target.id, list);
      el.giftError.textContent = "";
      delete save.items[itemId];
      saveNow();
      renderAll();
      closeGiftModal();
      toast("🎁 «" + item.name + "» отправлен игроку " + target.nick);
    } catch (error) {
      el.giftError.textContent = "Не удалось отправить — попробуй ещё раз";
    }
  }

  async function collectGifts() {
    try {
      const list = await giftsRead(playerId);
      const ids = Object.keys(list);
      if (!ids.length) return;
      const rest = {};
      let got = 0;
      ids.forEach((giftId) => {
        const gift = list[giftId];
        if (!gift || !gift.item || save.received[giftId]) return;
        const item = ITEMS.find((entry) => entry.id === gift.item);
        if (!item) {
          rest[giftId] = gift;
          return;
        }
        save.received[giftId] = true;
        save.items[item.id] = true;
        save.gifted[item.id] = { from: gift.fromNick || "Другой игрок", ts: gift.ts || Date.now() };
        got += 1;
      });
      await giftsWrite(playerId, rest);
      if (got) {
        saveNow();
        renderAll();
        toast("🎁 Тебе подарили " + got + " вещь! Она в коллекции, но не продаётся.");
      }
    } catch (error) {
      /* офлайн — попробуем позже */
    }
  }

  el.topList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gift]");
    if (!button) return;
    openGiftModal(button.dataset.gift, button.dataset.giftNick);
  });
  el.giftClose.addEventListener("click", closeGiftModal);
  el.giftOverlay.addEventListener("click", (event) => {
    if (event.target === el.giftOverlay) closeGiftModal();
    const button = event.target.closest("[data-gift-item]");
    if (button) sendGift(button.dataset.giftItem);
  });

  // ===== Аккаунт: ник + пароль, прогресс в облаке =====
  function accountKey(name) {
    return name.trim().replace(/\s+/g, "_").toLowerCase();
  }

  function accountUrl(name) {
    const key = accountKey(name);
    const shard = /^[a-z0-9]/.test(key) ? key[0] : "other";
    return ACCOUNT_BASE + shard + "/" + encodeURIComponent(key);
  }

  async function accountRead(name) {
    const response = await fetch(accountUrl(name), { cache: "no-store" });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("HTTP " + response.status);
    return await response.json();
  }

  async function accountWrite(name, record) {
    const response = await fetch(accountUrl(name), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
  }

  function randomHex(length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function deriveKey(password, salt) {
    const data = new TextEncoder().encode(salt + ":" + password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function updateAccountUI() {
    el.accountName.textContent = session ? "👤 " + session.nick : "👤 " + nick + " (без входа)";
    el.accountLogout.hidden = !session;
    el.nickChange.textContent = session ? "🔄 Другой аккаунт" : "🔑 Войти или зарегистрироваться";
    el.profileBtn.title = session ? "Аккаунт: " + session.nick : "Войти или зарегистрироваться";
  }

  function backupGuest() {
    if (session) return;
    try {
      storeSet(GUEST_KEY, JSON.stringify({ save: save, nick: nick, playerId: playerId }));
    } catch (error) {
      /* игнорируем */
    }
  }

  function showAuthModal(prefill) {
    el.nickInput.value = prefill !== undefined ? prefill : (session ? session.nick : "");
    el.passInput.value = "";
    el.nickError.textContent = "";
    el.nickOverlay.classList.add("show");
    el.nickOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => el.nickInput.focus(), 60);
  }

  function closeAuthModal() {
    el.nickOverlay.classList.remove("show");
    el.nickOverlay.setAttribute("aria-hidden", "true");
  }

  function applySession(name, key, salt, id) {
    session = { nick: name, key: key, salt: salt, playerId: id };
    storeSet(ACCOUNT_KEY, JSON.stringify(session));
    nick = name;
    playerId = id;
    storeSet(NICK_KEY, nick);
    storeSet(PLAYER_KEY, playerId);
    updateAccountUI();
  }

  function readCredentials() {
    return {
      name: el.nickInput.value.trim().replace(/\s+/g, " ").slice(0, 16),
      pass: el.passInput.value,
    };
  }

  async function registerAccount() {
    const { name, pass } = readCredentials();
    if (name.length < 2) {
      el.nickError.textContent = "Ник — хотя бы 2 буквы";
      return;
    }
    if (pass.length < 4) {
      el.nickError.textContent = "Пароль — хотя бы 4 символа";
      return;
    }
    if (!crypto || !crypto.subtle) {
      el.nickError.textContent = "Браузер не поддерживает защищённый вход";
      return;
    }
    el.nickError.textContent = "Проверяю ник…";
    try {
      if (await accountRead(name)) {
        el.nickError.textContent = "Такой ник уже есть — нажми «Войти»";
        return;
      }
      const salt = randomHex(16);
      const key = await deriveKey(pass, salt);
      const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      // Гостевой прогресс полноценно переезжает на новый аккаунт.
      backupGuest();
      await accountWrite(name, { nick: name, key: key, salt: salt, playerId: id, save: save, updated: Date.now() });
      applySession(name, key, salt, id);
      storeSet(GUEST_KEY, "");
      closeAuthModal();
      saveNow();
      renderAll();
      topPublish();
      toast("Готово! Твой прогресс без входа теперь на аккаунте «" + name + "».");
    } catch (error) {
      el.nickError.textContent = "Не удалось создать аккаунт — попробуй ещё раз";
    }
  }

  async function loginAccount() {
    const { name, pass } = readCredentials();
    if (name.length < 2 || !pass) {
      el.nickError.textContent = "Введи ник и пароль";
      return;
    }
    if (!crypto || !crypto.subtle) {
      el.nickError.textContent = "Браузер не поддерживает защищённый вход";
      return;
    }
    el.nickError.textContent = "Проверяю…";
    try {
      const record = await accountRead(name);
      if (!record) {
        el.nickError.textContent = "Аккаунт не найден — создай его";
        return;
      }
      const key = await deriveKey(pass, record.salt || "");
      if (key !== record.key) {
        el.nickError.textContent = "Неверный пароль";
        return;
      }
      // Если до входа был гостевой прогресс — сохраним его на всякий случай.
      backupGuest();
      applySession(record.nick || name, key, record.salt || "", record.playerId || playerId);
      save = normalizeSave(record.save);
      saveNow();
      closeAuthModal();
      renderAll();
      topPublish();
    } catch (error) {
      el.nickError.textContent = "Нет связи с аккаунтом — попробуй позже";
    }
  }

  async function accountPull() {
    if (!session) return;
    try {
      const record = await accountRead(session.nick);
      if (!record || record.key !== session.key) return;
      const incoming = normalizeSave(record.save);
      if (incoming.updated > Number(save.updated || 0)) {
        save = incoming;
        saveNow();
        renderAll();
      }
      if (record.playerId) playerId = record.playerId;
      nick = record.nick || session.nick;
    } catch (error) {
      /* офлайн — играем с локальной копией */
    }
  }

  async function accountPush() {
    if (!session) return;
    try {
      await accountWrite(session.nick, {
        nick: session.nick,
        key: session.key,
        salt: session.salt,
        playerId: playerId,
        save: save,
        updated: Date.now(),
      });
    } catch (error) {
      /* офлайн — повторим позже */
    }
  }

  function scheduleAccountPush() {
    if (!session || accountTimer) return;
    accountTimer = setTimeout(() => {
      accountTimer = 0;
      accountPush();
    }, 6000);
  }

  function logoutAccount() {
    accountPush();
    let backup = null;
    try { backup = JSON.parse(storeGet(GUEST_KEY) || "null"); } catch (error) { /* игнорируем */ }
    storeSet(ACCOUNT_KEY, "");
    session = null;
    if (backup && backup.save) {
      save = normalizeSave(backup.save);
      nick = backup.nick || nick;
      playerId = backup.playerId || playerId;
      storeSet(GUEST_KEY, "");
    } else {
      // Гостевого бэкапа нет — оставляем текущую копию как гостевую.
      nick = "Гость" + Math.random().toString(36).slice(2, 6).toUpperCase();
      playerId = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
    storeSet(NICK_KEY, nick);
    storeSet(PLAYER_KEY, playerId);
    saveNow();
    renderAll();
    updateAccountUI();
    toast("Вышли из аккаунта. Прогресс аккаунта остался в облаке, дальше можно играть без входа.");
  }

  el.nickSave.addEventListener("click", loginAccount);
  el.nickRegister.addEventListener("click", registerAccount);
  el.guestPlay.addEventListener("click", () => {
    closeAuthModal();
    toast("Играй без входа — прогресс сохранится на этом устройстве.");
  });
  el.nickInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loginAccount();
  });
  el.passInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loginAccount();
  });
  el.profileBtn.addEventListener("click", () => showAuthModal());
  el.nickChange.addEventListener("click", () => showAuthModal(session ? session.nick : ""));
  el.accountLogout.addEventListener("click", logoutAccount);
  el.topRefresh.addEventListener("click", () => {
    topRefresh();
    topPublish();
    collectGifts();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (el.giftOverlay.classList.contains("show")) closeGiftModal();
    else if (el.nickOverlay.classList.contains("show")) closeAuthModal();
  });

  updateAccountUI();
  topRefresh();
  topPublish();
  collectGifts();

  if (session) {
    accountPull().then(() => {
      renderAll();
      topRefresh();
      topPublish();
      collectGifts();
    });
  } else {
    setTimeout(() => {
      if (!el.toast.classList.contains("show")) {
        toast("Играй без входа! Хочешь аккаунт — нажми 👤 в правом верхнем углу.");
      }
    }, 4000);
  }

  setInterval(() => {
    if (nick) topPublish();
    collectGifts();
  }, 30000);

  setInterval(() => {
    if (session) accountPush();
  }, 30000);

  renderAll();
})();
