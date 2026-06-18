"""
AI Customer Support Chatbot - Backend (Flask)
=============================================
Run this file to start the backend server.
Make sure you have activated your virtual environment first.
"""
import socket
old_getaddrinfo = socket.getaddrinfo
def new_getaddrinfo(*args, **kwargs):
    return old_getaddrinfo(*args, **kwargs)
socket.getaddrinfo = new_getaddrinfo
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
# import anthropic   # Anthropic SDK (Free tier available)
# import openai    # Uncomment if using OpenAI instead
import requests  # Uncomment if using Hugging Face or Cohere REST API
import cohere    # Uncomment if using Cohere SDK (Free tier available)

# --------------------------------------------------
# 1. Load environment variables from .env file
# --------------------------------------------------
load_dotenv()

# --------------------------------------------------
# 2. Initialize Flask app
# --------------------------------------------------
app = Flask(__name__)

# Allow requests from your frontend (CORS = Cross-Origin Resource Sharing)
# In production, replace "*" with your actual frontend domain
CORS(app, origins=["*"])

# --------------------------------------------------
# 3. Load API key securely from .env
# --------------------------------------------------
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not ANTHROPIC_API_KEY:
    print("⚠️  WARNING: ANTHROPIC_API_KEY not found in .env file.")
    print("   Create a .env file in the backend/ folder with:")
    print("   ANTHROPIC_API_KEY=your_key_here")

# --------------------------------------------------
# 4. Initialize the AI client
# --------------------------------------------------
# client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# --------------------------------------------------
# 5. System prompt — defines your bot's personality
# --------------------------------------------------
SYSTEM_PROMPT = """You are Aria, a warm, professional, and empathetic AI customer support assistant.

Your responsibilities:
- Help customers with orders, refunds, account issues, shipping, product info, billing, and general queries
- Be concise but thorough — use short paragraphs and bullet points, never walls of text
- Use a friendly, professional tone — like a real support agent who genuinely cares
- When you don't know something specific, say so honestly and direct them to: support@example.com
- Acknowledge frustration before jumping to solutions when a user seems upset
- End responses with a brief follow-up question or next-step suggestion when appropriate

Key business information:
- Business hours: Monday–Friday, 9am–6pm EST
- Email response time: within 24 hours
- Refund policy: 30-day returns on physical products. Digital products are non-refundable.
- Shipping: Standard (5–7 days), Express (2–3 days), Overnight available
- Phone support: 1-800-EXAMPLE (business hours only)

Always be honest. Never make up tracking numbers, order IDs, or specific account details."""


# --------------------------------------------------
# 6. API Routes
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    """Health check — visit http://127.0.0.1:5000/ to confirm server is running."""
    return jsonify({
        "status": "running",
        "message": "AI Customer Support Chatbot API is online.",
        "endpoints": {
            "POST /chat": "Send a message and get a response",
            "POST /reset": "Reset conversation history"
        }
    })


@app.route("/chat", methods=["POST"])
def chat():
    """
    Main chat endpoint.

    Expects JSON body:
    {
        "message": "User's message here",
        "history": [                       <-- Optional conversation history
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": "..."}
        ]
    }

    Returns JSON:
    {
        "response": "Bot's reply here"
    }
    """

    # --- Parse incoming request ---
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    user_message = data.get("message", "").strip()
    history = data.get("history", [])  # Previous messages for context

    if not user_message:
        return jsonify({"error": "No message provided."}), 400

    # --- Build message list (include history for context) ---
    messages = history + [{"role": "user", "content": user_message}]

    try:
        co = cohere.ClientV2(os.getenv("COHERE_API_KEY"))
        response = co.chat(
            model="command-r7b-12-2024",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *[{"role": m["role"], "content": m["content"]} for m in history],
                {"role": "user", "content": user_message}
            ]
        )
        bot_reply = response.message.content[0].text
        return jsonify({"response": bot_reply})

    except Exception as e:
        print(f"[ERROR] {type(e).__name__}: {e}")
        return jsonify({"error": "Something went wrong. Please try again."}), 500

@app.route("/reset", methods=["POST"])
def reset():
    """Optional: can be called to signal a new session (history is managed client-side)."""
    return jsonify({"message": "Conversation reset successfully."})


# --------------------------------------------------
# 7. Run the server
# --------------------------------------------------
if __name__ == "__main__":
    print("\n🤖  Aria Customer Support Bot — Backend Starting...")
    print("    Server running at: http://127.0.0.1:5000")
    print("    Press CTRL+C to stop.\n")
    app.run(debug=True, port=5000)
