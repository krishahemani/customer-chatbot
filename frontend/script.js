// =============================================
// script.js — Aria Customer Support Chatbot
// Handles: messages, API calls, UI updates
// =============================================

// ---- CONFIG: Change this if your backend runs on a different port ----
const BACKEND_URL = "http://127.0.0.1:5000";

// ---- STATE ----
let conversationHistory = [];  // Stores full chat history for context
let botReplied = false;        // Tracks if bot has replied (to show rating bar)

// ---- DOM ELEMENTS ----
const messagesEl  = document.getElementById("messages");
const inputEl     = document.getElementById("user-input");
const sendBtn     = document.getElementById("send-btn");
const ratingBar   = document.getElementById("rating-bar");

// =============================================
// UTILITY: Get current time as HH:MM string
// =============================================
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// =============================================
// UTILITY: Auto-resize textarea as user types
// =============================================
inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
});

// =============================================
// UTILITY: Scroll chat to bottom
// =============================================
function scrollToBottom() {
  setTimeout(() => {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
  }, 50);
}

// =============================================
// ADD MESSAGE to the chat window
// role: "user" or "bot"
// text: message string
// showFeedback: show thumbs up/down on bot messages
// =============================================
function addMessage(role, text, showFeedback = false) {
  const row = document.createElement("div");
  row.className = "msg-row " + role;

  // Avatar
  const avatar = document.createElement("div");
  avatar.className = "msg-avatar " + role;
  avatar.textContent = role === "user" ? "U" : "A";

  // Group (bubble + timestamp + feedback)
  const group = document.createElement("div");
  group.className = "msg-group " + role;

  // Bubble
  const bubble = document.createElement("div");
  bubble.className = "bubble " + role;
  bubble.textContent = text;

  // Timestamp
  const time = document.createElement("div");
  time.className = "msg-time";
  time.textContent = getTime();

  group.appendChild(bubble);
  group.appendChild(time);

  // Thumbs up / down feedback (bot messages only)
  if (showFeedback && role === "bot") {
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.innerHTML = `
      <button class="fb-btn" title="Helpful" onclick="markFeedback(this, 'liked')">👍</button>
      <button class="fb-btn" title="Not helpful" onclick="markFeedback(this, 'disliked')">👎</button>
    `;
    group.appendChild(feedback);
  }

  row.appendChild(avatar);
  row.appendChild(group);
  messagesEl.appendChild(row);
  scrollToBottom();
}

// =============================================
// FEEDBACK: Mark a message as liked/disliked
// =============================================
function markFeedback(btn, type) {
  const container = btn.closest(".feedback");
  container.querySelectorAll(".fb-btn").forEach(b => {
    b.classList.remove("liked", "disliked");
  });
  btn.classList.add(type);
}

// =============================================
// TYPING INDICATOR: Show animated dots
// =============================================
function showTyping() {
  removeTyping();
  const row = document.createElement("div");
  row.className = "typing-row";
  row.id = "typing-row";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar bot";
  avatar.textContent = "A";

  const bubble = document.createElement("div");
  bubble.className = "typing-bubble";
  bubble.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;

  row.appendChild(avatar);
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  scrollToBottom();
}

function removeTyping() {
  const el = document.getElementById("typing-row");
  if (el) el.remove();
}

// =============================================
// RATING STARS: Handle star click
// =============================================
function rateStar(val) {
  document.querySelectorAll(".star").forEach(s => {
    s.classList.toggle("lit", parseInt(s.dataset.val) <= val);
  });
  const thanks = document.getElementById("rating-thanks");
  if (val >= 4) thanks.textContent = "Thank you! Glad I could help 🎉";
  else if (val >= 2) thanks.textContent = "Thanks for the feedback!";
  else thanks.textContent = "Sorry to hear that. We'll improve!";
}

// =============================================
// SEND MESSAGE: Main function
// =============================================
async function sendMessage(text) {
  if (!text || text.trim() === "") return;

  // Lock input while waiting
  sendBtn.disabled = true;
  inputEl.value = "";
  inputEl.style.height = "auto";

  // Show user's message
  addMessage("user", text);

  // Add to history (for context in next API call)
  conversationHistory.push({ role: "user", content: text });

  // Show typing animation
  showTyping();

  try {
    // -----------------------------------------------
    // SEND REQUEST TO FLASK BACKEND
    // The backend securely adds the API key and calls
    // the AI provider (Anthropic, OpenAI, etc.)
    // -----------------------------------------------
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: conversationHistory.slice(-10) // Send last 10 messages for context
      })
    });

    const data = await response.json();
    removeTyping();

    if (data.response) {
      // Show bot reply
      addMessage("bot", data.response, true);

      // Add to history
      conversationHistory.push({ role: "assistant", content: data.response });

      // Show rating bar after first bot reply
      if (!botReplied) {
        botReplied = true;
        ratingBar.style.display = "flex";
      }

    } else if (data.error) {
      addErrorMessage(data.error);
    }

  } catch (err) {
    removeTyping();
    // This triggers if the backend is not running
    addErrorMessage(
      "Cannot connect to the server. Make sure the backend is running:\n  cd backend\n  python app.py"
    );
    console.error("Fetch error:", err);
  }

  sendBtn.disabled = false;
  inputEl.focus();
}

// =============================================
// ERROR MESSAGE: Styled differently
// =============================================
function addErrorMessage(text) {
  const div = document.createElement("div");
  div.style.cssText = `
    background: #fdf3f3; color: #b91c1c; border: 1px solid #fca5a5;
    border-radius: 10px; padding: 10px 14px; font-size: 13px;
    white-space: pre-wrap; margin: 0 40px;
  `;
  div.textContent = "⚠️  " + text;
  messagesEl.appendChild(div);
  scrollToBottom();
}

// =============================================
// QUICK SEND: Triggered by sidebar buttons
// =============================================
function sendQuick(text) {
  inputEl.value = text;
  sendMessage(text);
}

// =============================================
// HANDLE SEND: Called by button click
// =============================================
function handleSend() {
  const text = inputEl.value.trim();
  sendMessage(text);
}

// =============================================
// KEYBOARD: Enter to send, Shift+Enter = newline
// =============================================
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

// =============================================
// CLEAR CHAT: Reset everything
// =============================================
function clearChat() {
  conversationHistory = [];
  botReplied = false;
  messagesEl.innerHTML = "";
  ratingBar.style.display = "none";
  document.querySelectorAll(".star").forEach(s => s.classList.remove("lit"));
  document.getElementById("rating-thanks").textContent = "";
  // Re-show greeting
  greetUser();
}

// =============================================
// GREETING: First message when page loads
// =============================================
function greetUser() {
  setTimeout(() => {
    addMessage(
      "bot",
      "👋 Hi there! I'm Aria, your AI support assistant.\n\nI can help you with:\n• Order tracking & shipping\n• Refunds & returns\n• Account & login issues\n• Billing & invoices\n• Product questions\n\nWhat can I help you with today?"
    );
  }, 400);
}

// ---- Start ----
greetUser();
