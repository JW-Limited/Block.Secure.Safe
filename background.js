// Listen for changes in the protection state
chrome.storage.local.onChanged.addListener(function(changes) {
  var protectionEnabled = changes.protectionEnabled.newValue;
  if (protectionEnabled) {
    enableProtection();
  } else {
    disableProtection();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'deleteAllCookies') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      if (activeTab) {
        chrome.cookies.getAll({ url: activeTab.url }, function(cookies) {
          for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            // Check if the cookie is a tracking cookie
            if (isTrackingCookie(cookie)) {
              const details = {
                url: cookie.secure ? `https://${cookie.domain}${cookie.path}` : `http://${cookie.domain}${cookie.path}`,
                name: cookie.name
              };
              chrome.cookies.remove(details, function(removedCookie) {
                console.log("Removed cookie:", removedCookie);
              });
            }
          }
        });
      }
    });
  }
});

// Helper function to determine if a cookie is a tracking cookie
function isTrackingCookie(cookie) {
  // Check for specific properties commonly associated with tracking cookies
  const hasTrackingProperties =
    cookie.domain.endsWith('.tracker.com') ||
    cookie.name.toLowerCase().includes('tracker') ||
    cookie.name.toLowerCase().includes('ad') ||
    cookie.name.toLowerCase().includes('pixel') ||
    cookie.name.toLowerCase().includes('analytics') ||
    cookie.path === '/tracking' ||
    cookie.httpOnly ||
    cookie.sameSite === 'none';

  return hasTrackingProperties;
}

function urlMatchesPattern(url, pattern) {
  const regex = new RegExp(pattern);
  return regex.test(url);
}

// Helper function to modify headers in the request
function modifyRequestHeaders(details) {
  const headers = details.requestHeaders;

  // Modify headers as needed
  // For example, you can add or remove headers
  // Here, we add a custom header named "BlockSecureSafe" with the value "enabled"
  headers.push({ name: "BlockSecureSafe", value: "enabled" });

  return { requestHeaders: headers };
}

// Enable the protection
function enableProtection() {
  
  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      if (details.url.startsWith('http://')) {
        const httpsURL = details.url.replace('http://', 'https://');
        console.log("upgraded to https")
        return { redirectUrl: httpsURL };
        
      }
    },
    { urls: ["http://*/*"] },
    ["blocking"]
  );

  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      // Check if the protection is enabled
      chrome.storage.local.get("protectionEnabled", function (result) {
        const protectionEnabled = result.protectionEnabled;

        if (protectionEnabled) {
          // Modify headers for all requests
          modifyRequestHeaders(details);
        }
      });
    },
    { urls: ["<all_urls>"], types: ["main_frame"] },
    []
  );

  // Block specific requests based on URL patterns
  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      // Check if the protection is enabled
      chrome.storage.local.get("protectionEnabled", function (result) {
        const protectionEnabled = result.protectionEnabled;

        if (protectionEnabled) {
          // Check if the request URL matches a pattern to block 
          const url = details.url;
          if (urlMatchesPattern(url, "example.com/trackers")) {
            // Remove cookies for the matching URL
            chrome.cookies.getAll({ url }, function (cookies) {
              cookies.forEach(function (cookie) {
                chrome.cookies.remove({ url: cookie.url, name: cookie.name });
              });
            });
            return { cancel: true };
          }
        };
      });
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
};

// Disable the protection
function disableProtection() {
  // Remove the onBeforeSendHeaders listener
  chrome.webRequest.onBeforeSendHeaders.removeListener(modifyRequestHeaders);

  // Remove the onBeforeRequest listener
  chrome.webRequest.onBeforeRequest.removeListener(blockTracker);
}

// Block tracker requests
function blockTracker(details) {
  return { cancel: true };
}

// Set up the listeners when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  enableProtection();
});

// Set up the listeners when the extension is started
chrome.runtime.onStartup.addListener(function() {
  enableProtection();
});