chrome.runtime.onMessage.addListener((__, _, sendResponse) => {
  sendResponse({
    received: true,
  });

  return true;
});
