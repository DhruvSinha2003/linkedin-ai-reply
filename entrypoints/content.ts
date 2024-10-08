import { defineContentScript } from 'wxt/sandbox';
import '~/assets/main.css';

export default defineContentScript({
  matches: ['https://www.linkedin.com/*'],
  runAt: 'document_idle',
  main() {

    const addAIButton = () => {
      const messageInputContainer = document.querySelector('.msg-form__contenteditable');
      if (!messageInputContainer || messageInputContainer.querySelector('.ai-button')) return;

      const aiButton = document.createElement('button');
      aiButton.className = 'ai-button flex items-center justify-center w-[44px] h-[44px] absolute right-2 bottom-2 z-10';
      aiButton.setAttribute('aria-label', 'AI Assist');
      aiButton.style.display = 'none';

      const aiIcon = document.createElement('img');
      aiIcon.src = chrome.runtime.getURL('ai-icon.png');
      aiIcon.className = 'w-[32px] h-[32px]';

      aiButton.appendChild(aiIcon);

      aiButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showAIPopup(messageInputContainer as HTMLElement);
      });

      const containerParent = messageInputContainer.closest('.msg-form__msg-content-container--scrollable');
      if (containerParent && window.getComputedStyle(containerParent).position === 'static') {
        (containerParent as HTMLElement).style.position = 'relative';
      }

      containerParent?.appendChild(aiButton);

      messageInputContainer.addEventListener('focus', () => {
        aiButton.style.display = 'flex';
      });

      messageInputContainer.addEventListener('blur', () => {
        setTimeout(() => {
          if (!containerParent?.contains(document.activeElement)) {
            aiButton.style.display = 'none';
          }
        }, 100);
      });
    };

    const showAIPopup = (form: Element) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]';

      const popupContainer = document.createElement('div');
      popupContainer.className = 'ai-popup bg-white rounded-[4px] shadow-md p-[20px] w-[360px] max-w-[90vw] flex flex-col';

      const chatContainer = document.createElement('div');
      chatContainer.className = 'flex flex-col overflow-y-auto mb-3 flex-grow';
      chatContainer.style.display = 'none';

      popupContainer.appendChild(chatContainer);

      const createChatBubble = (text: string, isUser: boolean): HTMLDivElement => {
        const bubble = document.createElement('div');
        bubble.className = isUser
          ? 'self-end bg-[#DFE1E7] p-3 rounded-2xl mb-2 max-w-[85%] text-sm break-words text-[#666D80]'
          : 'self-start bg-[#DBEAFE] p-3 rounded-2xl mb-2 max-w-[85%] text-sm break-words text-[#666D80]';
        bubble.innerText = text;
        return bubble;
      };

      const promptInput = document.createElement('textarea');
      promptInput.placeholder = 'Your prompt';
      promptInput.className = 'w-full p-2 border border-[#e2e8f0] rounded text-sm mb-3 resize-none h-9 text-[#666D80] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent';

      popupContainer.appendChild(promptInput);

      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'flex justify-end';

      const createButton = (text: string, iconSrc: string, className: string): HTMLButtonElement => {
        const button = document.createElement('button');
        button.className = `flex items-center justify-center ${className} px-3 py-1.5 text-sm font-semibold cursor-pointer rounded`;
        
        const icon = document.createElement('img');
        icon.src = chrome.runtime.getURL(iconSrc);
        icon.className = 'w-4 h-4 mr-2';
        icon.alt = text;

        const span = document.createElement('span');
        span.textContent = text;

        button.appendChild(icon);
        button.appendChild(span);

        return button;
      };

      const generateButton = createButton('Generate', 'generate-icon.svg', 'bg-[#3B82F6] text-white ml-2');

      buttonsContainer.appendChild(generateButton);
      popupContainer.appendChild(buttonsContainer);

      overlay.appendChild(popupContainer);

      generateButton.addEventListener('click', () => {
        const userPrompt = promptInput.value.trim();
        if (!userPrompt) return;

        if (chatContainer.children.length === 0) {
          chatContainer.style.display = 'flex';
          chatContainer.style.maxHeight = '280px';
        }

        chatContainer.appendChild(createChatBubble(userPrompt, true));

        const aiResponse = `Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.`;

        chatContainer.appendChild(createChatBubble(aiResponse, false));

        chatContainer.scrollTop = chatContainer.scrollHeight;

        promptInput.value = '';
        
        buttonsContainer.innerHTML = ''; 
        
        const insertButton = createButton('Insert', 'insert-icon.svg', 'border-[2px] border-solid !border-[#666D80] text-[#666D80] bg-white hover:bg-gray-100');
        const regenerateButton = createButton('Regenerate', 'regenerate-icon.svg', 'bg-[#3B82F6] text-white ml-2 hover:bg-[#2563eb]');
        
        insertButton.style.border = '2px solid #666D80';
        insertButton.style.borderRadius = '4px';

        buttonsContainer.appendChild(insertButton);
        buttonsContainer.appendChild(regenerateButton);

        insertButton.addEventListener('click', () => {
          const aiResponse = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
          
          const messageInput = document.querySelector('.msg-form__contenteditable[contenteditable="true"]') as HTMLElement | null;
          
          if (messageInput) {
            messageInput.innerHTML = `<p>${aiResponse}</p>`;
            
            const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
            messageInput.dispatchEvent(inputEvent);
            
            messageInput.focus();
            
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(messageInput);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
            
            overlay.remove();
          }
        });

        regenerateButton.addEventListener('click', () => {
          // Implement regeneration logic here
        });
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });

      document.body.appendChild(overlay);
    };

    addAIButton();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.classList.contains('msg-form__contenteditable')) {
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
