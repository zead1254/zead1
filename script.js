async function convertAudio() {
    const fileInput = document.getElementById("audioInput");
    const outputText = document.getElementById("outputText");
    const loading = document.getElementById("loading");

    if (!fileInput.files.length) {
        alert("يرجى اختيار ملف صوتي!");
        return;
    }

    loading.style.display = "block";
    outputText.innerText = "جاري المعالجة...";

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const apiKey = "YOUR_API_KEY"; // ضع مفتاح API هنا
        const response = await fetch(https://api.speech-to-text.com/v1/recognize?key=${apiKey}, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        let text = data.text || "لم يتم التعرف على النص.";

        text = formatText(text);

        outputText.innerText = text;
    } catch (error) {
        outputText.innerText = "حدث خطأ أثناء التحويل!";
    }

    loading.style.display = "none";
}

function formatText(text) {
    // حذف الكلمات غير المهمة
    const fillerWords = ["يعني", "اممم", "آه", "اه", "تمام", "مثلا", "يعني هو", "طيب"];
    fillerWords.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        text = text.replace(regex, "");
    });

    // إضافة فواصل وفقًا للطريقة الأكاديمية
    text = text.replace(/\.\s+/g, ".\n");
    text = text.replace(/،\s+/g, "،\n");

    return text.trim();
}