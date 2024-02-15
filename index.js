const chatInput = document.querySelector('.chat-input textarea');
const sendChatButton = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseButton = document.querySelector('.close-btn');

let userMessage;
const OPENAI_API_KEY = "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";
const inputHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li')
    chatLi.classList.add('chat' , className);
    let chatContent = className === 'outgoing' ? `<p>${message}</p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>` 
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent= message;
    return chatLi
}

const generateResponse = (incomingChatLi) => {
    const URL = 'https://api.openai.com/v1/chat/completions'
    const messageElement = incomingChatLi.querySelector('p')

    const requestOptions = {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${OPENAI_API_KEY}`
        },
        body : JSON.stringify({
            "model": "gpt-3.5-turbo",
            "role": "user",
            "content": userMessage
        })
    }

    fetch(URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content
    }).catch((err)=>{
        messageElement.textContent = "Something went wrong"
    }).finally(()=>  chatbox.scroll(0, chatbox.scrollHeight))
}

const handleChat = () => {
    userMessage = chatInput.value.trim()
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputHeight}px`

    chatbox.appendChild(createChatLi(userMessage , "outgoing"));
    chatbox.scroll(0, chatbox.scrollHeight)

    setTimeout(()=>{
        const incomingChatLi =createChatLi("Thinking..." , "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scroll(0, chatbox.scrollHeight)
        generateResponse(incomingChatLi);
    }, 600)
    
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}`
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" &&!e.shiftKey&& window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"))
chatbotCloseButton.addEventListener("click", () => document.body.classList.remove("show-chatbot"))
sendChatButton.addEventListener("click", handleChat)