async function convertAudio() {
    const file = document.getElementById("audioFile").files[0];
    const loadingText = document.getElementById("loadingText");
    const outputText = document.getElementById("outputText");
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!file) {
        alert("Please select an audio file!");
        return;
    }

    loadingText.style.display = "block";
    outputText.value = "";

    const formData = new FormData();
    formData.append("audio", file);

    try {
        const response = await fetch("https://api.assemblyai.com/v2/transcript", {
            method: "POST",
            headers: {
                "Authorization": "YOUR_API_KEY"
            },
            body: formData
        });

        const data = await response.json();
        loadingText.style.display = "none";

        if (data.text) {
            outputText.value = data.text;
            copyBtn.style.display = "block";
            downloadBtn.style.display = "block";
        } else {
            alert("Error converting audio!");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong!");
        loadingText.style.display = "none";
    }
}

function copyText() {
    const text = document.getElementById("outputText");
    text.select();
    document.execCommand("copy");
    alert("Text copied!");
}

function downloadWord() {
    const text = document.getElementById("outputText").value;
    const blob = new Blob(["\ufeff" + text], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Lecture.doc";
    link.click();
}