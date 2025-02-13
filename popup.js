document.getElementById('saveTabs').addEventListener('click', saveTabs);
document.getElementById('saveAndCloseTabs').addEventListener('click', saveAndCloseTabs);
document.getElementById('restoreTabs').addEventListener('click', restoreTabs);

// Save tabs without closing
function saveTabs() {
  chrome.tabs.query({}, (tabs) => {
    const tabUrls = tabs.map(tab => tab.url);
    const timestamp = new Date().toLocaleString();
    
    chrome.storage.local.get(['sessions'], (result) => {
      const sessions = result.sessions || [];
      sessions.push({ timestamp, tabs: tabUrls });
      chrome.storage.local.set({ sessions }, () => {
        updateSavedSessionsList(sessions);
      });
    });
  });
}

// Save and close tabs
function saveAndCloseTabs() {
  chrome.tabs.query({}, (tabs) => {
    const tabUrls = tabs.map(tab => tab.url);
    const timestamp = new Date().toLocaleString();

    chrome.storage.local.get(['sessions'], (result) => {
      const sessions = result.sessions || [];
      sessions.push({ timestamp, tabs: tabUrls });
      
      chrome.storage.local.set({ sessions }, () => {
        updateSavedSessionsList(sessions);
        
        // Close all tabs
        const tabIds = tabs.map(tab => tab.id);
        chrome.tabs.remove(tabIds);
        
        // Open session list
        chrome.tabs.create({ url: chrome.runtime.getURL("saved_tabs.html") });
      });
    });
  });
}

// Restore last session
function restoreTabs() {
  chrome.storage.local.get(['sessions'], (result) => {
    const sessions = result.sessions || [];
    if (sessions.length > 0) {
      const lastSession = sessions[sessions.length - 1];
      lastSession.tabs.forEach(url => {
        chrome.tabs.create({ url });
      });
    }
  });
}

// Update popup UI
function updateSavedSessionsList(sessions) {
  const list = document.getElementById('savedSessionsList');
  list.innerHTML = '';
  sessions.slice(-5).reverse().forEach(session => {
    const li = document.createElement('li');
    li.textContent = `${session.timestamp} (${session.tabs.length} tabs)`;
    list.appendChild(li);
  });
}

// Load initial sessions
chrome.storage.local.get(['sessions'], (result) => {
  updateSavedSessionsList(result.sessions || []);
});