chrome.runtime.onInstalled.addListener(() => {
    console.log("RapidReputation installed");
});

// Open fullpage.html when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("fullpage.html") });
});

// Handle omnibox input (for osint keyword)
chrome.omnibox.onInputEntered.addListener(async (text) => {
    console.log("Omnibox input received:", text);

    // Retrieve URLs from storage
    const result = await chrome.storage.sync.get("searchUrls");
    const urls = result.searchUrls || [];

    // Detect artifact type (IP, Domain, Hash)
    const artifactType = detectArtifactType(text);
    console.log("Detected artifact type:", artifactType);

    // Default to VirusTotal search if no configured URLs match
    const defaultUrl = `https://www.virustotal.com/gui/search/${encodeURIComponent(text)}`;
    if (!artifactType) {
        chrome.tabs.create({ url: defaultUrl });
        return;
    }

    // Filter URLs that match the artifact type or are set to "all"
    const matchingUrls = urls.filter(urlConfig =>
        urlConfig.type === artifactType || urlConfig.type === "all"
    );

    // Open each matching URL in a new tab
    if (matchingUrls.length > 0) {
        matchingUrls.forEach((urlConfig) => {
            const searchUrl = urlConfig.url.replace("%s%", encodeURIComponent(text));
            chrome.tabs.create({ url: searchUrl });
        });
    } else {
        // Fallback to default if no matching URLs are found
        chrome.tabs.create({ url: defaultUrl });
    }
});

// Detect artifact types (IP, Domain, Hash)
function detectArtifactType(text) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])$/;
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const sha256Regex = /^[A-Fa-f0-9]{64}$/;
    const sha1Regex = /^[A-Fa-f0-9]{40}$/;
    const md5Regex = /^[A-Fa-f0-9]{32}$/;

    if (ipRegex.test(text)) return "ip";
    if (domainRegex.test(text)) return "domain";
    if (sha256Regex.test(text) || sha1Regex.test(text) || md5Regex.test(text)) return "hash";
    return null;
}
