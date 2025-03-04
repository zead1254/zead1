function convertAudio() {
    let fileInput = document.getElementById("audioFile");
    let loadingText = document.getElementById("loadingText");
    let outputText = document.getElementById("outputText");
    let copyBtn = document.getElementById("copyBtn");
    let downloadBtn = document.getElementById("downloadBtn");

    if (fileInput.files.length === 0) {
        alert("Please select an audio file first!");
        return;
    }

    let file = fileInput.files[0];

    // إظهار التحميل
    loadingText.style.display = "block";
    outputText.value = "";
    copyBtn.style.display = "none";
    downloadBtn.style.display = "none";

    // استخدام مكتبة Web Speech API لتحويل الصوت لنص
    let reader = new FileReader();
    reader.onload = function (event) {
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result, function (buffer) {
            let recognizer = new webkitSpeechRecognition();
            recognizer.lang = "en-US";
            recognizer.continuous = false;
            recognizer.interimResults = false;

            recognizer.onresult = function (event) {
                let text = event.results[0][0].transcript;
                outputText.value = text;
                copyBtn.style.display = "block";
                downloadBtn.style.display = "block";
                loadingText.style.display = "none";
            };

            recognizer.onerror = function () {
                alert("Error converting audio to text. Try again!");
                loadingText.style.display = "none";
            };

            recognizer.start();
        });
    };
    reader.readAsArrayBuffer(file);
}

// زر النسخ
function copyText() {
    let textArea = document.getElementById("outputText");
    textArea.select();
    document.execCommand("copy");
    alert("Text copied!");
}

// زر التحميل كملف Word
function downloadWord() {
    let text = document.getElementById("outputText").value;
    let blob = new Blob(["\ufeff" + text], { type: "application/msword" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Lecture.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}