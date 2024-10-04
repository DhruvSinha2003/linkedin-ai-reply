import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    permissions: ["activeTab"],
    content_scripts: [
      {
        matches: ["https://www.linkedin.com/*"],
        js: ["content-scripts/content.js"]
      }
    ],
    web_accessible_resources: [
      {
        resources: ["ai-icon.png"],
        matches: ["https://www.linkedin.com/*"]
      }
    ]
  }
})