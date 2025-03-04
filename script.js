async function convertAudio() {
    const fileInput = document.getElementById("audioInput");
    const outputText = document.getElementById("outputText");
    const loading = document.getElementById("loading");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!fileInput.files.length) {
        alert("يرجى اختيار ملف صوتي!");
        return;
    }

    loading.style.display = "block";
    outputText.innerText = "جاري المعالجة...";
    downloadBtn.style.display = "none";

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("model", "whisper-1");

    try {
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_OPENAI_API_KEY",
            },
            body: formData
        });

        const data = await response.json();
        console.log("Response from API:", data);

        let text = data.text || "لم يتم التعرف على النص.";
        text = formatText(text);

        outputText.innerText = text;
        downloadBtn.style.display = "block";
    } catch (error) {
        console.error("Error:", error);
        outputText.innerText = "حدث خطأ أثناء التحويل!";
    }

    loading.style.display = "none";
}

function formatText(text) {
    const fillerWords = ["يعني", "اممم", "آه", "اه", "تمام", "مثلا", "يعني هو", "طيب"];
    fillerWords.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        text = text.replace(regex, "");
    });

    text = text.replace(/\.\s+/g, ".\n");
    text = text.replace(/،\s+/g, "،\n");

    return text.trim();
}

// إنشاء ملف وورد وتحميله
function downloadAsWord() {
    const text = document.getElementById("outputText").innerText;
    if (!text || text === "جاري المعالجة..." || text === "لم يتم التعرف على النص.") {
        alert("لا يوجد نص لتحميله!");
        return;
    }

    const blob = new Blob(['\ufeff' + text], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "المحاضرة.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}