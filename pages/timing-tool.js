// ========================================
// DỮ LIỆU 7 TRANG
// ========================================
let pages = {};


// ========================================
// LẤY CÁC PHẦN TỬ HTML
// ========================================

const pageSelect =
    document.getElementById("pageSelect");
const modeSelect =
    document.getElementById("modeSelect");

const textInput =
    document.getElementById("textInput");

const audioPlayer =
    document.getElementById("audioPlayer");

const currentWord =
    document.getElementById("currentWord");

const progressText =
    document.getElementById("progressText");

const output =
    document.getElementById("output");


const prepareBtn =
    document.getElementById("prepareBtn");

const startBtn =
    document.getElementById("startBtn");

const markBtn =
    document.getElementById("markBtn");

const undoBtn =
    document.getElementById("undoBtn");

const finishBtn =
    document.getElementById("finishBtn");


// ========================================
// BIẾN TRẠNG THÁI
// ========================================

let words = [];

let marks = [];

let currentIndex = 0;

let prepared = false;


// ========================================
// HIỂN THỊ TRANG ĐƯỢC CHỌN
// ========================================
async function loadSelectedPage() {

    const pageNumber =
        pageSelect.value;

    if (!pages[pageNumber]) {

        return;

    }

    const page =
        pages[pageNumber];

    textInput.value =
        page.text;

    audioPlayer.src =
        page.audio;

    resetTool();

}


// ========================================
// ĐẶT LẠI CÔNG CỤ
// ========================================

function resetTool() {

    words = [];

    marks = [];

    currentIndex = 0;

    prepared = false;

    currentWord.innerText = "—";

    progressText.innerText = "0 / 0";

    output.value = "";

    audioPlayer.pause();

    audioPlayer.currentTime = 0;

}


// ========================================
// CHUẨN BỊ TRANG
// ========================================

function preparePage() {

    const text =
        textInput.value.trim();


    if (!text) {

        alert(
            "Chưa có nội dung."
        );

        return;

    }


    words =
        text.split(/\s+/);


    marks = [];

    currentIndex = 0;

    prepared = true;


    audioPlayer.pause();

    audioPlayer.currentTime = 0;


    updateCurrentWord();

    output.value = "";

}


// ========================================
// HIỂN THỊ TIẾNG HIỆN TẠI
// ========================================

function updateCurrentWord() {

    if (
        currentIndex <
        words.length
    ) {

        currentWord.innerText =
            words[currentIndex];

    } else {

        currentWord.innerText =
            "ĐÃ ĐÁNH DẤU HẾT";

    }


    progressText.innerText =
        `${currentIndex} / ${words.length}`;

}


// ========================================
// BẮT ĐẦU NGHE
// ========================================

function startListening() {

    if (!prepared) {

        alert(
            "Hãy bấm Chuẩn bị trang trước."
        );

        return;

    }


    audioPlayer.currentTime = 0;


    audioPlayer
        .play()
        .catch(() => {});

}


// ========================================
// ĐÁNH DẤU MỘT TIẾNG
// ========================================

function markWord() {

    if (!prepared) {

        return;

    }


    if (
        currentIndex >=
        words.length
    ) {

        return;

    }


    const time =
        Number(
            audioPlayer
                .currentTime
                .toFixed(3)
        );


    marks.push(time);


    currentIndex++;


    updateCurrentWord();

}


// ========================================
// HOÀN TÁC
// ========================================

function undoMark() {

    if (
        marks.length === 0
    ) {

        return;

    }


    marks.pop();


    currentIndex =
        Math.max(
            0,
            currentIndex - 1
        );


    updateCurrentWord();

}


// ========================================
// TẠO JSON
// ========================================

function finishTiming() {

    if (!prepared) {

        alert(
            "Chưa chuẩn bị trang."
        );

        return;

    }


    if (
        marks.length !==
        words.length
    ) {

        alert(
            `Bạn mới đánh dấu ${marks.length}/${words.length} tiếng.`
        );

        return;

    }


    const audioEnd =
        Number(
            audioPlayer.duration
                .toFixed(3)
        );


    const timings =
        words.map(
            (word, index) => {

                const start =
                    marks[index];


                const end =
                    index <
                    marks.length - 1

                        ? marks[index + 1]

                        : audioEnd;


                return {

                    text: word,

                    start: start,

                    end: end

                };

            }
        );

    if (modeSelect.value === "preview") {

        output.value =
            JSON.stringify(
                {
                    previewTimings: timings
                },
                null,
                2
            );

    } else {

        output.value =
            JSON.stringify(
                timings,
                null,
                2
            );

    }

}


// ========================================
// PHÍM SPACE
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        // Không đánh dấu nếu đang gõ
        // trong textarea
        if (
            document.activeElement
                .tagName === "TEXTAREA"
        ) {

            return;

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            markWord();

        }

    }
);


// ========================================
// SỰ KIỆN NÚT
// ========================================

pageSelect.addEventListener(
    "change",
    loadSelectedPage
);


prepareBtn.addEventListener(
    "click",
    preparePage
);


startBtn.addEventListener(
    "click",
    startListening
);


markBtn.addEventListener(
    "click",
    markWord
);


undoBtn.addEventListener(
    "click",
    undoMark
);


finishBtn.addEventListener(
    "click",
    finishTiming
);
// ========================================
// TẢI LESSON.JSON
// ========================================
async function loadLesson() {

    try {

        const params =
            new URLSearchParams(window.location.search);

        const topic =
            params.get("topic") || "1";

        const lesson =
            params.get("lesson") || "toi-la-hoc-sinh-lop-1";

        let fileName =
            modeSelect.value === "preview"
                ? "ai-reading.json"
                : "lesson.json";

        const response =
            await fetch(
                `../assets/lessons/topic${topic}/${lesson}/${fileName}`
            );

        const data =
            await response.json();
        console.log(modeSelect.value);
        console.log(data);

        pages = {};

        if (modeSelect.value === "lesson") {

            data.pages.forEach(page => {

                pages[page.page] = {

                    text: page.text,

                    audio: "../" + page.audio

                };
                console.log("Lesson audio:", pages[page.page].audio);

            });

        } else {

            pages[1] = {

                text:
                    data.title +
                    "\n\n" +
                    data.paragraphs.join(" ") +
                    "\n\n" +
                    data.author,

                audio: "../" + data.previewAudio

            };
            console.log("Preview audio:", pages[1].audio);

        }

        pageSelect.innerHTML = "";

        if (modeSelect.value === "preview") {

            pageSelect.innerHTML =
                `<option value="1">Toàn bài</option>`;

        } else {

            Object.keys(pages).forEach(key => {

                pageSelect.innerHTML +=
                    `<option value="${key}">Trang ${key}</option>`;

            });

        }
        loadSelectedPage();

    }

    catch (error) {

        console.error(error);

        alert("Không tải được dữ liệu.");

    }

}
modeSelect.addEventListener(
    "change",
    loadLesson
);
// ========================================
// KHỞI ĐỘNG
// ========================================

loadLesson();