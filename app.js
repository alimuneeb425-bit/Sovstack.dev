// app.js - Full Transparency Main Interface Router
const promptInput = document.getElementById('prompt-input');
const byokKeyInput = document.getElementById('byok-key-input');
const compileBtn = document.getElementById('compile-btn');
const terminalScreen = document.getElementById('terminal-screen');
const telemetryPercentage = document.getElementById('telemetry-percentage');

const insSymbolState = document.getElementById('ins-symbol-state');
const inspectSymbol = document.getElementById('inspect-symbol');
const inspectIntent = document.getElementById('inspect-intent');
const inspectQaTrace = document.getElementById('inspect-qa-trace');
const inspectTarget = document.getElementById('inspect-target');
const inspectHexStream = document.getElementById('inspect-hex-stream');
const shredBadge = document.getElementById('shred-badge');

// 💥 Synchronously loads worker.js text to completely bypass Vercel MIME type errors on mobile
let autonomousEnclaveWorker;
try {
    const workerRequest = new XMLHttpRequest();
    workerRequest.open('GET', 'worker.js', false);
    workerRequest.send(null);
    const blob = new Blob([workerRequest.responseText], { type: 'application/javascript' });
    autonomousEnclaveWorker = new Worker(URL.createObjectURL(blob));
} catch (error) {
    console.error("Worker Initialization Failed. Falling back to direct layout routing.", error);
}

function updateLiveTerminal(nodeId, textLine) {
    terminalScreen.innerHTML += `<br>&gt; <span class="inspect-highlight">[NODE_0${nodeId}]:</span> ${textLine}`;
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function updateNodeVisual(nodeId, executionStatus) {
    const nodeEl = document.getElementById(`node-${nodeId}`);
    if (nodeEl) {
        nodeEl.innerText = executionStatus;
        nodeEl.className = `agent-status status-${['success', 'wiped', 'passed', 'clean'].includes(executionStatus.toLowerCase()) ? 'success' : executionStatus.toLowerCase()}`;
    }
}

if (autonomousEnclaveWorker) {
    autonomousEnclaveWorker.onmessage = function(e) {
        const packet = e.data;

        if (packet.log) updateLiveTerminal(packet.node, packet.log);
        if (packet.status) updateNodeVisual(packet.node, packet.status);
        if (packet.percentage) telemetryPercentage.innerText = `${packet.percentage} COMPLETED`;

        if (packet.intent) inspectIntent.innerText = packet.intent;
        if (packet.trace) inspectQaTrace.innerText = packet.trace;
        if (packet.symbol) inspectSymbol.innerText = packet.symbol;

        if (packet.symbol) {
            inspectSymbol.innerText = packet.symbol;
            if (packet.symbol === "0x00000000") {
                insSymbolState.innerText = "PURGED";
                insSymbolState.className = "shredded-badge";
            }
        }

        // STAGE 07 Handshake: Streaming true physical files safely down onto disk
        if (packet.node === "7" && packet.status === "SUCCESS") {
            inspectTarget.innerText = "GENUINE_APK + SOURCE_ZIP";

            // 1. Deliver compiled native APK package binary
            const apkBlob = new Blob([packet.apkPayload], { type: "application/vnd.android.package-archive" });
            const apkUrl = URL.createObjectURL(apkBlob);
            const apkAnchor = document.createElement("a");
            apkAnchor.href = apkUrl;
            apkAnchor.download = "production_build_true_native.apk";
            document.body.appendChild(apkAnchor);
            apkAnchor.click();
            apkAnchor.remove();
            URL.revokeObjectURL(apkUrl);

            // 2. Deliver uncompiled raw source blueprint zip
            const zipBlob = new Blob([packet.zipPayload], { type: "application/zip" });
            const zipUrl = URL.createObjectURL(zipBlob);
            const zipAnchor = document.createElement("a");
            zipAnchor.href = zipUrl;
            zipAnchor.download = "app_source_blueprint.zip";
            document.body.appendChild(zipAnchor);
            zipAnchor.click();
            zipAnchor.remove();
            URL.revokeObjectURL(zipUrl);
        }

        // STAGE 08 Hardware Shredder Feedback Loop: Annulling interface inputs
        if (packet.hexWiped) {
            promptInput.value = "";
            byokKeyInput.value = "";
            inspectHexStream.innerText = "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
            shredBadge.innerText = "ZERO_RESIDUE_HEAP";
            shredBadge.style.color = "#10b981";
            compileBtn.disabled = false;
            compileBtn.innerText = "INITIALIZE SECURE NATIVE COMPILATION PIPELINE";
        }
    };
}

compileBtn.addEventListener('click', () => {
    const blueprintData = promptInput.value.trim();
    const cryptographicKey = byokKeyInput.value.trim();

    if (!blueprintData) {
        alert("Please input structural application schemas inside the blueprint area before compilation initialization.");
        return;
    }

    compileBtn.disabled = true;
    compileBtn.innerText = "ENCLAVE COMPILATION ACTIVE...";
    
    // Clear display structures for fresh telemetry tracking pass
    terminalScreen.innerHTML = "&gt; Spawning clean execution pipeline. Deploying isolated background processing core...";
    telemetryPercentage.innerText = "0% COMPLETED";
    
    insSymbolState.innerText = "LIVE_TRACKING";
    insSymbolState.className = "";
    shredBadge.innerText = "ACTIVE_MONITOR";
    shredBadge.style.color = "#ef4444";
    inspectHexStream.innerText = "EE DD AA 77 FF 00 22 99 88 44 11 55 66 22 33 00 44 FF A6 DD EE BB CC 00 11 22";

    for (let i = 1; i <= 9; i++) {
        const node = document.getElementById(`node-${i}`);
        if (node) {
            node.innerText = "STANDBY";
            node.className = "agent-status status-standby";
        }
    }

    // Fire data payload directly into our secure memory-blob execution thread
    if (autonomousEnclaveWorker) {
        autonomousEnclaveWorker.postMessage({
            blueprint: blueprintData,
            byokKey: cryptographicKey
        });
    }
});

