chrome.storage.local.get(['sessions'], (result) => {
    const sessions = result.sessions || [];
    const sessionsList = document.getElementById('sessionsList');
  
    // Display sessions
    sessions.reverse().forEach((session, index) => {
      const sessionDiv = document.createElement('div');
      sessionDiv.className = 'session';
      sessionDiv.innerHTML = `
        <h3>Session ${sessions.length - index}</h3>
        <div class="timestamp">${session.timestamp}</div>
        <ul class="tabs-list"></ul>
      `;
  
      const tabsList = sessionDiv.querySelector('.tabs-list');
      session.tabs.forEach(url => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        link.target = "_blank";
        li.appendChild(link);
        tabsList.appendChild(li);
      });
  
      sessionsList.appendChild(sessionDiv);
    });
  
    // Export handlers
    document.getElementById('exportHtml').addEventListener('click', exportHtml);
    document.getElementById('exportCsv').addEventListener('click', exportCsv);
    document.getElementById('exportJson').addEventListener('click', exportJson);
  
    function exportHtml() {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><title>Saved Tabs Export</title></head>
        <body>
          ${sessions.map(session => `
            <h3>${session.timestamp}</h3>
            <ul>
              ${session.tabs.map(url => `<li><a href="${url}">${url}</a></li>`).join('')}
            </ul>
          `).join('')}
        </body>
        </html>
      `;
      downloadFile(htmlContent, 'saved_tabs.html', 'text/html');
    }
  
    function exportCsv() {
      let csvContent = "Session,Timestamp,URL\n";
      sessions.forEach((session, index) => {
        session.tabs.forEach(url => {
          csvContent += `Session ${index + 1},${session.timestamp},"${url}"\n`;
        });
      });
      downloadFile(csvContent, 'saved_tabs.csv', 'text/csv');
    }
  
    function exportJson() {
      const jsonContent = JSON.stringify(sessions, null, 2);
      downloadFile(jsonContent, 'saved_tabs.json', 'application/json');
    }
  
    function downloadFile(content, filename, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  });