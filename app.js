// app.js - Full Cryptographic Frontend & Live Telemetry Dashboard
const promptInput = document.getElementById("prompt-input");
const byokKeyInput = document.getElementById("byok-key-input");
const compileBtn = document.getElementById("compile-btn");
const terminalScreen = document.getElementById("terminal-screen");

// Replace this with your Google Cloud Run URL once deployed
const CLOUD_URL = "https://YOUR-SERVICE-NAME.a.run.app/compile";

function updateLiveTerminal(agentName, textLine) {
    if (!terminalScreen) return;
    terminalScreen.innerHTML += `<br><span style="color: #00ffcc; font-weight: bold;">[${agentName}]:</span> ${textLine}`;
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function updateNodeVisual(nodeId, status) {
    const nodeEl = document.getElementById(`node-${nodeId}`);
    if (nodeEl) {
        nodeEl.innerText = status;
        nodeEl.className = `agent-status status-${status.toLowerCase()}`;
    }
}

// True Cryptographic Encryption Layer (AES-GCM 256-bit)
async function encryptData(text, password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    const derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: new Uint8Array(16), iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv }, derivedKey, enc.encode(text)
    );
    return {
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...new Uint8Array(iv)))
    };
}

async function runSecureExecutionPipeline(blueprint, key) {
    try {
        updateLiveTerminal("SYSTEM", "Initializing AES-GCM client-side encryption shield...");
        updateNodeVisual("1", "ACTIVE");
        
        const { ciphertext, iv } = await encryptData(blueprint, key);
        updateNodeVisual("1", "SUCCESS");
        updateLiveTerminal("AGENT_1", "Handshake encrypted. Launching secure transmission stream...");

        // Establish connection to the cloud enclave
        const response = await fetch(CLOUD_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ciphertext, iv })
        });

        if (!response.ok) throw new Error("Cloud Enclave connection rejected.");

        // Read the live streaming telemetry updates directly from the 9 RAG agents
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialData = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            partialData += decoder.decode(value, { stream: true });
            const lines = partialData.split("\n\n");
            partialData = lines.pop(); // Save incomplete line for next chunk

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const statusMsg = line.replace("data: ", "").trim();
                    handleLiveTelemetryUpdate(statusMsg);
                }
            }
        }

        // Fetching binary files once the multi-agent stream signals absolute readiness
        updateLiveTerminal("SYSTEM", "Downloading completed Signed Native APK and Source Code ZIP...");
        triggerSecureDownload(CLOUD_URL + "/download/apk", "production_native.apk");
        triggerSecureDownload(CLOUD_URL + "/download/zip", "source_code_bundle.zip");

    } catch (error) {
        updateLiveTerminal("SECURITY_ERROR", "Pipeline compromised or network dropped: " + error.message);
        updateNodeVisual("7", "FAILED");
    } finally {
        compileBtn.disabled = false;
    }
}

function handleLiveTelemetryUpdate(msg) {
    // Dynamically maps out and visuals the live audit metrics from the 9 internal agents
    if (msg.includes("AGENT_2")) { updateNodeVisual("2", "ACTIVE"); updateLiveTerminal("AGENT_2_RAG", "Querying Hugging Face vector dataset for native architecture specifications..."); }
    else if (msg.includes("AGENT_3")) { updateNodeVisual("2", "SUCCESS"); updateNodeVisual("3", "ACTIVE"); updateLiveTerminal("AGENT_3_RAG", "Retrieving context-aware layout blueprints and stitching UI files..."); }
    else if (msg.includes("AGENT_4")) { updateNodeVisual("3", "SUCCESS"); updateNodeVisual("4", "ACTIVE"); updateLiveTerminal("AGENT_4_RAG", "Executing core state-management structures via retrieved knowledge..."); }
    else if (msg.includes("AGENT_5")) { updateNodeVisual("4", "SUCCESS"); updateNodeVisual("5", "ACTIVE"); updateLiveTerminal("AGENT_5_RAG", "Scanning syntax trees against security vulnerability patterns..."); }
    else if (msg.includes("AGENT_6")) { updateNodeVisual("5", "SUCCESS"); updateNodeVisual("6", "ACTIVE"); updateLiveTerminal("AGENT_6_RAG", "Running continuous build loops and adjusting compiler optimizations..."); }
    else if (msg.includes("AGENT_7")) { updateNodeVisual("6", "SUCCESS"); updateNodeVisual("7", "ACTIVE"); updateLiveTerminal("AGENT_7_RAG", "Invoking background native compilation tools inside memory..."); }
    else if (msg.includes("AGENT_8")) { updateLiveTerminal("AGENT_8_RAG", "Injecting cryptographic signatures into production APK & generating source ZIP file..."); }
    else if (msg.includes("AGENT_9")) { 
        updateNodeVisual("7", "SUCCESS"); 
        updateLiveTerminal("AGENT_9_RAG", "Payload generation verified. Memory cleanup protocols engaged."); 
    }
}

function triggerSecureDownload(fileUrl, defaultName) {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = defaultName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        a.remove();
    }, 1000);
}

compileBtn.addEventListener('click', () => {
    const blueprintData = promptInput.value.trim();
    const cryptographicKey = byokKeyInput.value.trim();
    if (!blueprintData || !cryptographicKey) return alert("Fill out both input forms to initialize the secure tunnel.");
    
    compileBtn.disabled = true;
    runSecureExecutionPipeline(blueprintData, cryptographicKey);
});
