var cookieCount = 0;
var cpsCount = 0;
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
    { name: "Factory", price: 130000, basePrice: 130000, cps: 260, owned: 0 }
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

function getStoredItems() {
    for (i in items) {
        var storage = localStorage.getItem(items[i].name);
        if (storage) setBoughtItem(items[i].name, storage);
        else localStorage.setItem(items[i].name, 0);
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
    cpsCount = amount;
    cpsCounter.innerHTML = Math.floor(amount * 10) / 10;
}

function setBoughtItem(item, amount) {
    var shopItem = items.find(shItem => shItem.name === item);
    shopItem.owned = amount;
    document.getElementById(item.toLowerCase()).children[2].innerHTML = "Owned: " + amount;
    recalculatePrice(shopItem);
    document.getElementById(item.toLowerCase()).children[1].children[1].innerHTML = " " + shopItem.price;
}

function setUpShop() {

    var shop = document.getElementById("shop");

    for (i in items) {
        var item = document.createElement("div");
        item.classList.add("item");
        item.id = items[i].name.toLowerCase();
        item.setAttribute("onclick", "buy(this.id);");

        var itemImg = document.createElement("img");
        itemImg.src = "assets/images/shop/" + items[i].name + ".png";

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

        shop.appendChild(item);
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
}

function clicked(event) {
    var cookie = document.getElementById("cookie");
    cookie.animate(animations.clicked.frames, animations.clicked.options);
    var cookieCounter = document.getElementById("cookieCount");
    var cookies = parseInt(cookieCounter.innerHTML) + 1;
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
    var random = Math.floor(Math.random() * (window.innerWidth * 0.3 - 75));
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