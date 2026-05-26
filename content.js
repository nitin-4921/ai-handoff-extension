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

            console.log("TRANSFERRED CONTEXT:");
            console.log(data.handoffContext);

        }
    );

}