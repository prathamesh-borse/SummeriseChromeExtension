# Summerise Chrome Extension

A lightweight Chrome extension that summarises web pages and selected text using a concise, easy-to-read summary. Built to help users quickly grasp the main points of articles, blog posts, and other long-form content.

Table of contents
- Features
- Screenshots
- Installation (for users)
- Installation (for developers / local development)
- Usage
- Extension details
- Permissions
- Contributing
- Troubleshooting
- License
- Contact

Features
- Summarise an entire web page with one click.
- Summarise highlighted / selected text from any page.
- Clean, minimal UI designed for quick reading.
- Works offline for UI and local interactions; uses configured summarisation backend when available.

Screenshots
- (Add screenshots to the repository's assets or docs folder and update this README with image links.)

Installation (for users)
1. Download the extension from the Chrome Web Store (if published) or load it locally:
   - Open chrome://extensions in Chrome.
   - Enable "Developer mode" in the top-right.
   - Click "Load unpacked" and select this project's folder.
2. The extension icon will appear in the toolbar. Click it to open the summariser UI.

Installation (for developers / local development)
Prerequisites
- Node.js (v14 or later recommended)
- npm or yarn

Steps
1. Clone the repository:
   git clone https://github.com/prathamesh-borse/SummeriseChromeExtension.git
2. Install dependencies (if the project uses a build step):
   cd SummeriseChromeExtension
   npm install
3. If the project has a build step, run:
   npm run build
4. Load the extension into Chrome for testing:
   - Open chrome://extensions and enable Developer mode.
   - Click "Load unpacked" and select the project folder or the build output folder.

Usage
- Click the extension toolbar icon to open the popup and summarise the current page.
- Select text on any web page, right-click, and use a "Summarise selection" context menu item (if implemented).
- Configure any backend API keys or settings via an options page (if provided).

Extension details
- Manifest: Check manifest.json for extension metadata (name, version, permissions, and background/popup scripts).
- Background script / service worker: Handles context menu and communication between popup/content scripts and any background tasks.
- Popup: The UI shown when the toolbar icon is clicked.
- Content script: Injected into pages to access selected text and page content safely.

Permissions
- The extension may request permissions such as:
  - activeTab (to access the current page)
  - contextMenus (to add a right-click menu entry)
  - storage (to save user settings or API keys)
  - https://*/ (or specific host permissions) if the extension communicates with a remote summarisation API

Contributing
- Contributions are welcome! Please open issues for bugs or feature requests.
- Fork the repo, create a feature branch, implement, add tests if applicable, and open a pull request.
- Follow any existing code style and add clear commit messages.

Troubleshooting
- If the extension doesn’t load, confirm Developer mode is enabled and you selected the correct folder.
- Check DevTools and the extension's background/service worker logs for errors.
- If summaries are failing and the extension uses an external API, confirm API keys and network access.

License
- Add your project license here (e.g., MIT). If you don’t have one yet, consider adding an OSI-approved license.

Contact
- Maintainer: prathamesh-borse
- GitHub: https://github.com/prathamesh-borse/SummeriseChromeExtension

Notes
- This README is a template. Update the Usage, Screenshots, and Permissions sections to reflect the extension's exact behavior and required hosts or API endpoints.