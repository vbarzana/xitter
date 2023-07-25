const TWITTER_REGEXP = /Twitter/gi
const TWEET_REGEXP = /Tweet/gi

const replaceText = (node) => {
    if (node.nodeValue.match(TWEET_REGEXP) || node.nodeValue.match(TWEET_REGEXP)) {
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
        testIdAttr.indexOf('tweetTextarea') >= 0) {
        return false;
    }
    return isProcessable(node.parentNode);
}

const walk = (node) => {
    const testIdAttr = node && node.getAttribute && node.getAttribute('data-testid') || '';
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

walk(document.body);
setTimeout(function () {
    walk(document.body);
    observeDOMChanges();
}, 1000);