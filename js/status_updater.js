// Changed Label
var statusLabel = null;

document.addEventListener("DOMContentLoaded", function() 
{
    chrome.runtime.sendMessage({ message: "getURL" });

    chrome.runtime.onMessage.addListener(function(response) 
    {
        if (response.url) 
        {
            const statusLabel = document.getElementById('status-label-id');
            statusLabel.textContent = `${getSanitizedUrl(response.url)}`;
        }
    });
});

function getSanitizedUrl(url) 
{
    const cleanUrl = url.replace(/^https?:\/\/?/, '');
    const hostname = cleanUrl.split('/')[0];
    return hostname;
}

