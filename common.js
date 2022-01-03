var isFirefox = false;
var isChrome = false;

isFirefox = chrome.runtime.getURL('').startsWith('moz-extension://');
isChrome = chrome.runtime.getURL('').startsWith('chrome-extension://');

