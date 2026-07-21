// ======================================
// PREVIEW BÀI HỌC
// ======================================

// Lấy tham số trên URL
const params = new URLSearchParams(window.location.search);

const topic = params.get("topic");
const lesson = params.get("lesson");

// Nếu mở trực tiếp preview.html thì quay về danh sách bài học
if (!topic || !lesson) {

    alert("Vui lòng chọn bài học.");

    window.location.replace("lesson-list.html?topic=1");

    throw new Error("Thiếu tham số topic hoặc lesson.");

}
// Danh sách bài học
const lessonData = {

    "1-1": {
        title: "Tôi là học sinh lớp 1",
        folder: "toi-la-hoc-sinh-lop-1"
    },

    "1-2": {
        title: "Đôi tai xấu xí",
        folder: "doi-tai-xau-xi"
    },

    "1-3": {
        title: "Bạn của gió",
        folder: "ban-cua-gio"
    },

    "1-4": {
        title: "Giải thưởng tình bạn",
        folder: "giai-thuong-tinh-ban"
    },

    "1-5": {
        title: "Sinh nhật của voi con",
        folder: "sinh-nhat-cua-voi-con"

    }

};

const lessonInfo =
    lessonData[`${topic}-${lesson}`];

const lessonFolder =
    lessonInfo.folder;
// ======================================
// LOAD TOÀN BỘ BÀI ĐỌC
// ======================================

const previewText =
    document.getElementById("previewText");
const previewLessonTitle =
    document.getElementById("previewLessonTitle");

let lessonJSON = null;
let aiReadingJSON = null;

let previewWords = [];

let previewAnimation = null;
let currentWordIndex = -1;
let highlightTimer = null;
let wordElements = [];

function highlightParagraph(index){

    // Xóa màu cũ
    document
        .querySelectorAll(".reading-paragraph")
        .forEach(p=>{

            p.classList.remove("active-reading");

        });

    // Tô màu đoạn mới
    const paragraph =
        document.getElementById(`paragraph-${index}`);

    if(paragraph){

        paragraph.classList.add("active-reading");

        paragraph.scrollIntoView({

            behavior:"smooth",
            block:"center"

        });

    }

}
loadLesson();
async function loadLesson() {

    try {

    const lessonPath =
        `../assets/lessons/topic${topic}/${lessonFolder}/lesson.json`;

    const aiReadingPath =
        `../assets/lessons/topic${topic}/${lessonFolder}/ai-reading.json`;

    const lessonResponse =
        await fetch(lessonPath);

    const aiReadingResponse =
        await fetch(aiReadingPath);

        if (!lessonResponse.ok) {

            throw new Error("Không tìm thấy ai-reading.json");

        }

        lessonJSON =
            await lessonResponse.json();
        aiReadingJSON =
            await aiReadingResponse.json();
        renderPreviewText();

    }

    catch(error){

        console.error(error);

        previewText.innerHTML =
            "<p>Không tải được dữ liệu bài đọc.</p>";

    }

}
function renderPreviewText(){

    const titleHTML =
        aiReadingJSON.title
            .split(" ")
            .map(word => `<span class="reading-word">${word}</span>`)
            .join(" ");

    previewLessonTitle.innerHTML =
        titleHTML;

    const paragraphsHTML =
        aiReadingJSON.paragraphs
        .map((paragraph,index)=>{

            const words =
                paragraph
                .split(" ")
                .map(word=>`<span class="reading-word">${word}</span>`)
                .join(" ");

            return `

                <p
                    class="reading-paragraph"
                    id="paragraph-${index}">

                    ${words}

                </p>

            `;

        })
        .join("");

    previewText.innerHTML = `

        <article class="full-reading-text">

            <div class="reading-text">

                ${paragraphsHTML}

            </div>

        <p class="reading-author">

            ${
                aiReadingJSON.author
                    .split(" ")
                    .map(word => `<span class="reading-word">${word}</span>`)
                    .join(" ")
            }

        </p>

        </article>

    `;
    wordElements =
        [...document.querySelectorAll(".reading-word")];

    console.log("Số từ:", wordElements.length);

    console.log(wordElements);

}
// ======================================
// HIỂN THỊ ẢNH BÀI HỌC
// ======================================

const lessonImage =
    document.getElementById("lessonImage");

lessonImage.src =
    `../assets/lessons/topic${topic}/${lessonFolder}/preview.webp`;

lessonImage.onerror = function () {

    this.src = "../assets/background/no-image.webp";

};
document.getElementById("lessonTitle").textContent =
    lessonInfo.title;
// ======================================
// NÚT NGHE ĐỌC MẪU
// ======================================
const prepareBtn =
    document.getElementById("prepareBtn");

const playReadingBtn =
    document.getElementById("playReadingBtn");

const readingSection =
    document.getElementById("readingSection");

const previewImageBox =
    document.getElementById("previewImageBox");

const startLessonBtn =
    document.getElementById("startLessonBtn");
const replayBtn =
    document.getElementById("replayBtn");

const finishButtons =
    document.getElementById("finishButtons");
const previewStatus =
    document.getElementById("previewStatus");

const previewAudio =
    document.getElementById("previewAudio");
previewAudio.addEventListener(
    "timeupdate",
    updatePreviewHighlight
);

previewAudio.addEventListener("ended", () => {

    if (currentWordIndex >= 0) {

        wordElements[currentWordIndex]
            ?.classList.remove("active");

    }

    currentWordIndex = -1;

});
// Khóa nút khi mới vào
startLessonBtn.disabled = true;
startLessonBtn.classList.add("disabled");
prepareBtn.addEventListener("click", function () {

    playSFX("click");

    // Ẩn nút Chuẩn bị
    prepareBtn.classList.add("hidden");

    // Ẩn tiêu đề bài phía trên
    document
        .getElementById("lessonTitle")
        .classList.add("hidden");

    // Ẩn ảnh minh họa
    previewImageBox.classList.add("hidden");

    // Hiện khung bài đọc
    readingSection.classList.remove("hidden");

});

// ======================================
// NÚT BẮT ĐẦU NGHE
// ======================================
let isPlaying = false;

playReadingBtn.addEventListener("click", function () {

    playSFX("click");

    // Chưa phát lần nào
    if (previewAudio.src === "") {

        previewAudio.src =
            `../audio/topic${topic}/${lessonFolder}/preview.mp3`;

    }

    // Nếu đang phát
    if (isPlaying) {

        previewAudio.pause();

        isPlaying = false;

        playReadingBtn.textContent =
            "▶ Tiếp tục đọc";

        return;

    }

    // Nếu đang dừng
    previewAudio.play();

    isPlaying = true;

    playReadingBtn.textContent =
        "⏸ Đang đọc mẫu";

});

// ======================================
// KHI ĐỌC XONG
// ======================================

previewAudio.addEventListener("ended", function () {
    isPlaying = false;

    playReadingBtn.classList.add("hidden");

    previewStatus.textContent =
        "🎉 Em đã sẵn sàng luyện đọc!";

    startLessonBtn.disabled = false;

    startLessonBtn.classList.remove("disabled");

    finishButtons.classList.remove("hidden");

    startLessonBtn.classList.add("unlock");

    setTimeout(function(){

        startLessonBtn.classList.remove("unlock");

    },2500);

});


// ======================================
// NÚT BẮT ĐẦU LUYỆN ĐỌC
// ======================================
replayBtn.addEventListener("click", function(){

    playSFX("click");

    previewAudio.currentTime = 0;

    previewAudio.play();

    isPlaying = true;

    playReadingBtn.classList.remove("hidden");

    playReadingBtn.textContent =
        "⏸ Đang đọc mẫu";

    finishButtons.classList.add("hidden");

});
document
    .getElementById("startLessonBtn")
    .addEventListener("click", function () {

        playSFX("click");

        setTimeout(function () {

            window.location.href =
                `lesson.html?topic=${topic}&lesson=${lesson}`;

        }, 200);

    });
function updatePreviewHighlight() {

    if (!previewAudio || !aiReadingJSON) return;

    const currentTime = previewAudio.currentTime;

    const timings = aiReadingJSON.previewTimings;

    for (let i = 0; i < timings.length; i++) {

        if (
            currentTime >= timings[i].start &&
            currentTime < timings[i].end
        ) {

            if (currentWordIndex === i) return;

            if (currentWordIndex >= 0) {

                wordElements[currentWordIndex]
                    ?.classList.remove("active");

            }

            currentWordIndex = i;

            wordElements[currentWordIndex]
                ?.classList.add("active");

            return;

        }

    }

}