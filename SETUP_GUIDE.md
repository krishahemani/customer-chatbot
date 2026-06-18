# 🤖 Aria — AI Customer Support Chatbot
## Complete VS Code Setup Guide

---

## 📁 Final Project Structure

```
customer-chatbot/
├── backend/
│   ├── app.py              ← Flask server (your backend)
│   ├── requirements.txt    ← Python packages to install
│   ├── .env                ← YOUR SECRET API KEY (never share this)
│   └── .env.example        ← Template showing what .env should look like
├── frontend/
│   ├── index.html          ← The chat UI
│   ├── style.css           ← All styling
│   └── script.js           ← Chat logic + API calls
└── .gitignore              ← Prevents secrets from going to GitHub
```

---

## ✅ BEFORE YOU START — What to Install

### INSTALL THESE (Required)

| Tool | Why | Download |
|------|-----|----------|
| **Python 3.10+** | Runs your backend server | python.org/downloads |
| **VS Code** | Your code editor | code.visualstudio.com |
| **Live Server** (VS Code Extension) | Opens frontend without file:// issues | VS Code Extensions panel |

### VS Code Extensions to Install
Open VS Code → press `Ctrl+Shift+X` → search and install:

1. **Live Server** by Ritwick Dey → lets you open HTML in browser with one click
2. **Python** by Microsoft → syntax highlighting + run Python in VS Code
3. **Python Debugger** by Microsoft → helps you debug backend errors
4. **DotENV** by mikestead → highlights your .env file (optional, nice to have)

### DO NOT INSTALL (Not needed)
- ❌ Node.js / npm — not needed (this is Python, not Node)
- ❌ Django — we use Flask, it's simpler
- ❌ Any database — not needed for this project
- ❌ Docker — not needed at this stage

---

## 🔑 STEP 1 — Get a FREE API Key

You need one AI API key to power the chatbot. Pick ONE of these:

---

### 🥇 Option 1: Anthropic (Claude) — RECOMMENDED
**Free tier:** ~$5 credit on sign-up, no card required initially
**Best for:** Most intelligent responses, best customer support quality

1. Go to → **https://console.anthropic.com**
2. Click **"Sign Up"** → create account
3. Go to **"API Keys"** → click **"Create Key"**
4. Copy the key (starts with `sk-ant-...`)
5. Paste it in your `.env` file as: `ANTHROPIC_API_KEY=sk-ant-your-key-here`

Model used in code: `claude-3-haiku-20240307` (fastest + cheapest Claude model)

---

### 🥈 Option 2: OpenAI (GPT-3.5)
**Free tier:** $5 credit on sign-up
**Best for:** Widely documented, lots of tutorials online

1. Go to → **https://platform.openai.com**
2. Sign up → go to **"API Keys"** → create key
3. Copy key (starts with `sk-...`)
4. In `.env`: `OPENAI_API_KEY=sk-your-key-here`
5. In `app.py`: uncomment the OpenAI block, comment out the Anthropic block

---

### 🥉 Option 3: Cohere
**Free tier:** 1,000 API calls/month FOREVER — no credit card needed
**Best for:** Truly free long-term testing

1. Go to → **https://dashboard.cohere.com**
2. Sign up → go to **"API Keys"** section
3. Copy your key
4. In `.env`: `COHERE_API_KEY=your-key-here`
5. In `app.py`: uncomment the Cohere block
6. Also install: `pip install cohere`

---

### Option 4: Hugging Face (Mistral 7B)
**Free tier:** Free for non-commercial use
**Best for:** Running open-source models without paying

1. Go to → **https://huggingface.co/settings/tokens**
2. Sign up → click **"New Token"** → select **"Read"** role
3.`.env`: `HUGGINGFACE_API_KEY=hf_your_actual_token_here`
4. In `app.py`: uncomment the Hugging Face block
5. No extra pip install needed

---

## 🛠️ STEP 2 — Open the Project in VS Code

1. Open VS Code
2. Click **File → Open Folder**
3. Navigate to and select the `customer-chatbot` folder
4. You should see the full folder structure in the left panel

---

## 🐍 STEP 3 — Set Up Python Virtual Environment

A virtual environment keeps your project's packages separate from the rest of your computer.
Open the **VS Code Terminal**: press `` Ctrl+` `` (backtick)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (a folder called "venv")
python -m venv venv
```

Now **activate** the virtual environment:

```bash
# On Mac / Linux:
source venv/bin/activate

# On Windows (Command Prompt):
venv\Scripts\activate

# On Windows (PowerShell):
venv\Scripts\Activate.ps1
```

✅ You'll know it worked when you see `(venv)` at the start of your terminal line.

**To deactivate later** (when you're done working):
```bash
deactivate
```

---

## 📦 STEP 4 — Install Python Packages

Make sure you're inside the `backend/` folder and `(venv)` is active, then run:

```bash
pip install -r requirements.txt
```

This installs:
- `flask` — the web server framework
- `flask-cors` — allows your frontend to talk to backend
- `python-dotenv` — reads your .env file
- `anthropic` — the Claude AI SDK
- `requests` — for making HTTP calls

**If you chose a different AI provider**, also install:
```bash
# For OpenAI:
pip install openai

# For Cohere:
pip install cohere
```

### Verify everything installed:
```bash
pip list
```
You should see flask, anthropic, flask-cors, python-dotenv in the list.

---

## 🔐 STEP 5 — Create Your .env File

This is where your secret API key lives.

1. Inside the `backend/` folder, create a new file called `.env` (just `.env`, no other name)
2. Open it and add your key:

```
# backend/.env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-goes-here
```

> ⚠️ IMPORTANT RULES:
> - Never rename this to `env.txt` or anything else — it must be exactly `.env`
> - Never paste your key in `app.py` or `script.js`
> - Never upload `.env` to GitHub (the `.gitignore` file already prevents this)
> - The `.env.example` file is just a template — it's safe to share

---

## ▶️ STEP 6 — Run the Backend Server

Open a terminal in VS Code (`` Ctrl+` ``), make sure you're in the `backend/` folder with `(venv)` active:

```bash
python app.py
```

You should see:
```
🤖  Aria Customer Support Bot — Backend Starting...
    Server running at: http://127.0.0.1:5000
    Press CTRL+C to stop.
```

### Test it's working:
Open your browser and visit: **http://127.0.0.1:5000**

You should see:
```json
{
  "status": "running",
  "message": "AI Customer Support Chatbot API is online."
}
```

---

## 🌐 STEP 7 — Open the Frontend

**Do NOT just double-click index.html** — it won't be able to talk to the backend due to browser security.

Instead, use the **Live Server** VS Code extension:

1. In VS Code, right-click `frontend/index.html`
2. Click **"Open with Live Server"**
3. Browser opens automatically at `http://127.0.0.1:5500/frontend/index.html`

The chatbot is now live! Type a message and you'll get a real AI response.

---

## 🔄 How the Two Parts Talk to Each Other

```
[Browser: frontend/index.html]
        ↓  User types a message
[script.js sends POST request to http://127.0.0.1:5000/chat]
        ↓
[backend/app.py receives the message]
        ↓  Adds your secret API key (from .env)
[Calls Anthropic / OpenAI / Cohere AI API]
        ↓  Gets AI response
[app.py sends response back to script.js]
        ↓
[script.js displays the message in the chat bubble]
```

Your API key is **never sent to the browser** — it stays safely on the backend.

---

## 🛑 Common Errors and Fixes

| Error | What it means | Fix |
|-------|--------------|-----|
| `ModuleNotFoundError: flask` | Packages not installed | Run `pip install -r requirements.txt` |
| `ANTHROPIC_API_KEY not found` | .env file missing | Create `backend/.env` with your key |
| `Cannot connect to server` | Backend not running | Run `python app.py` in backend folder |
| `(venv)` not showing | Virtual env not activated | Run `source venv/bin/activate` |
| `401 Unauthorized` | Wrong API key | Check your key in .env — no spaces around `=` |
| `429 Too Many Requests` | Rate limit hit | Wait a moment and try again |
| CORS error in browser | flask-cors not installed | `pip install flask-cors` |
| Port 5000 already in use | Another app using port | Change `port=5000` to `port=5001` in `app.py` and update `BACKEND_URL` in `script.js` |

---

## ✏️ How to Customize the Bot

### Change the bot's name
In `index.html`: Find "Aria" and replace with your brand name.
In `app.py`: Update the `SYSTEM_PROMPT` variable with your bot's new name.

### Change colors
In `style.css`, find the `:root` section at the top and update:
```css
:root {
  --brand: #1a1a2e;   /* Change to your brand color */
  --accent: #e8c547;  /* Change to your accent color */
}
```

### Add new quick-reply buttons
In `index.html`, copy any `<button class="nav-item">` block and change the text.

### Change the bot's personality
In `app.py`, edit the `SYSTEM_PROMPT` string — this controls everything about how the bot responds.

---

## 🚀 When You're Ready for Production (Optional Advanced Steps)

1. **Deploy backend** → Render.com (free tier), Railway.app, or Heroku
2. **Deploy frontend** → Netlify or Vercel (both free)
3. **Secure API keys** → Use the platform's environment variable settings (never .env in production)
4. **Add a database** → Store chat history with SQLite or PostgreSQL

---

## 📋 Quick Reference Commands

```bash
# Every time you start working:
cd backend
source venv/bin/activate    # Mac/Linux
# OR
venv\Scripts\activate       # Windows

# Run backend:
python app.py

# Install new package:
pip install package-name

# Save installed packages to requirements.txt:
pip freeze > requirements.txt

# Stop the server:
Ctrl+C
```

---

*Built with Flask · Anthropic Claude · Vanilla JS · No frameworks required*
