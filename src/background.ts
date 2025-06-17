console.log('action trigger');
chrome.action.onClicked.addListener(async (tab) => {
  console.log('inside.....................');
  
  try {
    await chrome.scripting.executeScript({
      target: {tabId: tab.id!},
      files: ['content.js']
    });
  } catch (error) {
    console.log(error);
  }
});