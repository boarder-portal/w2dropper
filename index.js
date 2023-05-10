"use strict";
document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
});
async function delay(ms) {
    await new Promise((res) => setTimeout(res, ms));
}
async function waitElementsCount(selector, count, betweenChecks = 100) {
    while (true) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === count) {
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
    const searchInputNode = document.getElementById('search-bar-input');
    const searchButtonNode = searchInputNode === null || searchInputNode === void 0 ? void 0 : searchInputNode.nextElementSibling;
    if (!(searchInputNode instanceof HTMLInputElement) || !(searchButtonNode instanceof HTMLButtonElement)) {
        return;
    }
    searchInputNode.value = link !== null && link !== void 0 ? link : '';
    searchInputNode.dispatchEvent(new Event('change'));
    searchButtonNode.click();
    await waitElementsCount(ADD_TO_PLAYLIST_BUTTON_SELECTOR, 0);
    await waitElementsCount(ADD_TO_PLAYLIST_BUTTON_SELECTOR, 1);
    const addToPlaylistButtonNode = document.body.querySelector(ADD_TO_PLAYLIST_BUTTON_SELECTOR);
    if (!(addToPlaylistButtonNode instanceof HTMLButtonElement)) {
        return;
    }
    addToPlaylistButtonNode.click();
});
