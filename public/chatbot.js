(function () {
  const agentId = document.currentScript.getAttribute("data-agent-id");
  if (!agentId) {
    console.error("❌ Agent ID missing");
    return;
  }

  /* ---------- Styles ---------- */
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes chat-fade-in {
    from { opacity: 0; transform: scale(0.5) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes chat-slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes chat-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
    50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
  }

  @keyframes typing-dot {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  #ai-chat-icon {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(59,130,246,0.4);
    z-index: 999999;
    animation: chat-fade-in 0.4s ease-out;
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
  }

  #ai-chat-icon:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 40px rgba(59,130,246,0.5);
  }

  #ai-chat-icon svg {
    width: 28px;
    height: 28px;
  }

  #ai-chat-icon .ai-online-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid #0a0a0f;
    animation: chat-pulse 2s infinite;
  }

  #ai-chat-box {
    position: fixed;
    bottom: 96px;
    right: 24px;
    width: 380px;
    height: 560px;
    background: #0a0a0f;
    border-radius: 20px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
    animation: chat-slide-up 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  #ai-chat-header {
    padding: 16px 18px;
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  #ai-chat-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  #ai-chat-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  #ai-chat-avatar svg {
    width: 20px;
    height: 20px;
    color: white;
  }

  #ai-chat-title {
    color: white;
    font-weight: 600;
    font-size: 15px;
    line-height: 1.2;
  }

  #ai-chat-status {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
  }

  #ai-chat-status-dot {
    width: 7px;
    height: 7px;
    background: #86efac;
    border-radius: 50%;
    animation: chat-pulse 2s infinite;
  }

  #ai-chat-status span {
    color: rgba(255,255,255,0.8);
    font-size: 11px;
  }

  #ai-chat-close {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.15);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  #ai-chat-close:hover {
    background: rgba(255,255,255,0.25);
  }

  #ai-chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    font-size: 13.5px;
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
  }

  #ai-chat-messages::-webkit-scrollbar {
    width: 4px;
  }

  #ai-chat-messages::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  .ai-msg-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  .ai-msg-row.user {
    flex-direction: row-reverse;
  }

  .ai-msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 13px;
  }

  .ai-msg-avatar.bot-av {
    background: linear-gradient(135deg, #22c55e, #16a34a);
  }

  .ai-msg-avatar.user-av {
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
  }

  .ai-msg-bubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 18px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 13.5px;
  }

  .ai-msg-row.user .ai-msg-bubble {
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .ai-msg-row.bot .ai-msg-bubble {
    background: rgba(255,255,255,0.06);
    color: #d4d4d8;
    border: 1px solid rgba(255,255,255,0.08);
    border-bottom-left-radius: 4px;
  }

  .ai-msg-time {
    font-size: 10px;
    color: rgba(255,255,255,0.3);
    margin-top: 3px;
    padding: 0 4px;
    text-align: right;
  }

  .ai-msg-row.bot .ai-msg-time {
    text-align: left;
  }

  #ai-typing {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  #ai-typing-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 13px;
  }

  #ai-typing-bubble {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    padding: 12px 16px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  #ai-typing-bubble span {
    width: 7px;
    height: 7px;
    background: #3b82f6;
    border-radius: 50%;
    animation: typing-dot 1.2s infinite;
  }

  #ai-typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
  #ai-typing-bubble span:nth-child(3) { animation-delay: 0.4s; }

  #ai-chat-input-area {
    padding: 12px 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    flex-shrink: 0;
  }

  #ai-chat-input-wrap {
    display: flex;
    gap: 8px;
    align-items: center;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 4px 4px 4px 14px;
    transition: border-color 0.2s;
  }

  #ai-chat-input-wrap:focus-within {
    border-color: rgba(59,130,246,0.5);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }

  #ai-chat-input-wrap input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font-size: 13.5px;
    padding: 6px 0;
  }

  #ai-chat-input-wrap input::placeholder {
    color: #52525b;
  }

  #ai-send-btn {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s, transform 0.1s;
    flex-shrink: 0;
  }

  #ai-send-btn:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }

  #ai-send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  #ai-send-btn svg {
    width: 16px;
    height: 16px;
  }

  #ai-upload-btn {
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #a1a1aa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  #ai-upload-btn:hover {
    background: rgba(255,255,255,0.12);
    color: white;
  }

  #ai-upload-btn svg {
    width: 16px;
    height: 16px;
  }

  .ai-screenshot-preview {
    max-width: 200px;
    border-radius: 10px;
    margin-top: 4px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  #ai-chat-footer {
    text-align: center;
    padding: 6px 0 2px;
    font-size: 10px;
    color: #3f3f46;
  }
  `;
  document.head.appendChild(style);

  /* ---------- HTML ---------- */
  const icon = document.createElement("div");
  icon.id = "ai-chat-icon";
  icon.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <div class="ai-online-dot"></div>
  `;

  const box = document.createElement("div");
  box.id = "ai-chat-box";
  box.innerHTML = `
    <div id="ai-chat-header">
      <div id="ai-chat-header-left">
        <div id="ai-chat-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2"/>
            <circle cx="12" cy="5" r="2"/>
            <path d="M12 7v4"/>
            <line x1="8" y1="16" x2="8" y2="16"/>
            <line x1="16" y1="16" x2="16" y2="16"/>
          </svg>
        </div>
        <div>
          <div id="ai-chat-title">AI Assistant</div>
          <div id="ai-chat-status">
            <div id="ai-chat-status-dot"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
      <button id="ai-chat-close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div id="ai-chat-messages"></div>
    <div id="ai-chat-input-area">
      <div id="ai-chat-input-wrap">
        <input id="ai-chat-text" placeholder="Type your message..." />
        <button id="ai-upload-btn" title="Upload payment screenshot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>
        <input type="file" id="ai-file-input" accept="image/*" style="display:none" />
        <button id="ai-send-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <div id="ai-chat-footer">Powered by AutoBot Studio</div>
    </div>
  `;

  document.body.appendChild(icon);
  document.body.appendChild(box);

  /* ---------- Toggle ---------- */
  const chatInput = box.querySelector("#ai-chat-text");
  const sendBtn = box.querySelector("#ai-send-btn");
  const uploadBtn = box.querySelector("#ai-upload-btn");
  const fileInput = box.querySelector("#ai-file-input");
  const messages = box.querySelector("#ai-chat-messages");
  const closeBtn = box.querySelector("#ai-chat-close");
  let pendingImage = null; // base64 image waiting to be sent
  let conversationHistory = []; // remember full conversation

  icon.onclick = () => {
    box.style.display = "flex";
    icon.style.display = "none";
    chatInput.focus();
    if (messages.children.length === 0) {
      addMessage("👋 Hi! How can I help you today?", "bot");
    }
  };

  closeBtn.onclick = () => {
    box.style.display = "none";
    icon.style.display = "flex";
  };

  /* ---------- Helpers ---------- */
  function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(text, type, imgSrc) {
    const row = document.createElement("div");
    row.className = `ai-msg-row ${type}`;

    const avatar = document.createElement("div");
    avatar.className = `ai-msg-avatar ${type === "bot" ? "bot-av" : "user-av"}`;
    avatar.innerHTML = type === "bot" ? "✦" : "◈";

    const bubble = document.createElement("div");
    bubble.className = "ai-msg-bubble";
    if (imgSrc) {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.className = "ai-screenshot-preview";
      bubble.appendChild(img);
      if (text) {
        const p = document.createElement("p");
        p.style.marginTop = "6px";
        p.innerText = text;
        bubble.appendChild(p);
      }
    } else {
      bubble.innerText = text;
    }

    const time = document.createElement("div");
    time.className = "ai-msg-time";
    time.innerText = getTime();

    const inner = document.createElement("div");
    if (type === "bot") {
      inner.appendChild(bubble);
      inner.appendChild(time);
      row.appendChild(avatar);
      row.appendChild(inner);
    } else {
      inner.appendChild(bubble);
      inner.appendChild(time);
      row.appendChild(inner);
      row.appendChild(avatar);
    }

    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  /* ---------- Image Upload ---------- */
  uploadBtn.onclick = () => fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      pendingImage = e.target.result; // base64
      addMessage("📎 Screenshot ready to send", "user", pendingImage);
      chatInput.placeholder = "Add a message or just send...";
      chatInput.focus();
    };
    reader.readAsDataURL(file);
    fileInput.value = "";
  };

  function showTyping() {
    const row = document.createElement("div");
    row.id = "ai-typing";
    row.innerHTML = `
      <div id="ai-typing-avatar">✦</div>
      <div id="ai-typing-bubble">
        <span></span><span></span><span></span>
      </div>
    `;
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  }

  function typeEffect(bubble, text) {
    bubble.innerText = "";
    let i = 0;
    const interval = setInterval(() => {
      bubble.innerText += text[i];
      i++;
      messages.scrollTop = messages.scrollHeight;
      if (i >= text.length) clearInterval(interval);
    }, 18);
  }

  /* ---------- Send ---------- */
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text && !pendingImage) return;

    const imageToSend = pendingImage;
    pendingImage = null;
    chatInput.value = "";
    chatInput.placeholder = "Type your message...";
    sendBtn.disabled = true;

    const userMsg = text || "Here is my payment screenshot";
    addMessage(userMsg, "user");

    // Add to history
    conversationHistory.push({ role: "user", content: userMsg });

    const typing = showTyping();

    try {
      const body = {
        message: userMsg,
        conversation_history: conversationHistory.slice(-20), // last 20 messages
      };
      if (imageToSend) body.image = imageToSend;

      const res = await fetch(`https://autobot-backend-wowh.onrender.com/chat/${agentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      typing.remove();

      if (res.status === 403) {
        addMessage("⚠️ This agent is currently inactive.", "bot");
        return;
      }

      if (!res.ok) {
        addMessage("⚠️ Sorry, could not connect. Please try again.", "bot");
        return;
      }

      const data = await res.json();
      const reply = data.reply || "Sorry, no response.";
      const botBubble = addMessage("", "bot");
      typeEffect(botBubble, reply);

      // Add bot reply to history
      conversationHistory.push({ role: "assistant", content: reply });

    } catch (e) {
      typing.remove();
      addMessage("⚠️ Connection error. Please try again.", "bot");
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  sendBtn.onclick = sendMessage;
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
