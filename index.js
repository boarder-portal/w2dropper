"use strict";
document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
});
async function delay(ms) {
    await new Promise((res) => setTimeout(res, ms));
}
async function waitElementsWithCountCondition(selector, checkFn, betweenChecks = 100) {
    while (true) {
        const elements = document.querySelectorAll(selector);
        if (checkFn(elements.length)) {
            break;
        }
        await delay(betweenChecks);
    }
}
const ADD_TO_PLAYLIST_BUTTON_SELECTOR = '.w2g-search-actions button:nth-of-type(2)';
document.body.addEventListener('drop', async (e) => {
    var _a;
    e.preventDefault();
    const link = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
    if (!(link === null || link === void 0 ? void 0 : link.includes('youtube'))) {
        return;
    }
    const searchInputNode = document.getElementById('search-bar-input');
    const searchButtonNode = document.querySelector('.w2g-intro-search button[type="submit"]');
    const verticalScrollerNode = document.querySelector('.w2g-scroll-vertical');
    if (!(searchInputNode instanceof HTMLInputElement) || !(searchButtonNode instanceof HTMLButtonElement) || !verticalScrollerNode) {
        return;
    }
    searchInputNode.value = link !== null && link !== void 0 ? link : '';
    searchInputNode.dispatchEvent(new Event('change'));
    const prevScroll = verticalScrollerNode.scrollTop;
    const scrollHandler = () => {
        verticalScrollerNode.scrollTop = prevScroll;
    };
    verticalScrollerNode.addEventListener('scroll', scrollHandler);
    searchButtonNode.click();
    await waitElementsWithCountCondition(ADD_TO_PLAYLIST_BUTTON_SELECTOR, (count) => count === 0);
    await waitElementsWithCountCondition(ADD_TO_PLAYLIST_BUTTON_SELECTOR, (count) => count > 0);
    const addToPlaylistButtonNode = document.body.querySelector(ADD_TO_PLAYLIST_BUTTON_SELECTOR);
    if (!(addToPlaylistButtonNode instanceof HTMLButtonElement)) {
        return;
    }
    addToPlaylistButtonNode.click();
    await delay(1000);
    verticalScrollerNode.removeEventListener('scroll', scrollHandler);
});
