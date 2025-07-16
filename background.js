chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'logVisitedProfile') {
    chrome.storage.local.get(['visitedProfiles'], (result) => {
      const visited = result.visitedProfiles || [];
      if (!visited.includes(request.url)) {
        visited.push(request.url);
        chrome.storage.local.set({ visitedProfiles: visited });
      }
    });
  }
});