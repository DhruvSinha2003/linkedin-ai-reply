import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name:"Linkedin AI Reply",
    description:"Created by Dhruv Sinha for ChatGPT Writer Take-home Coding Assignment ",
    version:"1.0.0",
    icons: {
      "16": "icon16.png",
      "32": "icon32.png",
      "48": "icon48.png",
      "96": "icon96.png",
      "128": "icon128.png"
    },
    permissions: ["activeTab"],
    content_scripts: [
      {
        matches: ["https://www.linkedin.com/*"],
        js: ["content-scripts/content.js"]
      }
    ],
    web_accessible_resources: [
      {
        resources: ["ai-icon.png", "insert-icon.svg", "regenerate-icon.svg","generate-icon.svg"],
        matches: ["https://www.linkedin.com/*"]
      }
    ]
  }
})