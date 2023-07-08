
document.addEventListener("DOMContentLoaded", function() {
  var button = document.getElementById("toggleButton2");
  button.addEventListener("click", toggleProtection);
});

document.addEventListener('DOMContentLoaded', function() {
  var settingsButton = document.getElementById('settingsButton');
  
  settingsButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'settings.html' });
  });
});

chrome.storage.local.get("protectionEnabled", function(result) {
  var protectionEnabled = result.protectionEnabled;

  if (protectionEnabled === undefined) {
    protectionEnabled = false;
    chrome.storage.local.set({ protectionEnabled: protectionEnabled });
  }

  updateButtonState2(protectionEnabled);
});

function toggleProtection() {
  chrome.storage.local.get("protectionEnabled", function(result) {
    var protectionEnabled = result.protectionEnabled;

    if (protectionEnabled === undefined) {
      protectionEnabled = false;
    }

    protectionEnabled = !protectionEnabled;
    chrome.storage.local.set({ protectionEnabled: protectionEnabled });
    updateButtonState2(protectionEnabled);
  });
}


function updateButtonState2(protectionEnabled) {
  var button = document.getElementById('toggleButton2');
  var textAbove = document.getElementById('textAbove')
  if (protectionEnabled) {
    button.checked = true;
    enableTrackerBlocker();
    chrome.runtime.sendMessage({ action: 'enableProtection' });
  } else {
    button.checked = false;
    disableTrackerBlocker();
    chrome.runtime.sendMessage({ action: 'disableProtection' });
  }
}

function enableTrackerBlocker() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    if (activeTab.url.startsWith('chrome://')) {
      console.log('Cannot access a chrome:// URL');
      return;
    }
    chrome.tabs.executeScript(activeTab.id, { file: 'content.js' });
  });
}

function disableTrackerBlocker() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    if (activeTab.url.startsWith('chrome://')) {
      console.log('Cannot access a chrome:// URL');
      return;
    }
    chrome.tabs.executeScript(activeTab.id, { code: 'window.location.reload()' });
  });
}
  
 function openSettings() {
}