document.getElementById("extractBtn").addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(
        tab.id,
        { action: "extractChat" },
        (response) => {

            // check connection errors
            if (chrome.runtime.lastError) {
                console.error(
                    "Runtime Error:",
                    chrome.runtime.lastError.message
                );
                return;
            }

            // check if response exists
            if (!response) {
                console.error("No response received");
                return;
            }

            
            const formatted = response.chat
                .map(msg =>
                    `${msg.role.toUpperCase()}: ${msg.text}`
                )
                .join("\n\n");

            console.log(formatted);
            chrome.tabs.create({url: "https://gemini.google.com"});






        }
    );

});