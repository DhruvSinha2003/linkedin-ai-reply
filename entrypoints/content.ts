import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
  matches: ['https://www.linkedin.com/*'],
  runAt: 'document_idle',
  main() {
    console.log('LinkedIn AI Reply content script is running');

    const addAIButton = () => {
      const commentForms = document.querySelectorAll('.comments-comment-box__form');

      commentForms.forEach((form) => {
        const buttonContainer = form.querySelector('.display-flex.justify-space-between .display-flex');
        if (!buttonContainer || buttonContainer.querySelector('.ai-button')) return;

        // Create the AI button
        const aiButton = document.createElement('button');
        aiButton.className = 'ai-button artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary';
        aiButton.setAttribute('aria-label', 'AI Assist');
        aiButton.style.cssText = `
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        `;

        const aiIcon = document.createElement('img');
        aiIcon.src = chrome.runtime.getURL('ai-icon.png');
        aiIcon.style.cssText = `
          width: 32px;
          height: 32px;
        `;
        aiButton.appendChild(aiIcon);

        // Handle button click event to show popup
        aiButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          showAIPopup(form as HTMLFormElement);
        });

        // Insert the AI button at the beginning of the container
        buttonContainer.insertBefore(aiButton, buttonContainer.firstChild);
      });
    };

    const showAIPopup = (form: HTMLFormElement) => {
      // Create the overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      `;

      // Create the popup container
      const popupContainer = document.createElement('div');
      popupContainer.className = 'ai-popup';
      popupContainer.style.cssText = `
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 80%;
        max-width: 600px;
      `;

      // Create chat container for prompt and response
      const chatContainer = document.createElement('div');
      chatContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 16px;
      `;

      // Append chat container to popup
      popupContainer.appendChild(chatContainer);

      // Create the prompt bubble (chat-style)
      const createChatBubble = (text: string, isUser: boolean) => {
        const bubble = document.createElement('div');
        bubble.style.cssText = `
          align-self: ${isUser ? 'flex-end' : 'flex-start'};
          background-color: ${isUser ? '#f1f1f1' : '#e1f5fe'};
          padding: 10px 14px;
          border-radius: 18px;
          margin-bottom: 8px;
          max-width: 80%;
          font-size: 14px;
          word-wrap: break-word;
        `;
        bubble.innerText = text;
        return bubble;
      };

      // Add textarea for prompt input
      const promptInput = document.createElement('textarea');
      promptInput.placeholder = 'Your prompt';
      promptInput.style.cssText = `
        width: 100%;
        padding: 8px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 12px;
        resize: none;
        height: 60px;
      `;

      // Append the prompt input to popup
      popupContainer.appendChild(promptInput);

      // Create buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
      `;

      // Generate button (blue)
      const generateButton = document.createElement('button');
      generateButton.className = 'generate-button artdeco-button artdeco-button--primary';
      generateButton.innerHTML = `
        <img src="${chrome.runtime.getURL('generate-icon.svg')}" alt="Generate" style="margin-right: 4px; width: 12px; height: 12px;"/> Generate
      `;
      generateButton.style.cssText = `
        background-color: #0a66c2;
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        margin-left: 8px;
      `;

      // Append generate button to the container
      buttonsContainer.appendChild(generateButton);
      popupContainer.appendChild(buttonsContainer);

      // Append the popup to the overlay
      overlay.appendChild(popupContainer);

      // Append the overlay to the body
      document.body.appendChild(overlay);

      // Handle generating the AI response
      generateButton.addEventListener('click', () => {
        const userPrompt = promptInput.value.trim();
        if (!userPrompt) return;

        // Add the user prompt to the chat container
        chatContainer.appendChild(createChatBubble(userPrompt, true));

        // Simulated AI response
        const aiResponse = `Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.`;

        // Add AI response to the chat container
        chatContainer.appendChild(createChatBubble(aiResponse, false));

        // Scroll chat to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Clear the prompt input and change "Generate" to "Regenerate"
        promptInput.value = '';
        generateButton.innerHTML = `
          <img src="${chrome.runtime.getURL('regenerate-icon.svg')}" alt="Regenerate" style="margin-right: 4px; width: 12px; height: 12px;"/> Regenerate
        `;

        // Create and append the "Insert" button after generating the response
        if (!buttonsContainer.querySelector('.insert-button')) {
          const insertButton = document.createElement('button');
          insertButton.className = 'insert-button artdeco-button artdeco-button--muted';
          insertButton.innerHTML = `
            <img src="${chrome.runtime.getURL('insert-icon.svg')}" alt="Insert" style="margin-right: 4px; width: 12px; height: 12px;"/> Insert
          `;
          insertButton.style.cssText = `
            background-color: #f3f6f8;
            color: rgba(0,0,0,0.6);
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            margin-left: 8px;
          `;

          // Handle inserting AI response into the comment input
          insertButton.addEventListener('click', () => {
            const editor = form.querySelector('.ql-editor') as HTMLElement;
            if (editor) {
              editor.textContent = aiResponse; // Insert AI response into the input box
              overlay.remove(); // Close the popup after inserting
            }
          });

          // Append the Insert button to the buttons container
          buttonsContainer.appendChild(insertButton);
        }
      });

      // Close popup when clicking outside
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });
    };

    // Initial call to add AI buttons
    addAIButton();

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.classList.contains('comments-comment-box__form')) {
                addAIButton();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});