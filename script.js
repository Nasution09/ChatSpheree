const chatBox = document.getElementById("chat-box");
    const sendButton = document.getElementById("send");
    const messageInput = document.getElementById("message");
    const usernameInput = document.getElementById("username");
    const themeToggle = document.getElementById("theme-toggle");
    const onlineCount = document.getElementById("online-count");

    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }

    // === ONLINE COUNT SYSTEM ===
    const activeUsers = JSON.parse(localStorage.getItem("activeUsers")) || {};
    activeUsers[userId] = Date.now();
    localStorage.setItem("activeUsers", JSON.stringify(activeUsers));

    function updateOnlineCount() {
      const users = JSON.parse(localStorage.getItem("activeUsers")) || {};
      const now = Date.now();
      for (let id in users) {
        if (now - users[id] > 10000) delete users[id]; // 10 detik tidak aktif = offline
      }
      users[userId] = Date.now();
      localStorage.setItem("activeUsers", JSON.stringify(users));
      onlineCount.textContent = "User online: " + Object.keys(users).length;
    }
    setInterval(updateOnlineCount, 3000);
    window.addEventListener("storage", updateOnlineCount);

    // === CHAT SYSTEM ===
    function updateChat() {
      chatBox.innerHTML = "";
      messages.forEach((msg, index) => {
        const div = document.createElement("div");
        div.classList.add("message");
        if (msg.userId === userId) div.classList.add("self");

        div.innerHTML = `
          <strong>${msg.username}</strong>
          ${msg.text}
          <div class="meta">${msg.time}</div>
          ${msg.userId === userId ? `<button class="delete-btn" onclick="deleteMessage(${index})">Hapus</button>` : ""}
        `;
        chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addMessage(username, text) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = { username, text, time, userId };
      messages.push(newMsg);
      localStorage.setItem("messages", JSON.stringify(messages));
      updateChat();
    }

    function deleteMessage(index) {
      if (messages[index].userId === userId) {
        messages.splice(index, 1);
        localStorage.setItem("messages", JSON.stringify(messages));
        updateChat();
      }
    }

    sendButton.addEventListener("click", () => {
      const username = usernameInput.value.trim();
      const message = messageInput.value.trim();
      if (username && message) {
        addMessage(username, message);
        messageInput.value = "";
      }
    });

    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendButton.click();
    });

    // === THEME SWITCH ===
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });

    // === INIT ===
    window.addEventListener("storage", (e) => {
      if (e.key === "messages") {
        messages = JSON.parse(localStorage.getItem("messages")) || [];
        updateChat();
      }
    });

    updateChat();
    updateOnlineCount();