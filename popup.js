let editIndex = null; // Global variable to track the index of the URL being edited

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleDarkMode');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleButton.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
    });

    const sortOptions = document.getElementById('sortOptions');
    if (sortOptions) {
        sortOptions.addEventListener('change', displayUrls);
    } else {
        console.error("sortOptions element not found in the DOM.");
    }

    document.getElementById('addUrl').addEventListener('click', handleAddOrUpdateUrl);
    displayUrls();  // Load and display URLs on page load
});

async function displayUrls() {
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = ''; // Clear the current list

    const result = await chrome.storage.sync.get('searchUrls');
    const urls = result.searchUrls || [];

    if (urls.length === 0) {
        console.warn("No configured URLs found.");
        return;
    }

    const sortOption = document.getElementById('sortOptions').value;

    // Group URLs based on the selected option
    let groupedUrls;
    if (sortOption === 'domain') {
        groupedUrls = urls.reduce((acc, url) => {
            const domain = new URL(url.url).hostname;
            if (!acc[domain]) acc[domain] = [];
            acc[domain].push(url);
            return acc;
        }, {});
    } else if (sortOption === 'type') {
        groupedUrls = urls.reduce((acc, url) => {
            const type = url.type.charAt(0).toUpperCase() + url.type.slice(1); // Capitalize type
            if (!acc[type]) acc[type] = [];
            acc[type].push(url);
            return acc;
        }, {});
    }

    // Display grouped URLs
    for (const [group, urlGroup] of Object.entries(groupedUrls)) {
        const groupItem = document.createElement('li');
        groupItem.classList.add('group-item');

        const groupHeader = document.createElement('div');
        groupHeader.classList.add('group-header');

        const faviconUrl = sortOption === 'domain'
            ? `https://www.google.com/s2/favicons?sz=64&domain=${group}`
            : null;

        groupHeader.innerHTML = `
            ${faviconUrl ? `<img src="${faviconUrl}" class="favicon" alt="${group} favicon">` : ''}
            <span>${group}</span><span class="toggle-icon">►</span>
        `;
        groupHeader.addEventListener('click', () => {
            const groupContainer = groupItem.querySelector('.url-group');
            groupContainer.classList.toggle('hidden');
            const toggleIcon = groupHeader.querySelector('.toggle-icon');
            toggleIcon.textContent = groupContainer.classList.contains('hidden') ? '►' : '▼';
        });

        const urlGroupContainer = document.createElement('ul');
        urlGroupContainer.classList.add('url-group', 'hidden');

        urlGroup.forEach((urlConfig, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('url-item');
            listItem.innerHTML = `
                <strong>${urlConfig.name}</strong> (${urlConfig.type}): 
                <a href="${urlConfig.url}" target="_blank">${urlConfig.url}</a>
                <div class="button-group">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            listItem.querySelector('.edit-btn').addEventListener('click', () => {
                startEditingUrl(index, urlConfig);  // Trigger edit mode
            });

            listItem.querySelector('.delete-btn').addEventListener('click', async () => {
                const updatedUrls = urls.filter((_, i) => i !== index);
                await chrome.storage.sync.set({ searchUrls: updatedUrls });
                displayUrls();
            });

            urlGroupContainer.appendChild(listItem);
        });

        groupItem.appendChild(groupHeader);
        groupItem.appendChild(urlGroupContainer);
        urlList.appendChild(groupItem);
    }
}

function startEditingUrl(index, urlConfig) {
    // Populate fields with the current values of the selected URL entry
    document.getElementById('name').value = urlConfig.name;
    document.getElementById('type').value = urlConfig.type;
    document.getElementById('url').value = urlConfig.url;

    // Change button text to "Update URL" and store index
    document.getElementById('addUrl').textContent = 'Update URL';
    editIndex = index;
}

async function handleAddOrUpdateUrl() {
    const name = document.getElementById('name').value.trim();
    const type = document.getElementById('type').value;
    const url = document.getElementById('url').value.trim();

    if (name && type && url) {
        const result = await chrome.storage.sync.get('searchUrls');
        const urls = result.searchUrls || [];

        if (editIndex !== null) {
            // Update the existing entry
            urls[editIndex] = { name, type, url };
            editIndex = null;
            document.getElementById('addUrl').textContent = '+ Add URL';
        } else {
            // Add a new entry
            urls.push({ name, type, url });
        }

        await chrome.storage.sync.set({ searchUrls: urls });
        displayUrls();

        // Clear input fields after adding/updating
        document.getElementById('name').value = '';
        document.getElementById('type').value = '';
        document.getElementById('url').value = '';
    } else {
        console.warn("Please fill in all fields.");
    }
}
