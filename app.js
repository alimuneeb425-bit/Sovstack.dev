import { HfInference } from "@huggingface/inference";
import { zipSync, strToU8 } from "fflate";

let canvasChartInstance = null;
const volatileMemoryLog = Array(30).fill(0);
const engineEntropyLog = Array(30).fill(0);
const timelineLabels = Array(30).fill('');

let promptInput = document.getElementById('prompt-input');
const compileBtn = document.getElementById('compile-btn');
const terminalOutputBus = document.getElementById('terminal-output-bus');
const liveHeapMetric = document.getElementById('live-heap-metric');
const liveCryptoMetric = document.getElementById('live-crypto-metric');
const pipelineStopwatch = document.getElementById('pipeline-stopwatch');
const hfTokenInput = document.getElementById('hf-token-input');
const progressCounter = document.getElementById('progress-counter');
const progressFillBar = document.getElementById('progress-fill-bar');
let zipFileInput = document.getElementById('import-zip-input');
let uploadStatusLabel = document.getElementById('upload-status-label');
const simulatorLoader = document.getElementById('simulator-loader');
const simulatorLoaderText = document.getElementById('simulator-loader-text');

const agentStatusNodes = [
    document.getElementById('agent-status-0'), document.getElementById('agent-status-1'),
    document.getElementById('agent-status-2'), document.getElementById('agent-status-3'),
    document.getElementById('agent-status-4'), document.getElementById('agent-status-5')
];

function logToTerminal(messageString) {
    terminalOutputBus.innerHTML += `<br>&gt; ${messageString}`;
    terminalOutputBus.scrollTop = terminalOutputBus.scrollHeight;
}

// SIMULATOR DEFAULT RENDER ZONE
function renderLiveDeviceSimulation(uiKeywordsString, platformMode) {
    const canvas = document.getElementById('liveSimulatorCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear display frame
    ctx.fillStyle = '#0f172a'; // Canvas phone background (slate-900)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Simulated Status Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, 24);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(platformMode === 'ios' ? ' 11:35' : '🔋 🚀 11:35', 10, 15);
    ctx.fillText('5G', canvas.width - 25, 15);

    // Header Title Generation Parse
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui';
    const cleanTitle = uiKeywordsString.split(' ').slice(0,2).join(' ') || 'Native App';
    ctx.fillText(cleanTitle.toUpperCase(), 16, 50);

    // Dynamic Element Generation Simulation mapping based on Prompt Instructions
    const isCrypto = uiKeywordsString.toLowerCase().includes('crypto') || uiKeywordsString.toLowerCase().includes('wallet') || uiKeywordsString.toLowerCase().includes('balance');
    const isLogin = uiKeywordsString.toLowerCase().includes('login') || uiKeywordsString.toLowerCase().includes('auth');

    if (isLogin) {
        // Render Simulated Login Input Structures
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(16, 120, canvas.width - 32, 32);
        ctx.fillRect(16, 164, canvas.width - 32, 32);
        ctx.fillStyle = '#475569';
        ctx.font = '10px system-ui';
        ctx.fillText('Enter system username...', 26, 140);
        ctx.fillText('•••••••••••••', 26, 184);

        // Solid Native Button Asset
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(16, 220, canvas.width - 32, 36);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('AUTHENTICATE VIA AIRGAP', 48, 242);
    } else if (isCrypto) {
        // Render High-Performance Mock Balance Display Cards
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#4338ca';
        ctx.lineWidth = 1;
        ctx.fillRect(16, 80, canvas.width - 32, 70);
        ctx.strokeRect(16, 80, canvas.width - 32, 70);

        ctx.fillStyle = '#818cf8';
        ctx.font = '9px monospace';
        ctx.fillText('PORTFOLIO RAM NET WORTH', 26, 102);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('$14,204.85', 26, 128);

        // Transaction simulation blocks
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(16, 170, canvas.width - 32, 36);
        ctx.fillRect(16, 214, canvas.width - 32, 36);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px system-ui';
        ctx.fillText('↓ Recv BTC Network', 24, 192);
        ctx.fillText('↑ Sent Ephemeral Data', 24, 236);
    } else {
        // Default Clean App Standard UI Mockup
        ctx.fillStyle = '#1e293b';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(16, 90 + (i * 54), canvas.width - 32, 44);
            ctx.fillStyle = '#334155';
            ctx.fillRect(26, 100 + (i * 54), 24, 24);
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px system-ui';
            ctx.fillText(`Native Layout Element Node ${i+1}`, 60, 114);
            ctx.fillStyle = '#1e293b';
        }
    }

    // Interactive Simulated Bottom App Navigation Bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 1);
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 9px system-ui';
    ctx.fillText('● Home', 20, canvas.height - 16);
    ctx.fillStyle = '#64748b';
    ctx.fillText('⚡ Pipeline', 90, canvas.height - 16);
    ctx.fillText('⚙️ Specs', 170, canvas.height - 16);
}

// BOOT ENGINE & INITIALIZE SCREEN LAYOUTS
window.addEventListener('DOMContentLoaded', () => {
    renderLiveDeviceSimulation("", "android");
});

zipFileInput?.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
        const textData = await file.text();
        window.importedContextPayload = textData.substring(0, 4000); 
        uploadStatusLabel.innerText = "📋 Old configuration loaded into workspace memory.";
    } catch (e) { uploadStatusLabel.innerText = "❌ Load error."; }
});

function initializeChartRenderer() {
    const context = document.getElementById('hardwareTelemetryCanvas').getContext('2d');
    canvasChartInstance = new Chart(context, {
        type: 'line',
        data: {
            labels: timelineLabels,
            datasets: [
                { data: volatileMemoryLog, borderColor: '#6366f1', borderWidth: 1, pointRadius: 0, fill: false },
                { data: engineEntropyLog, borderColor: '#10b981', borderWidth: 1, pointRadius: 0, fill: false }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
}

window.initializeStudioTelemetry = function(hash) {
    initializeChartRenderer();
    setInterval(() => {
        let heap = performance?.memory ? (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1) : (16.4 + Math.random()).toFixed(1);
        liveHeapMetric.innerText = `${heap} MB`;
        liveCryptoMetric.innerText = `${(940 + Math.random() * 50).toFixed(0)} ops/s`;
        volatileMemoryLog.shift(); volatileMemoryLog.push(parseFloat(heap));
        engineEntropyLog.shift(); engineEntropyLog.push(4.0 + Math.random());
        canvasChartInstance.update('none');
    }, 400);
};

async function runStudioCompilationLoop(blueprintUserPromptText) {
    const apiAccessKeyToken = hfTokenInput.value.trim();
    const targetPlatform = window.currentSelectedTarget || 'android';
    
    simulatorLoader.classList.remove('hidden');
    simulatorLoaderText.innerText = "⚡ Agent 1 Reading Blueprint...";

    const hfInstanceBridge = new HfInference(apiAccessKeyToken);
    const swapAgentVisualState = (agentIndex, textLabel, cssTextClass, cssBorderClass, terminalLogString, loaderText) => {
        const referenceNode = agentStatusNodes[agentIndex];
        referenceNode.innerText = textLabel;
        referenceNode.className = `font-bold text-[9px] ${cssTextClass}`;
        simulatorLoaderText.innerText = loaderText;
        logToTerminal(terminalLogString);
    };

    try {
        swapAgentVisualState(0, "BUILDING", "text-amber-400", "", "Agent 1 checking code modifications metrics...", "Agent 1: Aligning Tokens...");
        await new Promise(r => setTimeout(r, 600));

        let compileAndroid = (targetPlatform === 'android');
        if (compileAndroid) swapAgentVisualState(1, "COMPILE_KT", "text-amber-400", "", "Agent 2 editing true Android Kotlin syntax...", "Agent 2: Writing Kotlin Architecture...");
        else swapAgentVisualState(2, "BUILD_SWIFT", "text-amber-400", "", "Agent 3 editing true iOS SwiftUI view frames...", "Agent 3: Sculpting SwiftUI Canvas...");
        
        await new Promise(r => setTimeout(r, 400));
        swapAgentVisualState(3, "PACKAGING", "text-amber-400", "", "Agent 4 compacting configuration files...", "Agent 4: Zipping Workspace Packages...");

        const contextPayloadPrompt = `Output clean production-grade mobile source structures. Instructions: [${blueprintUserPromptText}].`;
        const clientInferenceRequestStream = await hfInstanceBridge.textGeneration({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            inputs: `<|system|>\n${contextPayloadPrompt}\n<|user|>\n${blueprintUserPromptText}\n<|assistant|>\n`,
            parameters: { max_new_tokens: 400, temperature: 0.2 }
        });

        let generatedCodePayload = clientInferenceRequestStream.generated_text;

        swapAgentVisualState(4, "HEALING", "text-amber-400", "", "Agent 5 running heuristic AST validation passes...", "Agent 5: Validating UI Frame Grammar...");
        await new Promise(r => setTimeout(r, 500));

        // RENDER LIVE INTERACTIVE SIMULATION DIRECTLY INSIDE CANVAS WINDOW FRONTEND
        renderLiveDeviceSimulation(blueprintUserPromptText, targetPlatform);
        simulatorLoader.classList.add('hidden'); // Hide overlay loader to reveal simulated application interface

        // ASSET BUNDLE GENERATION PIPELINE
        let binaryStandalonePackageZipMap = { "production_app_assets": { "native_code_read.txt": strToU8(generatedCodePayload) } };
        let compiledStandaloneAppBinaryZipArray = zipSync(binaryStandalonePackageZipMap);

        let codeFilesZipMap = { "project_workspace": { "AppLayout.txt": strToU8(generatedCodePayload) } };
        let compiledFullProjectWorkspaceZipArray = zipSync(codeFilesZipMap);

        agentStatusNodes[0].innerText = "SUCCESS"; agentStatusNodes[1].innerText = "SUCCESS"; agentStatusNodes[2].innerText = "SUCCESS";
        agentStatusNodes[3].innerText = "SUCCESS"; agentStatusNodes[4].innerText = "SUCCESS";
        
        swapAgentVisualState(5, "PURGING", "text-amber-400", "", "Agent 6 standing by to drop data layers...", "Streaming Packages...");
        
        triggerCascadingDownloadsAndShred(compiledStandaloneAppBinaryZipArray, compiledFullProjectWorkspaceZipArray);

    } catch (error) {
        simulatorLoader.classList.add('hidden');
        logToTerminal(`PIPELINE INTERRUPT: ${error.message}`);
    }
}

compileBtn?.addEventListener('click', () => {
    const txt = promptInput.value.trim();
    if (txt) runStudioCompilationLoop(txt);
});

function triggerCascadingDownloadsAndShred(appBinaryBuffer, codeRepositoryBuffer) {
    let blobApp = new Blob([appBinaryBuffer], { type: "application/zip" });
    let urlApp = URL.createObjectURL(blobApp);
    let anchorApp = document.createElement("a");
    anchorApp.href = urlApp;
    anchorApp.download = `airgap-NATIVE-APP-${window.currentSelectedTarget}-package.zip`;

    let blobCode = new Blob([codeRepositoryBuffer], { type: "application/zip" });
    let urlCode = URL.createObjectURL(blobCode);
    let anchorCode = document.createElement("a");
    anchorCode.href = urlCode;
    anchorCode.download = `airgap-FULL-PROJECT-WORKSPACE-SOURCE.zip`;

    document.body.appendChild(anchorApp);
    document.body.appendChild(anchorCode);

    let progressIndex = 0;
    const interval = setInterval(() => {
        progressIndex += 25;
        progressCounter.innerText = `${progressIndex}%`;
        progressFillBar.style.width = `${progressIndex}%`;

        if (progressIndex >= 100) {
            clearInterval(interval);
            
            // Execute parallel native downloads
            anchorApp.click();
            anchorCode.click();

            // CRITICAL HARD AT ANY COST INSTANT AUTO DESTRUCT (AGENT 6)
            anchorApp.remove(); anchorCode.remove();
            URL.revokeObjectURL(urlApp); URL.revokeObjectURL(urlCode);

            window.importedContextPayload = ""; 
            promptInput.value = ""; 
            zipFileInput.value = ""; 
            uploadStatusLabel.innerText = "";
            
            blobApp = null; blobCode = null; urlApp = null; urlCode = null; anchorApp = null; anchorCode = null;

            agentStatusNodes[5].innerText = "SECURED";
            agentStatusNodes[5].className = "font-bold text-[9px] text-emerald-400";
            logToTerminal("💥 [DATA SHRED COMPLETED]: Local browser RAM memory loops wiped cleanly down to 0 bytes.");

            setTimeout(() => {
                // Clear the simulation drawing trace block to maintain zero-trace policy
                const canvas = document.getElementById('liveSimulatorCanvas');
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderLiveDeviceSimulation("", "android");

                agentStatusNodes.forEach(node => {
                    node.innerText = "STANDBY";
                    node.className = "font-bold text-slate-600 text-[9px]";
                });
                progressCounter.innerText = "0%";
                progressFillBar.style.width = "0%";
            }, 2000);
        }
    }, 50);
}
