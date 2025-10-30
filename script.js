const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const usernameInput = document.getElementById("username");
const toggleMode = document.getElementById("toggleMode");
const onlineCount = document.getElementById("onlineCount");

// Mode gelap & terang
toggleMode.onclick = () => {
  document.body.classList.toggle("dark");
  toggleMode.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// Simulasi user online
function updateOnlineCount() {
  let random = Math.floor(Math.random() * 10) + 1;
  onlineCount.textContent = random;
}
updateOnlineCount();
setInterval(updateOnlineCount, 4000);

// Kirim pesan
sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  const name = usernameInput.value.trim();
  if (msg === "" || name === "") return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const message = document.createElement("div");
  message.classList.add("chat", "me");
  message.innerHTML = `<b>${name}:</b> ${msg}<span class="time">${time}</span>`;
  chatBox.appendChild(message);

  messageInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
};
