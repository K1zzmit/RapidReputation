# RapidReputation

**RapidReputation** is a Chrome extension designed for cybersecurity professionals to quickly search OSINT (Open Source Intelligence) resources for IP addresses, domains, and file hashes. With this tool, users can seamlessly search across multiple sources by typing `osint` in the Chrome omnibox (address bar) and entering the artifact of interest.

## Features

- **Quick Search for OSINT Resources**: Supports searches for IP addresses, domains, and hashes (MD5, SHA1, SHA256) across configurable OSINT sources.
- **Omnibox Integration**: Type `osint` in the Chrome address bar, press **Tab** or **Space**, then enter the artifact to search.
- **Customizable Search URLs**: Add, edit, or delete custom search URLs for different artifact types.
- **Dark Mode**: Toggle between light and dark modes for comfortable viewing.
- **Sorting and Grouping**: Sort configured URLs by type or domain for easy navigation.
- **Favicons**: Displays favicons next to domain groups for a visually intuitive experience.

## Installation

To install this extension from the source:

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/K1zzmit/RapidReputation.git
   ```
   
2. **Open Chrome and Navigate to Extensions**
   - Go to ```chrome://extensions/```.
   - Enable **Developer mode** by toggling the switch in the top-right corner.

3. **Load the Extension**
   - Click on **Load unpacked** and select the directory where you cloned/downloaded the repository.

4. The **RapidReputation** extension should now appear in your list of extensions and be ready for use.

## Usage

### Omnibox Search

1. Open a new Chrome tab.
2. Type ```osint``` in the address bar, then press **Tab** or **Space**.
3. Enter an IP address, domain, or hash (MD5, SHA1, SHA256).
4. RapidReputation will open a new tab for each configured URL that matches the artifact type.

### Configuring Search URLs

1. Click the **RapidReputation** extension icon to open the main configuration page (```fullpage.html```).
2. In the **Add New Search URL** section:
   - **Name**: Enter a label for the OSINT source (e.g., VirusTotal).
   - **Type**: Select the type of artifact this URL supports (IP, Domain, Hash, or All).
   - **URL Template**: Enter the URL with `%s%` as a placeholder for the artifact (e.g., ```https://www.virustotal.com/gui/search/%s%```).
3. Click **+ Add URL** to save the configuration.
4. You can edit or delete entries in the **Configured URLs** section.

### Dark Mode

Toggle between **Light Mode** and **Dark Mode** by clicking the **🌙 Dark Mode** button in the header.
