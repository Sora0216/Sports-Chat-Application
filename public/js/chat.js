const socket = io();
let currentRoom = 'baseball'; // Default room

const messageInput = document.getElementById('message-input');
const sendButtonAlt = document.getElementById('send-button-alt');

const joinRoom = (room) => {
  currentRoom = room;
  socket.emit('joinRoom', { username, room });
  highlightActiveRoom(room);
};

const sendMessage = () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chatMessage', { message, username, room: currentRoom });
    messageInput.value = '';
  }
};

const highlightActiveRoom = (room) => {
  document.querySelectorAll('.room-button').forEach(button => {
    button.classList.remove('active-room');
    if (button.getAttribute('data-room') === room) {
      button.classList.add('active-room');
    }
  });
};

sendButtonAlt.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

socket.on('message', (msg) => {
  const messages = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('flex', msg.username === username ? 'justify-end' : 'justify-start', 'mb-2');
  messageElement.innerHTML = `
    <div class="flex items-center">
      <div class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold mr-2">
        ${msg.username.charAt(0)}
      </div>
      <div class="bg-gray-200 rounded-xl p-2">
        <div class="text-sm font-semibold text-gray-900">${msg.username}</div>
        <div class="text-gray-800">${msg.message}</div>
      </div>
    </div>
  `;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('previousMessages', (messages) => {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = ''; // Clear existing messages
  messages.forEach((msg) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', msg.User.username === username ? 'justify-end' : 'justify-start', 'mb-2');
    messageElement.innerHTML = `
      <div class="flex items-center">
        <div class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold mr-2">
          ${msg.User.username.charAt(0)}
        </div>
        <div class="bg-gray-200 rounded-xl p-2">
          <div class="text-sm font-semibold text-gray-900">${msg.User.username}</div>
          <div class="text-gray-800">${msg.content}</div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(messageElement);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

document.querySelectorAll('.room-button').forEach(button => {
  button.addEventListener('click', () => {
    const room = button.getAttribute('data-room');
    joinRoom(room);
  });
});

// Join the default room on initial load
joinRoom(currentRoom);
highlightActiveRoom(currentRoom);
