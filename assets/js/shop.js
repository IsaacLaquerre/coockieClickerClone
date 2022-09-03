var boughtAudio = new Audio("assets/audio/bought.mp3");

function buy(item) {
    var element = document.getElementById(item);
    var shopItem = items.find(shopItem => shopItem.name === item.charAt(0).toUpperCase() + item.slice(1));
    var price = shopItem.price;
    if (cookieCount >= price) {
        cookieCount -= price;
        shopItem.owned = parseInt(shopItem.owned) + 1;
        localStorage.setItem(shopItem.name, shopItem.owned);
        setBoughtItem(shopItem.name, shopItem.owned);
        setCookies(cookieCount);
        localStorage.setItem("cookies", cookieCount);
        cpsCount = parseFloat(cpsCount) + shopItem.cps;
        setCps(cpsCount);
        localStorage.setItem("cps", cpsCount);
        element.animate(animations.bought.frames, animations.bought.options);
        if (playSounds) boughtAudio.play();
    } else {
        element.animate(animations.notEnough.frames, animations.notEnough.options);
    }
    checkAvailableItems();
}

function recalculatePrice(item) {
    var price = item.basePrice * Math.pow(priceIncrease, Math.max(0, item.owned));
    items.find(shopItem => shopItem.name === item.name).price = Math.ceil(price);
}