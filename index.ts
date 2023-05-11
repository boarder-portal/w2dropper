document.body.addEventListener('dragover', (e) => {
  e.preventDefault();
})

async function delay(ms: number) {
  await new Promise((res) => setTimeout(res, ms));
}

async function waitElementsWithCountCondition(selector: string, checkFn: (count: number) => boolean, betweenChecks: number = 100): Promise<void> {
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
  e.preventDefault();

  const link = e.dataTransfer?.getData('text/plain');

  if (!link?.includes('youtube')) {
    return;
  }

  const searchInputNode = document.getElementById('search-bar-input');
  const searchButtonNode = searchInputNode?.nextElementSibling;
  const verticalScrollerNode = document.querySelector('.w2g-scroll-vertical');

  if (!(searchInputNode instanceof HTMLInputElement) || !(searchButtonNode instanceof HTMLButtonElement) || !verticalScrollerNode) {
    return;
  }

  searchInputNode.value = link ?? '';
  searchInputNode.dispatchEvent(new Event('change'));

  const prevScroll = verticalScrollerNode.scrollTop;

  const scrollHandler = () => {
    verticalScrollerNode.scrollTop = prevScroll;
  }

  verticalScrollerNode.addEventListener('scroll', scrollHandler)
  searchButtonNode.click();

  await waitElementsWithCountCondition(ADD_TO_PLAYLIST_BUTTON_SELECTOR, (count) => count === 0);
  await waitElementsWithCountCondition(ADD_TO_PLAYLIST_BUTTON_SELECTOR, (count) => count > 0);

  const addToPlaylistButtonNode = document.body.querySelector(ADD_TO_PLAYLIST_BUTTON_SELECTOR);

  if (!(addToPlaylistButtonNode instanceof HTMLButtonElement)) {
    return;
  }

  addToPlaylistButtonNode.click();

  await delay(1000);

  verticalScrollerNode.removeEventListener('scroll', scrollHandler)
})