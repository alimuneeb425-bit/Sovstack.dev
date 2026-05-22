// app.js - Full Cryptographic Frontend & 9-Agent Telemetry Dashboard
const promptInput = document.getElementById("prompt-input");
const byokKeyInput = document.getElementById("byok-key-input");
const compileBtn = document.getElementById("compile-btn");
const terminalScreen = document.getElementById("terminal-screen");
const telemetryPercentage = document.getElementById("telemetry-percentage");

// Track selected platform (Default to android)
let selectedPlatform = "android"; 

// UI Selection Logic for Platforms
function setupPlatformSelectors() {
    const androidBtn = document.getElementById("platform-android");
    const iosBtn = document.getElementById("platform-ios");
    const bothBtn = document.getElementById("platform-both");

    if (!androidBtn || !iosBtn || !bothBtn) return;

    const clearActive = () => {
        androidBtn.classList.remove("active-platform");
        iosBtn.classList.remove("active-platform");
        bothBtn.classList.remove("active-platform");
    };

    androidBtn.addEventListener("click", () => {
        clearActive();
        androidBtn.classList.add("active-platform");
        selectedPlatform = "android";
        updateLiveTerminal("SYSTEM", "Target compilation profile altered: Native Android Build (APK).");
    });

    iosBtn.addEventListener("click", () => {
        clearActive();
        iosBtn.classList.add("active-platform");
        selectedPlatform = "ios";
        updateLiveTerminal("SYSTEM", "Target compilation profile altered: Native iOS Build (IPA).");
    });

    bothBtn.addEventListener("click", () => {
        clearActive();
        bothBtn.classList.add("active-platform");
        selectedPlatform = "both";
        updateLiveTerminal("SYSTEM", "Target compilation profile altered: Dual Cross-Platform Build.");
    });
}

const CLOUD_URL = "https://YOUR-GOOGLE-CLOUD-RUN-URL.run.app/compile";

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

// Client-Side Cryptographic Shielding (AES-GCM 256-bit)
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
        if(telemetryPercentage) telemetryPercentage.innerText = "10%";
        updateLiveTerminal("SYSTEM", "Initializing AES-GCM client-side encryption shield...");
        updateNodeVisual("1", "ACTIVE");
        
        // Wrap blueprint data with explicitly chosen target platform metadata
        const targetedPayload = JSON.stringify({
            platform: selectedPlatform,
            blueprint: blueprint
        });

        const { ciphertext, iv } = await encryptData(targetedPayload, key);
        updateNodeVisual("1", "SUCCESS");
        if(telemetryPercentage) telemetryPercentage.innerText = "25Hz";
        updateLiveTerminal("AGENT_1", "Handshake encrypted. Launching secure transmission stream...");

        const response = await fetch(CLOUD_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ciphertext, iv })
        });

        if (!response.ok) throw new Error("Cloud Enclave connection rejected.");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialData = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            partialData += decoder.decode(value, { stream: true });
            const lines = partialData.split("\n\n");
            partialData = lines.pop();

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const statusMsg = line.replace("data: ", "").trim();
                    handleLiveTelemetryUpdate(statusMsg);
                }
            }
        }

        if(telemetryPercentage) telemetryPercentage.innerText = "100%";
        updateLiveTerminal("SYSTEM", "Downloading verified outputs from multi-platform pipeline...");
        
        // Dynamically request files based on what profile was processed
        if (selectedPlatform === "android" || selectedPlatform === "both") {
            triggerSecureDownload(CLOUD_URL + "/download/apk", "production_native.apk");
        }
        if (selectedPlatform === "ios" || selectedPlatform === "both") {
            triggerSecureDownload(CLOUD_URL + "/download/ipa", "production_native.ipa");
        }
        triggerSecureDownload(CLOUD_URL + "/download/zip", "source_code_bundle.zip");

    } catch (error) {
        updateLiveTerminal("SECURITY_ERROR", "Pipeline compromised or network dropped: " + error.message);
        updateNodeVisual("7", "FAILED");
    } finally {
        if (compileBtn) compileBtn.disabled = false;
    }
}

function handleLiveTelemetryUpdate(msg) {
    if (msg.includes("AGENT_2")) { if(telemetryPercentage) telemetryPercentage.innerText = "35Hz"; updateNodeVisual("2", "ACTIVE"); updateLiveTerminal("AGENT_2_RAG", "Querying Hugging Face vector datasets for target OS parameters..."); }
    else if (msg.includes("AGENT_3")) { updateNodeVisual("2", "SUCCESS"); updateNodeVisual("3", "ACTIVE"); updateLiveTerminal("AGENT_3_RAG", "Retrieving context-aware layout blueprints..."); }
    else if (msg.includes("AGENT_4")) { if(telemetryPercentage) telemetryPercentage.innerText = "55Hz"; updateNodeVisual("3", "SUCCESS"); updateNodeVisual("4", "ACTIVE"); updateLiveTerminal("AGENT_4_RAG", "Executing core state-management structures..."); }
    else if (msg.includes("AGENT_5")) { updateNodeVisual("4", "SUCCESS"); updateNodeVisual("5", "ACTIVE"); updateLiveTerminal("AGENT_5_RAG", "Scanning syntax trees against vulnerability patterns..."); }
    else if (msg.includes("AGENT_6")) { if(telemetryPercentage) telemetryPercentage.innerText = "75Hz"; updateNodeVisual("5", "SUCCESS"); updateNodeVisual("6", "ACTIVE"); updateLiveTerminal("AGENT_6_RAG", "Running optimization builder configuration..."); }
    else if (msg.includes("AGENT_7")) { updateNodeVisual("6", "SUCCESS"); updateNodeVisual("7", "ACTIVE"); updateLiveTerminal("AGENT_7_RAG", "Invoking system cross-compilers inside volatile enclave RAM..."); }
    else if (msg.includes("AGENT_8")) { if(telemetryPercentage) telemetryPercentage.innerText = "90Hz"; updateLiveTerminal("AGENT_8_RAG", "Signing native production binaries & packing structural code package ZIP..."); }
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
    setTimeout(() => { a.remove(); }, 1000);
}

// Initialize components
document.addEventListener("DOMContentLoaded", setupPlatformSelectors);

if (compileBtn) {
    compileBtn.addEventListener('click', () => {
        const blueprintData = promptInput ? promptInput.value.trim() : "";
        const cryptographicKey = byokKeyInput ? byokKeyInput.value.trim() : "";
        if (!blueprintData || !cryptographicKey) return alert("Fill out both input forms to initialize the secure tunnel.");
        
        compileBtn.disabled = true;
        runSecureExecutionPipeline(blueprintData, cryptographicKey);
    });
}
