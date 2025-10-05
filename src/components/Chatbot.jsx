import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";
import floatingIcon from "./assets/chatbot-icon.png";
import headerLogo from "./assets/mylogo.png";
import userIcon from "./assets/user-avatar.jpeg";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I assist you today? 😊" },
  ]);
  const [input, setInput] = useState("");
  const chatbotRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message! We'll reply soon." },
      ]);
    }, 1000);
  };

  // Close chatbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className="chatbot-container"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={floatingIcon}
          alt="Chatbot Icon"
          className={`bot-icon ${hovered && !isOpen ? "shake" : ""}`}
        />
        {hovered && !isOpen && (
          <div className="chatbot-tooltip">Hi! How can I help you?</div>
        )}
      </div>

      {isOpen && (
        <div className="chatbot-window" ref={chatbotRef}>
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-header-title">
                <div className="chatbot-logo-wrapper">
                  <img
                    src={headerLogo}
                    alt="H.E.A.R. Logo"
                    className="chatbot-logo"
                  />
                </div>
                <div className="assistant-text">
                  <div className="assistant-name-small">Aiva</div>
                  <div className="assistant-subtitle-small">
                    Your Hearing Assistant
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-row ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.sender === "bot" && (
                  <>
                    <img src={headerLogo} alt="Bot" className="avatar" />
                    <div className="message bot">{msg.text}</div>
                  </>
                )}
                {msg.sender === "user" && (
                  <>
                    <div className="message user">{msg.text}</div>
                    <img
                      src={userIcon}
                      alt="User"
                      className="avatar user-avatar"
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
