// ========================================
// DỮ LIỆU 7 TRANG
// ========================================

const pages = {

    1: {
        text:
            "Tôi tên là Nam, học sinh lớp 1A, Trường Tiểu học Lê Quý Đôn.",

        audio:
            "../audio/topic1/toi-la-hoc-sinh-lop-1/pages/page1.mp3"
    },


    2: {
        text:
            "Ngày đầu đi học, mặc bộ đồng phục của trường, tôi hãnh diện lắm.",

        audio:
            "../audio/topic1/toi-la-hoc-sinh-lop-1/pages/page2.mp3"
    },


    3: {
        text:
            "Hồi đầu năm học, tôi mới học chữ cái.",

        audio:
            "../audio/topic1/toi-la-hoc-sinh-lop-1/pages/page3.mp3"
    },


    4: {
        text:
            "Thế mà bây giờ, tôi đã đọc được truyện tranh.",

        audio:
            "../audio/topic1/toi-la-hoc-sinh-lop-1/pages/page4.mp3"
    },


    5: {
        text:
            "Tôi còn biết làm toán nữa.",

        audio:
            "../audio/topic1/toi-la-hoc-sinh-lop-1/pages/page5.mp3"
    },


    6: {
        text:
            "Tôi có thêm nhiều bạn mới.",

        audio:
            "../audio/topic1/toi-la-hoc-sinh-lop-1/pages/page6.mp3"
    },


    7: {
        text:
            "Ai cũng bảo từ khi đi học, tôi chững chạc hẳn lên.",

        audio:
            "../audio/topic1/toi-la-hoc-sinh-lop-1/pages/page7.mp3"
    }

};


// ========================================
// LẤY CÁC PHẦN TỬ HTML
// ========================================

const pageSelect =
    document.getElementById("pageSelect");

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

function loadSelectedPage() {

    const pageNumber =
        pageSelect.value;

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


    output.value =
        JSON.stringify(
            timings,
            null,
            2
        );

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
// KHỞI ĐỘNG
// ========================================

loadSelectedPage();