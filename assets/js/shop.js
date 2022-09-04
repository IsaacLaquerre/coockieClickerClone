var boughtAudio = new Audio("assets/audio/bought.mp3");

function buy(item) {
    var element = document.getElementById(item);
    var shopItem = items.find(shopItem => shopItem.name === item.charAt(0).toUpperCase() + item.slice(1)) || upgrades.find(shopItem => shopItem.name === item.charAt(0).toUpperCase() + item.slice(1));
    var price = shopItem.price;
    if (cookieCount >= price) {
        cookieCount -= price;
        shopItem.owned = parseInt(shopItem.owned) + 1;
        localStorage.setItem(shopItem.name, shopItem.owned);
        if (!shopItem.exec) setBoughtItem(shopItem.name, shopItem.owned);
        else setBoughtUpgrade(shopItem.name, shopItem.owned);
        setCookies(cookieCount);
        localStorage.setItem("cookies", cookieCount);
        if (!shopItem.exec) cpsCount = parseFloat(cpsCount) + shopItem.cps;
        recalculateCps();
        element.animate(animations.bought.frames, animations.bought.options);
        if (playSounds) boughtAudio.play();
    } else {
        element.animate(animations.notEnough.frames, animations.notEnough.options);
    }
    checkAvailableItems();
}

function recalculatePrice(item) {
    var price = item.basePrice * Math.pow(priceIncrease, Math.max(0, item.owned));
    try {
        items.find(shopItem => shopItem.name === item.name).price = Math.ceil(price);
        upgrades.find(shopItem => shopItem.name === item.name).price = Math.ceil(price);
    } catch (e) {}
}

function recalculateCps() {
    var cps = localStorage.getItem("cps");
    var totalCps = 0;
    for (i in items) {
        var item = document.getElementById(items[i].name.toLowerCase());
        item.children[1].children[2].innerHTML = "CPS: " + items[i].cps;
        totalCps = parseFloat(totalCps) + parseFloat(items[i].owned * items[i].cps);
    }

    if (totalCps != cps) {
        setCps(totalCps);
        localStorage.setItem("cps", totalCps);
    }
}