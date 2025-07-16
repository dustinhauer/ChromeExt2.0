document.getElementById('start').addEventListener('click', () => {
  const likeOnly = document.getElementById('likeOnly').checked;
  chrome.storage.local.set({ autoViewing: true, likeOnly });
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: () => window.dispatchEvent(new Event('startAutoView'))
    });
  });
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.storage.local.set({ autoViewing: false });
});

function updateDashboard() {
  chrome.storage.local.get(['visitedProfiles'], (data) => {
    const dashboard = document.getElementById('dashboard');
    const count = (data.visitedProfiles || []).length;
    dashboard.innerHTML = `<strong>Visited Profiles:</strong> ${count}`;
  });
}

updateDashboard();
setInterval(updateDashboard, 5000);