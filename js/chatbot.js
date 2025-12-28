/**
 * Portfolio Chatbot Widget
 * AI-powered chatbot for Michael Barnett's professional portfolio
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiUrl: 'http://209.38.116.95:8081', // Will change to HTTPS in production
    initialMessage: "Hi! I'm an AI assistant that can tell you about Mike's professional background, experience, and qualifications. What would you like to know?",
    placeholderText: "Ask about Mike's experience...",
    welcomeDelay: 500
  };

  // State management
  const state = {
    isOpen: false,
    isLoading: false,
    messages: [],
    sessionId: null,
    showContactForm: false
  };

  // DOM Elements (created dynamically)
  let elements = {};

  /**
   * Initialize the chatbot widget
   */
  function init() {
    createWidget();
    attachEventListeners();
    loadSessionFromStorage();
  }

  /**
   * Create the chatbot widget DOM structure
   */
  function createWidget() {
    // Create container
    const container = document.createElement('div');
    container.id = 'chatbot-widget';
    container.innerHTML = `
      <!-- Chat Bubble -->
      <button class="chatbot-bubble" aria-label="Open chat">
        <svg class="chatbot-icon chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="chatbot-icon close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Chat Window -->
      <div class="chatbot-window" role="dialog" aria-label="Chat with AI assistant">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <div>
              <div class="chatbot-title">Ask About Mike</div>
              <div class="chatbot-subtitle">AI Assistant</div>
            </div>
          </div>
          <button class="chatbot-close" aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div class="chatbot-messages" role="log" aria-live="polite">
          <!-- Messages will be inserted here -->
        </div>

        <!-- Typing Indicator -->
        <div class="chatbot-typing" style="display: none;">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <!-- Contact Form (hidden by default) -->
        <div class="chatbot-contact-form" style="display: none;">
          <div class="contact-form-header">
            <h4>Contact Mike</h4>
            <button class="contact-form-back" aria-label="Back to chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
          </div>
          <form class="contact-form">
            <div class="form-group">
              <label for="contact-name">Your Name</label>
              <input type="text" id="contact-name" name="name" required placeholder="John Smith">
            </div>
            <div class="form-group">
              <label for="contact-email">Your Email</label>
              <input type="email" id="contact-email" name="email" required placeholder="john@example.com">
            </div>
            <div class="form-group">
              <label for="contact-message">Message (optional)</label>
              <textarea id="contact-message" name="message" rows="3" placeholder="I'd like to discuss..."></textarea>
            </div>
            <button type="submit" class="contact-submit">Send Message</button>
          </form>
        </div>

        <!-- Input Area -->
        <div class="chatbot-input-area">
          <div class="chatbot-suggestions">
            <button class="suggestion-chip" data-message="What is Mike's experience?">Experience</button>
            <button class="suggestion-chip" data-message="What certifications does Mike have?">Certifications</button>
            <button class="suggestion-chip" data-message="What are Mike's key achievements?">Achievements</button>
          </div>
          <form class="chatbot-input-form">
            <input
              type="text"
              class="chatbot-input"
              placeholder="${CONFIG.placeholderText}"
              aria-label="Type your message"
            >
            <button type="submit" class="chatbot-send" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Store element references
    elements = {
      container,
      bubble: container.querySelector('.chatbot-bubble'),
      window: container.querySelector('.chatbot-window'),
      closeBtn: container.querySelector('.chatbot-close'),
      messagesContainer: container.querySelector('.chatbot-messages'),
      typingIndicator: container.querySelector('.chatbot-typing'),
      inputForm: container.querySelector('.chatbot-input-form'),
      input: container.querySelector('.chatbot-input'),
      sendBtn: container.querySelector('.chatbot-send'),
      suggestions: container.querySelectorAll('.suggestion-chip'),
      contactForm: container.querySelector('.chatbot-contact-form'),
      contactFormElement: container.querySelector('.contact-form'),
      contactFormBack: container.querySelector('.contact-form-back'),
      inputArea: container.querySelector('.chatbot-input-area')
    };
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    // Toggle chat
    elements.bubble.addEventListener('click', toggleChat);
    elements.closeBtn.addEventListener('click', toggleChat);

    // Send message
    elements.inputForm.addEventListener('submit', handleSubmit);

    // Suggestion chips
    elements.suggestions.forEach(chip => {
      chip.addEventListener('click', () => {
        const message = chip.dataset.message;
        if (message) {
          sendMessage(message);
        }
      });
    });

    // Contact form
    elements.contactFormElement.addEventListener('submit', handleContactSubmit);
    elements.contactFormBack.addEventListener('click', hideContactForm);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        toggleChat();
      }
    });
  }

  /**
   * Toggle chat window
   */
  function toggleChat() {
    state.isOpen = !state.isOpen;
    elements.container.classList.toggle('open', state.isOpen);

    if (state.isOpen) {
      // Show welcome message if no messages
      if (state.messages.length === 0) {
        setTimeout(() => {
          addMessage('assistant', CONFIG.initialMessage);
        }, CONFIG.welcomeDelay);
      }
      elements.input.focus();
    }
  }

  /**
   * Handle form submission
   */
  function handleSubmit(e) {
    e.preventDefault();
    const message = elements.input.value.trim();
    if (message && !state.isLoading) {
      sendMessage(message);
    }
  }

  /**
   * Send message to API
   */
  async function sendMessage(message) {
    // Add user message to UI
    addMessage('user', message);
    elements.input.value = '';

    // Show typing indicator
    state.isLoading = true;
    showTypingIndicator();

    try {
      const response = await fetch(`${CONFIG.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: state.sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Save session ID
      if (data.session_id) {
        state.sessionId = data.session_id;
        saveSessionToStorage();
      }

      // Add assistant response
      addMessage('assistant', data.response);

      // Check if response suggests contact
      if (shouldShowContactOption(data.response)) {
        addContactPrompt();
      }

    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', "I'm having trouble connecting right now. You can reach Mike directly at hiremichaelbarnett@gmail.com or try again in a moment.");
    } finally {
      state.isLoading = false;
      hideTypingIndicator();
    }
  }

  /**
   * Add message to chat
   */
  function addMessage(role, content) {
    const message = { role, content, timestamp: new Date() };
    state.messages.push(message);

    const messageEl = document.createElement('div');
    messageEl.className = `chatbot-message ${role}`;
    messageEl.innerHTML = `
      <div class="message-content">${formatMessage(content)}</div>
      <div class="message-time">${formatTime(message.timestamp)}</div>
    `;

    elements.messagesContainer.appendChild(messageEl);
    scrollToBottom();
  }

  /**
   * Add contact prompt
   */
  function addContactPrompt() {
    const promptEl = document.createElement('div');
    promptEl.className = 'chatbot-contact-prompt';
    promptEl.innerHTML = `
      <button class="contact-prompt-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        Contact Mike Directly
      </button>
    `;

    promptEl.querySelector('.contact-prompt-btn').addEventListener('click', showContactForm);
    elements.messagesContainer.appendChild(promptEl);
    scrollToBottom();
  }

  /**
   * Check if response suggests contacting Mike
   */
  function shouldShowContactOption(response) {
    const contactKeywords = [
      'contact mike',
      'reach out',
      'email',
      'directly',
      'schedule',
      'discuss further',
      'more details',
      'specific questions'
    ];
    const lowerResponse = response.toLowerCase();
    return contactKeywords.some(keyword => lowerResponse.includes(keyword));
  }

  /**
   * Show contact form
   */
  function showContactForm() {
    state.showContactForm = true;
    elements.contactForm.style.display = 'block';
    elements.inputArea.style.display = 'none';
    elements.messagesContainer.style.display = 'none';
  }

  /**
   * Hide contact form
   */
  function hideContactForm() {
    state.showContactForm = false;
    elements.contactForm.style.display = 'none';
    elements.inputArea.style.display = 'block';
    elements.messagesContainer.style.display = 'flex';
    scrollToBottom();
  }

  /**
   * Handle contact form submission
   */
  async function handleContactSubmit(e) {
    e.preventDefault();

    const formData = new FormData(elements.contactFormElement);
    const submitBtn = elements.contactFormElement.querySelector('.contact-submit');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(`${CONFIG.apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message') || 'Contacted via portfolio chatbot',
          session_id: state.sessionId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        hideContactForm();
        addMessage('assistant', "Thanks for reaching out! Your message has been sent to Mike. He'll get back to you soon.");
        elements.contactFormElement.reset();
      } else {
        throw new Error(data.message);
      }

    } catch (error) {
      console.error('Contact form error:', error);
      alert("There was an error sending your message. Please try emailing Mike directly at hiremichaelbarnett@gmail.com");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  }

  /**
   * Format message content (basic markdown-like formatting)
   */
  function formatMessage(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '&bull; ');
  }

  /**
   * Format time
   */
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Show typing indicator
   */
  function showTypingIndicator() {
    elements.typingIndicator.style.display = 'flex';
    scrollToBottom();
  }

  /**
   * Hide typing indicator
   */
  function hideTypingIndicator() {
    elements.typingIndicator.style.display = 'none';
  }

  /**
   * Scroll messages to bottom
   */
  function scrollToBottom() {
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
  }

  /**
   * Save session to storage
   */
  function saveSessionToStorage() {
    if (state.sessionId) {
      sessionStorage.setItem('chatbot_session_id', state.sessionId);
    }
  }

  /**
   * Load session from storage
   */
  function loadSessionFromStorage() {
    const savedSessionId = sessionStorage.getItem('chatbot_session_id');
    if (savedSessionId) {
      state.sessionId = savedSessionId;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
