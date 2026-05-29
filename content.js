console.log("CONTENT SCRIPT LOADED");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // CLAUDE EXTRACTION
    if (request.action === "extractChat") {

        const chat = [];

        // USER messages
        const userMessages = [
            ...document.querySelectorAll(
                ".whitespace-pre-wrap.break-words"
            )
        ];

        // CLAUDE messages
        const aiMessages = [
            ...document.querySelectorAll(
                ".font-claude-response-body"
            )
        ];

        const maxLength = Math.max(
            userMessages.length,
            aiMessages.length
        );

        for (let i = 0; i < maxLength; i++) {

            if (userMessages[i]) {
                chat.push({
                    role: "user",
                    text: userMessages[i].innerText
                });
            }

            if (aiMessages[i]) {
                chat.push({
                    role: "assistant",
                    text: aiMessages[i].innerText
                });
            }
        }

        sendResponse({
            chat: chat
        });
    }

});


// GEMINI PAGE LOGIC
if (window.location.hostname.includes("gemini.google.com")) {

    chrome.storage.local.get(
        ["handoffContext"],
        (data) => {

            const context = data.handoffContext;

            if (!context) return;

            const waitForEditor = setInterval(() => {

                const editor = document.querySelector(
                    '[contenteditable="true"]'
                );

                if (!editor) return;

                clearInterval(waitForEditor);

                editor.innerText =`Continue this conversation from the transferred context:${context}`;

                editor.dispatchEvent(
                    new InputEvent("input", {
                        bubbles: true
                    })
                );

                editor.focus();

                console.log("Context pasted successfully");

            }, 500);

        }
    );

}