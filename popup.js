document.getElementById("extractBtn")
.addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(
        tab.id,
        { action: "extractChat" },
        async (response) => {

            if (chrome.runtime.lastError) {
                console.error(
                    "Runtime Error:",
                    chrome.runtime.lastError.message
                );
                return;
            }

            if (!response) {
                console.error("No response received");
                return;
            }

            // format conversation
            const formatted = response.chat
                .map(msg =>
                    `${msg.role.toUpperCase()}: ${msg.text}`
                )
                .join("\n\n");

            console.log(formatted);

            // save into chrome storage
            chrome.storage.local.set({
                handoffContext: formatted
            });

            // open Gemini
            chrome.tabs.create({
                url: "https://gemini.google.com"
            });

        }
    );

});