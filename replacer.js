const TWITTER_REGEXP = /Twitter/gi
const TWEET_REGEXP = /Tweet/gi

function replacePlaceholder(node) {
    if (node.placeholder && (
        node.placeholder.match(TWITTER_REGEXP) || node.placeholder.match(TWEET_REGEXP))) {
        console.error('placeholder', node);
        node.placeholder = node.placeholder
            .replace(TWITTER_REGEXP, 'Xitter')
            .replace(TWEET_REGEXP, 'Xeet');
    }
}

const replaceText = (node) => {
    if (node.nodeValue.match(TWITTER_REGEXP) || node.nodeValue.match(TWEET_REGEXP)) {
        node.nodeValue = node.nodeValue
            .replace(TWITTER_REGEXP, 'Xitter')
            .replace(TWEET_REGEXP, 'Xeet');
    }
};

function isProcessable(node) {
    if (!node) {
        return true;
    }
    // we don't want to change users' tweets and users' new tweet being typed
    const testIdAttr = node.getAttribute && node.getAttribute('data-testid') || '';
    if (testIdAttr === 'tweetText' ||
        testIdAttr.indexOf('tweetTextarea') >= 0
    ) {
        return false;
    }
    return isProcessable(node.parentNode);
}

const walk = (node) => {
    if (!isProcessable(node)) {
        return;
    }
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
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    walk(node);
                }
            }
        }
    });

    observer.observe(document.body, {subtree: true, childList: true});
}

function xeetIt() {
    walk(document.body);
    const inputs = Array.from(document.getElementsByTagName('input'));
    for (let input of inputs) {
        replacePlaceholder(input);
    }
}

xeetIt();
setTimeout(function () {
    xeetIt();
    observeDOMChanges();
}, 1000);