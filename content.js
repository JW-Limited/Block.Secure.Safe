// content.js



// Function to delete all cookies for the current site
function deleteAllCookies() {
    chrome.runtime.sendMessage({ action: 'deleteAllCookies' });
    console.log("Deleted Privacy related Cookies.");
    clearLocalStorage();
    clearSessionStorage();
    clearIndexedDB();
    clearCache();
  }

  function clearLocalStorage() {
    localStorage.clear();
    console.log("Cleared Local Storage from the webside.");
  }
  
  function clearSessionStorage() {
    sessionStorage.clear();
    console.log("Cleared Session Storage from the webside.");
  }
  
  function clearIndexedDB() {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (indexedDB) {
      var request = indexedDB.deleteDatabase("myDatabase");
      request.onsuccess = function() {
        console.log("IndexedDB database deleted successfully");

        
      };
      request.onerror = function(event) {
        console.log("Error deleting IndexedDB database:", event.target.errorCode);
      };
    }
  }
  
  function clearCache() {
    window.caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        window.caches.delete(cacheName);
        console.log("Cleared Cache from the webside.");
      
      });
    });
  }
  
  // Call the privacy functions when the content script is executed.
  deleteAllCookies();
  