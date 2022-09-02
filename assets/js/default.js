var cookieCount = 0;
var cpsCount = 0;
var priceIncrease = 1.15;

const items = [
    { name: "Cursor", price: 15, basePrice: 15, cps: 0.1, owned: 0 },
    { name: "Grandma", price: 100, basePrice: 100, cps: 1, owned: 0 }
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

function clicked(event) {
    var cookie = document.getElementById("cookie");
    cookie.animate(animations.clicked.frames, animations.clicked.options);
    var cookieCounter = document.getElementById("cookieCount");
    var cookies = parseInt(cookieCounter.innerHTML) + 1;
    cookieCount = cookies;
    cookieCounter.innerHTML = cookies;
    localStorage.setItem("cookies", cookies);
    throwCookie({ x: event.clientX, y: event.clientY });
}

function addCps() {
    var cps = localStorage.getItem("cps");
    if (cps) {
        cookieCount = parseFloat(cookieCount) + parseFloat(cps);
        setCookies(cookieCount);
        localStorage.setItem("cookies", cookieCount);
    }
}

function throwCookie(coords) {
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
    var cookie = document.createElement("img");
    var random = Math.floor(Math.random() * (window.innerWidth * 0.3 - 75));
    cookie.classList.add("pixelCookie");
    cookie.src = "assets/images/cookie_pixelated.png";
    cookie.width = "50";
    cookie.style.opacity = 0.6;
    cookie.style.zIndex = 1;
    cookie.style.filter = "brightness(0.8)";
    cookie.style.position = "absolute";
    cookie.style.left = random + "px";
    cookie.style.top = "-50px";
    document.getElementById("game").appendChild(cookie);
    var frames = [
        { transform: "translate(0)" },
        { transform: "translateY(350px)", opacity: 0.1 },
    ];
    cookie.animate(frames, {
        duration: 1250,
        iterations: 1
    });
    setTimeout(() => {
        cookie.remove();
    }, 1250);
}