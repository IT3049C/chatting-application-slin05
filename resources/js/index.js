const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

function formatMessage(message, myNameInput) {
    const time = new Date(message.timestamp);
    const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

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

function fetchMessages() {
    return [
        {
            id: 1,
            text: "This is my message",
            sender: "Yahya Gilany",
            timestamp: 1537410673072
        },
        {
            id: 2,
            text: "This is another message",
            sender: "Yahya Gilany",
            timestamp: 1537410673072
        },
        {
            id: 3,
            text: "This is a message from someone else",
            sender: "Someone Else",
            timestamp: 1537410673072
        }
    ];
}

function updateMessages() {
    const messages = fetchMessages();
    let formattedMessages = "";
    messages.forEach(message => {
        formattedMessages += formatMessage(message, nameInput.value);
    });
    chatBox.innerHTML = formattedMessages;
}

function sendMessages(sender, text) {
    const newMessage = {
        id: Date.now(),  
        text: text,
        sender: sender,
        timestamp: Date.now()
    };
    
    chatBox.innerHTML += formatMessage(newMessage, sender);
}

sendButton.addEventListener("click", function(event) {
    event.preventDefault();
    const sender = nameInput.value;
    const message = myMessage.value;
    sendMessages(sender, message);
    myMessage.value = "";
});

updateMessages();