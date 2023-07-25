const TWITTER_REGEXP = /Twitter/gi
const TWEET_REGEXP = /Tweet/gi

const replaceText = (node) => {
    if (node.nodeValue.match(TWEET_REGEXP) || node.nodeValue.match(TWEET_REGEXP)) {
        node.nodeValue = node.nodeValue
            .replace(TWITTER_REGEXP, 'Xitter')
            .replace(TWEET_REGEXP, 'Xeet');
    }
};

const walk = (node) => {
    if (node && node.getAttribute && node.getAttribute('data-testid') === 'tweetButtonInline') {
        console.log('found tweet button', node);
    }
    if (!node || !node.getAttribute || node.getAttribute('data-testid') === 'tweetText') {
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
                    if (node.nodeType === Node.TEXT_NODE) {
                        replaceText(node);
                    } else {
                        walk(node);
                    }
                }
            } else if (mutation.type === 'characterData') {
                walk(mutation.target);
            }
        }
    });

    observer.observe(document.body, {subtree: true, characterData: true, childList: true});
}

walk(document.body);
setTimeout(function () {
    walk(document.body);
    observeDOMChanges();
}, 1000);