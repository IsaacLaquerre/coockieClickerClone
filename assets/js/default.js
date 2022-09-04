var cookieCount = 0;
var cpsCount = 0;
var cookiesPerClick = 1;
var priceIncrease = 1.15;
var playSounds = true;
var animate = true;

const clicks = [
    new Audio("assets/audio/click1.mp3"),
    new Audio("assets/audio/click2.mp3"),
    new Audio("assets/audio/click3.mp3"),
    new Audio("assets/audio/click4.mp3"),
    new Audio("assets/audio/click5.mp3"),
    new Audio("assets/audio/click6.mp3"),
    new Audio("assets/audio/click7.mp3"),
];

const items = [
    { name: "Cursor", price: 15, basePrice: 15, cps: 0.1, owned: 0 },
    { name: "Grandma", price: 100, basePrice: 100, cps: 1, owned: 0 },
    { name: "Farm", price: 1100, basePrice: 1100, cps: 8, owned: 0 },
    { name: "Mine", price: 12000, basePrice: 12000, cps: 47, owned: 0 },
    { name: "Factory", price: 130000, basePrice: 130000, cps: 260, owned: 0 },
    { name: "Bank", price: 1400000, basePrice: 1400000, cps: 1400, owned: 0 },
    { name: "Temple", price: 20000000, basePrice: 20000000, cps: 7800, owned: 0 },
    { name: "Wizard Tower", price: 330000000, basePrice: 330000000, cps: 44000, owned: 0 }
];

const upgrades = [{
        name: "Reinforced index finger",
        description: "The mouse and cursors are twice as efficient.",
        price: 100,
        basePrice: 100,
        exec: () => {
            cookiesPerClick = cookiesPerClick * 2;
            localStorage.setItem("cpc", cookiesPerClick);
            var cursor = items.find(shopItem => shopItem.name === "Cursor");
            cursor.cps = cursor.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Carpal tunnel prevention cream",
        description: "The mouse and cursors are twice as efficient.",
        price: 500,
        basePrice: 500,
        exec: () => {
            cookiesPerClick = cookiesPerClick * 2;
            localStorage.setItem("cpc", cookiesPerClick);
            var cursor = items.find(shopItem => shopItem.name === "Cursor");
            cursor.cps = cursor.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Ambidextrous",
        description: "The mouse and cursors are twice as efficient.",
        price: 10000,
        basePrice: 10000,
        exec: () => {
            cookiesPerClick = cookiesPerClick * 2;
            localStorage.setItem("cpc", cookiesPerClick);
            var cursor = items.find(shopItem => shopItem.name === "Cursor");
            cursor.cps = cursor.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Forwards from grandma",
        description: "Grandmas are twice as efficient.",
        price: 1000,
        basePrice: 1000,
        exec: () => {
            var grandma = items.find(shopItem => shopItem.name === "Grandma");
            grandma.cps = grandma.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Steel-plated rolling pins",
        description: "Grandmas are twice as efficient.",
        price: 5000,
        basePrice: 5000,
        exec: () => {
            var grandma = items.find(shopItem => shopItem.name === "Grandma");
            grandma.cps = grandma.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Lubricated dentures",
        description: "Grandmas are twice as efficient.",
        price: 50000,
        basePrice: 50000,
        exec: () => {
            var grandma = items.find(shopItem => shopItem.name === "Grandma");
            grandma.cps = grandma.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Prune juice",
        description: "Grandmas are twice as efficient.",
        price: 5000000,
        basePrice: 5000000,
        exec: () => {
            var grandma = items.find(shopItem => shopItem.name === "Grandma");
            grandma.cps = grandma.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Double-thick glasses",
        description: "Grandmas are twice as efficient.",
        price: 500000000,
        basePrice: 500000000,
        exec: () => {
            var grandma = items.find(shopItem => shopItem.name === "Grandma");
            grandma.cps = grandma.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    },
    {
        name: "Aging agents",
        description: "Grandmas are twice as efficient.",
        price: 50000000000,
        basePrice: 50000000000,
        exec: () => {
            var grandma = items.find(shopItem => shopItem.name === "Grandma");
            grandma.cps = grandma.cps * 2;
            recalculateCps();
            checkAvailableItems();
        },
        owned: 0
    }
];

const animations = {
    clicked: {
        frames: [
            { transform: "scale(1)" },
            { transform: "scale(0.98)" },
            { transform: "scale(1.02)" }
        ],
        options: {
            duration: 250,
            iterations: 1
        }
    },
    bought: {
        frames: [
            { backgroundColor: "var(--secondaryColor)" },
            { backgroundColor: "var(--bought)" },
            { backgroundColor: "var(--secondaryColor)" },
        ],
        options: {
            duration: 350,
            iterations: 1
        }
    },
    notEnough: {
        frames: [
            { backgroundColor: "var(--secondaryColor)" },
            { backgroundColor: "var(--notEnough)" },
            { backgroundColor: "var(--secondaryColor)" },
            { backgroundColor: "var(--notEnough)" },
            { backgroundColor: "var(--secondaryColor)" }
        ],
        options: {
            duration: 450,
            iterations: 1
        }
    }
};

function mute(muteButton) {
    switch (muteButton.classList[0]) {
        case "mute":
            playSounds = false;
            muteButton.src = "assets/images/unmute.svg";
            muteButton.classList.remove("mute");
            muteButton.classList.add("unmute");
            muteButton.parentElement.title = "Unmute";
            localStorage.setItem("muteCookies", true);
            break;
        case "unmute":
            playSounds = true;
            muteButton.src = "assets/images/mute.svg";
            muteButton.classList.remove("unmute");
            muteButton.classList.add("mute");
            muteButton.parentElement.title = "Mute";
            localStorage.setItem("muteCookies", false);
            break;
        default:
            break;
    }
}

function enableAnimations(button) {
    switch (button.classList[0]) {
        case "enabled":
            animate = false;
            button.src = "assets/images/disableAnimations.svg";
            button.classList.remove("enabled");
            button.classList.add("disabled");
            button.parentElement.title = "Enable animations";
            localStorage.setItem("enableAnimations", false);
            break;
        case "disabled":
            animate = true;
            button.src = "assets/images/enableAnimations.svg";
            button.classList.remove("disabled");
            button.classList.add("enabled");
            button.parentElement.title = "Disable animations";
            localStorage.setItem("enableAnimations", true);
            break;
        default:
            break;
    }
}

function getMuted() {
    var muted = localStorage.getItem("muteCookies");
    if (muted) setMuted(muted);
    else localStorage.setItem("muteCookies", false);
}

function getAnimations() {
    var enableAnimations = localStorage.getItem("enableAnimations");
    if (enableAnimations) setAnimations(enableAnimations);
    else localStorage.setItem("enableAnimations", true);
}

function getStoredCookies() {
    var cookies = localStorage.getItem("cookies");
    if (cookies) setCookies(cookies);
    else localStorage.setItem("cookies", 0);
}

function getStoredCps() {
    var cps = localStorage.getItem("cps");
    if (cps) setCps(cps);
    else localStorage.setItem("cps", 0);
}

function getStoredCpc() {
    var cpc = localStorage.getItem("cpc");
    if (cpc) setCpc(cpc);
    else localStorage.setItem("cpc", 1);
}

function getStoredItems() {
    for (i in items) {
        var storage = localStorage.getItem(items[i].name);
        if (storage) setBoughtItem(items[i].name, storage);
        else localStorage.setItem(items[i].name, 0);
    }
    for (i in upgrades) {
        var storage = localStorage.getItem(upgrades[i].name);
        if (storage) setBoughtUpgrade(upgrades[i].name, storage);
        else localStorage.setItem(upgrades[i].name, 0);
    }
}

function setMuted(value) {
    var muteButton = document.getElementById("mute").children[0];
    if (value === "true") {
        playSounds = false;
        muteButton.src = "assets/images/unmute.svg";
        muteButton.classList.remove("mute");
        muteButton.classList.add("unmute");
        muteButton.parentElement.title = "Unmute";
    } else {
        playSounds = true;
        muteButton.src = "assets/images/mute.svg";
        muteButton.classList.remove("unmute");
        muteButton.classList.add("mute");
        muteButton.parentElement.title = "Mute";
    }
}

function setAnimations(value) {
    var button = document.getElementById("animations").children[0];
    if (value === "true") {
        animate = true;
        button.src = "assets/images/enableAnimations.svg";
        button.classList.remove("disabled");
        button.classList.add("enabled");
        button.parentElement.title = "Disable animations";
    } else {
        animate = false;
        button.src = "assets/images/disableAnimations.svg";
        button.classList.remove("enabled");
        button.classList.add("disabled");
        button.parentElement.title = "Enable animations";
    }
}

function setCookies(amount) {
    var cookieCounter = document.getElementById("cookieCount");
    cookieCount = amount;
    cookieCounter.innerHTML = Math.floor(amount);
}

function setCps(amount) {
    var cpsCounter = document.getElementById("cpsCount");
    cpsCount = parseFloat(amount);
    cpsCounter.innerHTML = Math.floor(amount * 10) / 10;
}

function setCpc(amount) {
    //cookiesPerClick = parseInt(amount);
}

function setBoughtItem(item, amount) {
    var shopItem = items.find(shItem => shItem.name === item) || upgrades.find(shItem => shItem.name === item);
    shopItem.owned = amount;
    document.getElementById(item.toLowerCase()).children[2].innerHTML = "Owned: " + amount;
    recalculatePrice(shopItem);
    document.getElementById(item.toLowerCase()).children[1].children[1].innerHTML = " " + shopItem.price;
    recalculateCps();
}

function setBoughtUpgrade(upgrade, amount) {
    var shopItem = upgrades.find(shItem => shItem.name === upgrade);
    shopItem.owned = amount;
    if (amount != 0) shopItem.exec();
}

function setUpShop() {

    var itemsSection = document.getElementById("items");
    var upgradesSection = document.getElementById("upgrades");

    for (i in upgrades) {
        if (upgrades[i].owned != 0) return;
        var upgrade = document.createElement("div");
        upgrade.classList.add("upgrade");
        upgrade.id = upgrades[i].name.toLowerCase();
        upgrade.setAttribute("onclick", "buy(this.id)");
        upgrade.title = upgrades[i].name + "\n" + upgrades[i].description + "\n" + upgrades[i].price + " cookies";

        var upgradeImg = document.createElement("img");
        upgradeImg.src = "assets/images/shop/upgrades/" + upgrades[i].name + ".png";

        upgrade.appendChild(upgradeImg);

        upgradesSection.appendChild(upgrade);
    }

    for (i in items) {
        var item = document.createElement("div");
        item.classList.add("item");
        item.id = items[i].name.toLowerCase();
        item.setAttribute("onclick", "buy(this.id);");

        var itemImg = document.createElement("img");
        itemImg.src = "assets/images/shop/items/" + items[i].name + ".png";

        item.appendChild(itemImg);

        var itemInfo = document.createElement("div");
        itemInfo.classList.add("itemInfo");

        var itemTitle = document.createElement("span");
        itemTitle.classList.add("itemTitle");
        itemTitle.innerHTML = items[i].name;

        var itemPrice = document.createElement("span");
        itemPrice.classList.add("itemPrice");
        itemPrice.innerHTML = " " + items[i].price;

        var itemCps = document.createElement("span");
        itemCps.classList.add("itemCps");
        itemCps.innerHTML = "CPS: " + items[i].cps;

        itemInfo.appendChild(itemTitle);
        itemInfo.appendChild(itemPrice);
        itemInfo.appendChild(itemCps);

        item.appendChild(itemInfo);

        var itemOwned = document.createElement("span");
        itemOwned.classList.add("itemOwned");
        itemOwned.innerHTML = "Owned: " + items[i].owned;

        item.appendChild(itemOwned);

        itemsSection.appendChild(item);
    }
}

function checkAvailableItems() {
    var cookies = localStorage.getItem("cookies") || 0;
    for (i in items) {
        var item = document.getElementById(items[i].name.toLowerCase());
        if (cookies >= items[i].price) {
            item.classList.remove("unavailable");
        } else item.classList.add("unavailable");
    }
    for (i in upgrades) {
        var upgrade = document.getElementById(upgrades[i].name.toLowerCase());
        if (upgrade) {
            if (upgrades[i].owned != 0) {
                recalculateCps();
                return upgrade.remove();
            }
            if (cookies >= upgrades[i].price) {
                upgrade.classList.remove("unavailable");
            } else upgrade.classList.add("unavailable");
        }
    }
}

function clicked(event) {
    var cookie = document.getElementById("cookie");
    cookie.animate(animations.clicked.frames, animations.clicked.options);
    var cookieCounter = document.getElementById("cookieCount");
    var cookies = parseInt(cookieCounter.innerHTML) + parseInt(cookiesPerClick);
    cookieCount = cookies;
    cookieCounter.innerHTML = cookies;
    localStorage.setItem("cookies", cookies);
    throwCookie({ x: event.clientX, y: event.clientY });
    dropCookie();
    if (playSounds) clicks[Math.floor(Math.random() * clicks.length)].play();
    checkAvailableItems();
}

function addCps() {
    var cps = localStorage.getItem("cps");
    if (cps) {
        cookieCount = parseFloat(cookieCount) + parseFloat(cps);
        setCookies(cookieCount);
        localStorage.setItem("cookies", cookieCount);
        checkAvailableItems();
    }
}

function throwCookie(coords) {
    if (!animate) return;
    var cookie = document.createElement("img");
    cookie.classList.add("pixelCookie");
    cookie.src = "assets/images/cookie_pixelated.png";
    cookie.width = "50";
    cookie.style.filter = "brightness(0.8)";
    cookie.style.position = "absolute";
    cookie.style.left = (coords.x - 25) + "px";
    cookie.style.top = (coords.y - 25) + "px";
    document.getElementById("game").appendChild(cookie);
    var side = Math.floor(Math.random() * 2);
    var intensity = Math.floor(Math.random() * 3);
    if (side === 1) {
        var xCoords = [-5, -10, -15, -20, -25];
    } else if (side === 0) {
        xCoords = [5, 10, 15, 20, 25];
    }
    var frames = [
        { transform: "translate(0)" },
        { transform: "translate(" + xCoords[0] * intensity + "px, -10px)" },
        { transform: "translate(" + xCoords[1] * intensity + "px, -15px)" },
        { transform: "translate(" + xCoords[2] * intensity + "px, -10px)", opacity: 0.9 },
        { transform: "translate(" + xCoords[3] * intensity + "px, 0)", opacity: 0.5 },
        { transform: "translate(" + xCoords[4] * intensity + "px, 10px)", opacity: 0.1 },
    ];
    cookie.animate(frames, {
        duration: 800,
        iterations: 1
    });
    setTimeout(() => {
        cookie.remove();
    }, 750);
}

function dropCookie() {
    if (!animate) return;
    var cookie = document.createElement("img");
    var random = Math.floor(Math.random() * (window.innerWidth * 0.3 - 50));
    cookie.classList.add("pixelCookie");
    cookie.src = "assets/images/cookie_pixelated.png";
    cookie.width = "50";
    cookie.style.opacity = 0.6;
    cookie.style.zIndex = 1;
    var rotation = Math.floor(Math.random() * 360);
    cookie.style.transform = "rotate(" + rotation + "deg)";
    cookie.style.filter = "brightness(0.8)";
    cookie.style.position = "absolute";
    cookie.style.left = random + "px";
    cookie.style.top = "-50px";
    document.getElementById("game").appendChild(cookie);
    var frames = [
        { transform: "translate(0) rotate(" + rotation + "deg)" },
        { transform: "translateY(350px) rotate(" + rotation + "deg)", opacity: 0 },
    ];
    cookie.animate(frames, {
        duration: 1300,
        iterations: 1
    });
    setTimeout(() => {
        cookie.remove();
    }, 1250);
}

function removeLoader() {
    var loader = document.getElementById("load");
    var opacity = 1;
    var fadeOut = setInterval(() => {
        loader.style.opacity = opacity;
        if (opacity <= 0) {
            loader.remove();
            return clearInterval(fadeOut);
        }
        opacity -= 0.025;
    }, 5);
}

function restart() {
    if (confirm("Are you sure you want to restart and lose all your progress?")) {
        localStorage.clear();
        recalculateCps();
        setCookies(0);
        window.location.reload();
    }
}