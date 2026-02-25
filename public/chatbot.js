(function () {
  const agentId = document.currentScript.getAttribute("data-agent-id");
  if (!agentId) {
    console.error("❌ Agent ID missing");
    return;
  }

  /* ---------- Styles ---------- */
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes chat-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes chat-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
    50% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
  }

  @keyframes chat-fade-in {
    from { opacity: 0; transform: scale(0.5) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  #ai-chat-icon {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    box-shadow: 0 10px 25px rgba(0,0,0,.3);
    z-index: 999999;
    animation: chat-fade-in 0.5s ease-out, chat-bounce 2s ease-in-out 1s infinite, chat-pulse 2s ease-in-out 1s infinite;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  #ai-chat-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(59,130,246,0.4);
    animation: none;
  }

  #ai-chat-box {
    position: fixed;
    bottom: 90px;
    right: 24px;
    width: 360px;
    height: 520px;
    background: #0a0a0f;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0,0,0,.5);
    border: 1px solid rgba(255,255,255,0.08);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
  }

  #ai-chat-header {
    padding: 14px;
    background: rgba(255,255,255,0.05);
    color: white;
    font-weight: bold;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  #ai-chat-messages {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    font-size: 14px;
    background: #0a0a0f;
  }

  .msg {
    margin-bottom: 10px;
    max-width: 85%;
    line-height: 1.7;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .user {
    background: linear-gradient(to right, #3b82f6, #7c3aed);
    color: white;
    padding: 8px 12px;
    border-radius: 12px;
    margin-left: auto;
  }

  .bot {
    background: rgba(255,255,255,0.05);
    color: #d4d4d8;
    padding: 8px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  #ai-chat-input {
    display: flex;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.03);
  }

  #ai-chat-input input {
    flex: 1;
    padding: 12px;
    border: none;
    outline: none;
    background: transparent;
    color: white;
  }

  #ai-chat-input input::placeholder {
    color: #71717a;
  }

  #ai-chat-input button {
    padding: 12px 16px;
    background: #1e3a5f;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }

  #ai-chat-input button:hover {
    background: #1e40af;
  }
  `;
  document.head.appendChild(style);

  /* ---------- HTML ---------- */
  const icon = document.createElement("div");
  icon.id = "ai-chat-icon";
  icon.innerHTML = "💬";

  const box = document.createElement("div");
  box.id = "ai-chat-box";
  box.innerHTML = `
    <div id="ai-chat-header">AI Assistant</div>
    <div id="ai-chat-messages"></div>
    <div id="ai-chat-input">
      <input placeholder="Type a message..." />
      <button>Send</button>
    </div>
  `;

  document.body.appendChild(icon);
  document.body.appendChild(box);

  /* ---------- Toggle ---------- */
  icon.onclick = () => {
    box.style.display = box.style.display === "flex" ? "none" : "flex";
  };

  /* ---------- Chat Logic ---------- */
  const input = box.querySelector("input");
  const btn = box.querySelector("button");
  const messages = box.querySelector("#ai-chat-messages");

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function typeEffect(element, text) {
    element.innerText = "";
    let i = 0;
    const interval = setInterval(() => {
      element.innerText += text[i];
      i++;
      if (i >= text.length) clearInterval(interval);
      messages.scrollTop = messages.scrollHeight;
    }, 25);
  }

  btn.onclick = async () => {
    if (!input.value) return;

    const userText = input.value;
    input.value = "";

    addMessage(userText, "user");
    const botMsg = addMessage("...", "bot");

    const res = await fetch(`http://localhost:8000/chat/${agentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userText,
      }),
    });

    const data = await res.json();
    typeEffect(botMsg, data.reply || "No response");
  };
})();


















// (function () {
// const agentId = document.currentScript.getAttribute("data-agent-id");
// if (!agentId) return;


// const iframe = document.createElement("iframe");
// iframe.src = `http://localhost:3000/chatbot/${agentId}`;
// iframe.style.position = "fixed";
// iframe.style.bottom = "20px";
// iframe.style.right = "20px";
// iframe.style.width = "360px";
// iframe.style.height = "520px";
// iframe.style.border = "none";
// iframe.style.zIndex = "9999";
// iframe.style.borderRadius = "16px";
// iframe.style.boxShadow = "0 10px 40px rgba(0,0,0,0.2)";


// document.body.appendChild(iframe);
// })();

