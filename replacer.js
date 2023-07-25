const TWITTER_REGEXP = /Twitter/gi;
const TWEET_REGEXP = /Tweet/gi;
const GET_VERIFIED_REGEXP = /Get Verified/gi;

function isXeetable(text) {
    return text && (text.match(TWITTER_REGEXP) ||
        text.match(TWEET_REGEXP) ||
        text.match(GET_VERIFIED_REGEXP));
}

function xeetText(text) {
    return text.replace(TWITTER_REGEXP, "Xitter")
        .replace(TWEET_REGEXP, "Xeet")
        .replace(GET_VERIFIED_REGEXP, "Get Xeeted");
}

function replacePlaceholder(node) {
    if (isXeetable(node.placeholder)) {
        node.placeholder = xeetText(node.placeholder);
    }
}

const replaceText = (node) => {
    if (isXeetable(node.nodeValue)) {
        node.nodeValue = xeetText(node.nodeValue);
    }
};

function isProcessable(node) {
    if (!node) {
        return true;
    }
    // we don't want to change users' tweets and users' new tweet being typed
    const testIdAttr =
        (node.getAttribute && node.getAttribute("data-testid")) || "";
    if (testIdAttr === "tweetText" || testIdAttr.indexOf("tweetTextarea") >= 0) {
        return false;
    }
    return isProcessable(node.parentNode);
}

const walk = (node) => {
    if (!isProcessable(node)) {
        return;
    }
    replacePlaceholder(node);
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        if (childNode.nodeType === Node.TEXT_NODE) {
            replaceText(childNode);
        } else {
            walk(childNode);
        }
    }
};

function observeDOMChanges() {
    const observer = new MutationObserver((mutationsList) => {
        xeetIt();
    });

    observer.observe(document.body, {subtree: true, childList: true});
}

function xeetIt() {
    walk(document.body);
    const inputs = Array.from(document.getElementsByTagName("input"));
    for (let input of inputs) {
        replacePlaceholder(input);
    }
}

xeetIt();
setTimeout(function () {
    xeetIt();
    observeDOMChanges();
}, 1000);
