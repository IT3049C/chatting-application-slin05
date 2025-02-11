const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message-input");  // Updated ID
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

const serverURL = `https://it3049c-chat.fly.dev/messages`;

function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function formatMessage(message, myNameInput) {
    if (!message || !message.timestamp) {
        console.error('Invalid message format:', message);
        return '';
    }

    const time = new Date(message.timestamp);
    const formattedTime = formatTime(time);

    if (myNameInput === message.sender) {
        return `
            <div class="mine messages">
                <div class="message">
                    ${message.text}
                </div>
                <div class="sender-info">
                    ${formattedTime}
                </div>
            </div>
        `;
    } else {
        return `
            <div class="yours messages">
                <div class="message">
                    ${message.text}
                </div>
                <div class="sender-info">
                    ${message.sender} ${formattedTime}
                </div>
            </div>
        `;
    }
}

async function fetchMessages() {
    try {
        const response = await fetch(serverURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching messages:", error);
        return []; 
    }
}

async function updateMessages() {
    try {
        const messages = await fetchMessages();
        if (!Array.isArray(messages)) {
            console.error("Invalid messages format:", messages);
            return;
        }
        
        let formattedMessages = "";
        messages.forEach(message => {
            formattedMessages += formatMessage(message, nameInput.value);
        });
        chatBox.innerHTML = formattedMessages;
    } catch (error) {
        console.error("Error updating messages:", error);
    }
}

async function sendMessages(username, text) {
    if (!username || !text) {
        console.error("Username and message text are required");
        return;
    }

    try {
        const newMessage = {
            sender: username,
            text: text,
            timestamp: new Date().toISOString()  // Use ISO string format
        };

        const response = await fetch(serverURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await updateMessages();
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

sendButton.addEventListener("click", async function(event) {
    event.preventDefault();
    const sender = nameInput.value.trim();
    const message = myMessage.value.trim();
    
    if (sender && message) { 
        await sendMessages(sender, message);
        myMessage.value = ""; 
    }
});

updateMessages();

const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);