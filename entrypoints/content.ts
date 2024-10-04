import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
  matches: ['https://www.linkedin.com/*'],
  runAt: 'document_idle',
  main() {
    console.log('LinkedIn AI Reply content script is running');

    const addAIButton = () => {
      console.log('Attempting to add AI button');
      const commentForms = document.querySelectorAll('.comments-comment-box__form');
      console.log('Found comment forms:', commentForms.length);

      commentForms.forEach((form, index) => {
        console.log(`Examining comment form ${index}:`, form);

        const buttonContainer = form.querySelector('.display-flex.justify-space-between .display-flex');
        if (!buttonContainer) {
          console.log(`Could not find button container for form ${index}`);
          return;
        }

        if (buttonContainer.querySelector('.ai-button')) {
          console.log(`AI button already exists for comment form ${index}`);
          return;
        }

        console.log(`Found button container for comment form ${index}:`, buttonContainer);

        // Creating the AI button
        const aiButton = document.createElement('button');
        aiButton.className = 'ai-button artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary';
        aiButton.setAttribute('aria-label', 'AI Assist');
        aiButton.style.cssText = `
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          padding: 0;
        `;

        // Adding the AI icon
        const aiIcon = document.createElement('img');
        aiIcon.src = chrome.runtime.getURL('ai-icon.png');
        aiIcon.alt = 'AI Assist';
        aiIcon.style.cssText = `
          width: 40px;
          height: 40px;
        `;

        aiButton.appendChild(aiIcon);

        aiButton.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('AI button was clicked');
          showAIPopup(form);
        });

        // Insert the AI button to the left of the emoji button
        const emojiButton = buttonContainer.querySelector('.emoji-hoverable-trigger');
        if (emojiButton) {
          buttonContainer.insertBefore(aiButton, emojiButton);
        } else {
          buttonContainer.prepend(aiButton);
        }
        console.log(`Added AI button to comment form ${index}`);
      });
    };

    const showAIPopup = (form: Element) => {
      const popup = document.createElement('div');
      popup.className = 'ai-popup';
      popup.style.cssText = `
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        padding: 10px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      `;

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Your prompt';
      input.style.cssText = `
        width: 100%;
        padding: 5px;
        margin-bottom: 10px;
      `;

      const generateButton = document.createElement('button');
      generateButton.textContent = 'Generate';
      generateButton.style.cssText = `
        padding: 5px 10px;
        background: #0a66c2;
        color: white;
        border: none;
        cursor: pointer;
      `;

      popup.appendChild(input);
      popup.appendChild(generateButton);

      generateButton.addEventListener('click', () => {
        const message = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
        showGeneratedMessage(form, message);
        popup.remove();
      });

      document.body.appendChild(popup);

      // Position the popup near the AI button
      const rect = form.getBoundingClientRect();
      popup.style.left = `${rect.left}px`;
      popup.style.top = `${rect.bottom + window.scrollY}px`;
    };

    const showGeneratedMessage = (form: Element, message: string) => {
      const messageContainer = document.createElement('div');
      messageContainer.className = 'ai-generated-message';
      messageContainer.style.cssText = `
        background: #f3f6f8;
        border: 1px solid #e0e0e0;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
      `;

      const messageText = document.createElement('p');
      messageText.textContent = message;

      const insertButton = document.createElement('button');
      insertButton.textContent = 'Insert';
      insertButton.style.cssText = `
        padding: 5px 10px;
        background: #0a66c2;
        color: white;
        border: none;
        cursor: pointer;
        margin-top: 10px;
      `;

      insertButton.addEventListener('click', () => {
        const editor = form.querySelector('.ql-editor');
        if (editor) {
          editor.textContent = message;
          messageContainer.remove();
        }
      });

      messageContainer.appendChild(messageText);
      messageContainer.appendChild(insertButton);

      form.appendChild(messageContainer);
    };

    // Initial call to add buttons
    addAIButton();

    // Use a MutationObserver to watch for new comment forms
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          console.log('DOM changed, attempting to add AI button');
          addAIButton();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('MutationObserver set up');
  },
});