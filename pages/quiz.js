// ========================================
// LẤY THÔNG TIN TỪ URL
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const topic =
    params.get("topic") || 1;

const lesson =
    params.get("lesson") || 1;


// ========================================
// BIẾN TRẠNG THÁI
// ========================================

let questions = [];

let currentQuestion = 0;

let selectedAnswer = -1;

let answerIsCorrect = false;

let questionAudio = null;

let fillAnswer = "";
// =========================
// BIẾN CHO MATCHING
// =========================

let matchingAnswers = {};

let selectedLeft = null;
// ========================================
// BIẾN KẾT QUẢ
// ========================================

// Số câu trả lời đúng ngay lần đầu
let correctAnswers = 0;

// Tổng số lần trả lời sai
let wrongAttempts = 0;

// Câu hiện tại đã từng trả lời sai hay chưa
let currentQuestionHadWrongAnswer = false;

// Trạng thái đã hoàn thành Quiz
let quizFinished = false;
// ========================================
// PHÁT ÂM THANH HIỆU ỨNG
// ========================================

function playSound(fileName) {

    const audio =
        new Audio(
            `../audio/sfx/${fileName}`
        );

    audio.volume = 0.8;

    audio.play().catch(error => {

        console.log(
            "Không thể phát âm thanh:",
            error
        );

    });

}

// ========================================
// ĐỌC QUESTION.JSON
// ========================================

async function loadQuestions() {

    try {

        const response =
            await fetch(
                `../assets/lessons/topic${topic}/toi-la-hoc-sinh-lop-1/question.json`
            );


        if (!response.ok) {

            throw new Error(
                `Không thể tải question.json. Mã lỗi: ${response.status}`
            );

        }


        const data =
            await response.json();


        questions =
            data.questions;


        // Kiểm tra có câu hỏi hay không
        if (
            !questions ||
            questions.length === 0
        ) {

            throw new Error(
                "Không tìm thấy câu hỏi trong question.json"
            );

        }


        showQuestion();

    }

    catch (error) {

        console.error(
            "Lỗi khi tải câu hỏi:",
            error
        );


        document
            .getElementById("questionText")
            .innerText =
            "Không thể tải câu hỏi. Em hãy thử lại sau nhé!";

    }

}

// ========================================
// HIỂN THỊ CÂU HỎI
// ========================================

function showQuestion() {

    const q = questions[currentQuestion];

    selectedAnswer = null;
    answerIsCorrect = false;
    currentQuestionHadWrongAnswer = false;

    document.getElementById("questionNumber").innerText =
        `Câu ${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("questionText").innerText =
        q.question;

    // ===============================
    // ÂM THANH
    // ===============================

    if (questionAudio) {

        questionAudio.pause();
        questionAudio.currentTime = 0;

    }

    questionAudio = new Audio(q.audio);

    // ===============================
    // TẠO GIAO DIỆN
    // ===============================

    let html = "";

    switch (q.type) {

        // =====================================
        // TRẮC NGHIỆM
        // =====================================

        case "multiple_choice":

            q.options.forEach((option, index) => {

                html += `
                    <div
                        class="answer"
                        data-index="${index}">

                        ${option}

                    </div>
                `;

            });

            break;


        // =====================================
        // ĐÚNG / SAI
        // =====================================

        case "true_false":

            html = `

                <div
                    class="answer"
                    data-value="true">

                    Đúng

                </div>

                <div
                    class="answer"
                    data-value="false">

                    Sai

                </div>

            `;

            break;


// =====================================
// NỐI
// =====================================
case "matching":

    matchingAnswers = {};
    selectedLeft = null;

    html = `

        <div class="matching-container">

            <div class="matching-left">

                ${q.left.map((item,index)=>`

                    <div
                        class="match-left"
                        data-index="${index}">

                        ${item}

                    </div>

                `).join("")}

            </div>

            <div class="matching-right">

                ${q.right.map((item,index)=>`

                    <div
                        class="match-right"
                        data-index="${index}">

                        ${item}

                    </div>

                `).join("")}

            </div>

        </div>

    `;

break;


        // =====================================
        // KÉO THẢ
        // =====================================

        case "drag_drop":

            html = `

                <div class="drag-container">

                    <div class="drag-items">

                        ${q.items.map((item, index) => `

                            <div
                                class="drag-item"
                                draggable="true"
                                data-index="${index}">

                                ${item.text}

                            </div>

                        `).join("")}

                    </div>

                    <div class="drag-targets">

                        ${q.targets.map((target, index) => `

                            <div
                                class="drop-zone"
                                data-index="${index}">

                                ${target}

                            </div>

                        `).join("")}

                    </div>

                </div>

            `;

            break;

// =====================================
// ĐIỀN TỪ (KÉO THẢ)
// =====================================

case "fill_blank":

    html = `

        <div class="fill-container">

            <div class="fill-sentence">

                ${q.sentence.replace(

                    "____",

                    `<div
                        class="blank-box"
                        id="blankBox">
                    </div>`

                )}

            </div>

            <div class="fill-choices">

                ${q.choices.map((word,index)=>`

                    <div
                    class="fill-choice"
                    data-index="${index}"
                    data-word="${word}"
                    draggable="true">

                    ${word}

                </div>

                `).join("")}

            </div>

        </div>

    `;

    break;

    }

    document.getElementById("answers").innerHTML = html;

    // ===============================
    // GẮN SỰ KIỆN
    // ===============================

    if (
        q.type === "multiple_choice" ||
        q.type === "true_false"
    ) 
    {

        document
            .querySelectorAll(".answer")
            .forEach(item => {

                item.onclick = () => {

                    document
                        .querySelectorAll(".answer")
                        .forEach(answer => {

                            answer.classList.remove("selected");

                        });

                    item.classList.add("selected");

                    if (q.type === "multiple_choice") {

                        selectedAnswer =
                            Number(item.dataset.index);

                    }

                    else {

                        selectedAnswer =
                            item.dataset.value === "true";

                    }

                    playSound("click.mp3");

                };

            });

    }
// =========================
// MATCHING
// =========================

if (q.type === "matching") {

    matchingAnswers = {};
    selectedLeft = null;

    // ---------------------
    // Chọn bên trái
    // ---------------------

    document
        .querySelectorAll(".match-left")
        .forEach(left => {

            left.onclick = () => {

                document
                    .querySelectorAll(".match-left")
                    .forEach(x => x.classList.remove("selected"));

                left.classList.add("selected");

                selectedLeft =
                    Number(left.dataset.index);

                playSound("click.mp3");

            };

        });

    // ---------------------
    // Chọn bên phải
    // ---------------------

    document
        .querySelectorAll(".match-right")
        .forEach(right => {

            right.onclick = () => {

                if (selectedLeft === null) {

                    playSound("warning.mp3");

                    return;

                }

                const rightIndex =
                    Number(right.dataset.index);

                // Nếu bên phải đã được nối
                // thì bỏ nối cũ
                for (const key in matchingAnswers) {

                    if (matchingAnswers[key] === rightIndex) {

                        delete matchingAnswers[key];

                    }

                }

                // Lưu đáp án
                matchingAnswers[selectedLeft] =
                    rightIndex;

                // Bỏ chọn tất cả
                document
                    const leftBox = document.querySelector(
                        `.match-left[data-index="${selectedLeft}"]`
                    );

                    leftBox.classList.remove("selected");
                    leftBox.classList.add("matched");

                    right.classList.add("matched");

                    selectedLeft = null;

                playSound("click.mp3");

            };

        });

}
// =========================
// FILL BLANK
// =========================

if (q.type === "fill_blank") {

    const blankBox =
        document.getElementById("blankBox");

    document
        .querySelectorAll(".fill-choice")
        .forEach(item => {

            // --------------------
            // Desktop Drag
            // --------------------

            item.draggable = true;

            item.addEventListener("dragstart", e => {

                e.dataTransfer.setData(
                    "text",
                    item.dataset.word
                );

                item.classList.add("dragging");

                playSound("click.mp3");

            });

            item.addEventListener("dragend", () => {

                item.classList.remove("dragging");

            });

            // --------------------
            // Mobile Touch Drag
            // --------------------

            let clone = null;

            item.addEventListener("touchstart", e => {

                clone = item.cloneNode(true);

                clone.style.position = "fixed";
                clone.style.zIndex = "9999";
                clone.style.pointerEvents = "none";
                clone.style.opacity = "0.85";
                clone.style.transform = "scale(1.05)";

                document.body.appendChild(clone);

            });

            item.addEventListener("touchmove", e => {

                if (!clone) return;

                const touch = e.touches[0];

                clone.style.left =
                    (touch.clientX - clone.offsetWidth / 2) + "px";

                clone.style.top =
                    (touch.clientY - clone.offsetHeight / 2) + "px";

            });

            item.addEventListener("touchend", e => {

                if (!clone) return;

                const touch =
                    e.changedTouches[0];

                const rect =
                    blankBox.getBoundingClientRect();

                const inside =

                    touch.clientX >= rect.left &&
                    touch.clientX <= rect.right &&
                    touch.clientY >= rect.top &&
                    touch.clientY <= rect.bottom;

                if (inside) {

                    if (fillAnswer !== "") {

                        document
                            .querySelectorAll(".fill-choice")
                            .forEach(choice => {

                                if (choice.dataset.word === fillAnswer) {

                                    choice.style.display = "";

                                }

                            });

                    }

                    fillAnswer =
                        item.dataset.word;

                    blankBox.innerText =
                        item.dataset.word;

                    item.style.display = "none";

                    playSound("click.mp3");

                }

                clone.remove();

                clone = null;

            });

        });

    // --------------------
    // Desktop Drop
    // --------------------

    blankBox.addEventListener("dragover", e => {

        e.preventDefault();

    });

    blankBox.addEventListener("drop", e => {

        e.preventDefault();

        const text =
            e.dataTransfer.getData("text");

        if (fillAnswer !== "") {

            document
                .querySelectorAll(".fill-choice")
                .forEach(choice => {

                    if (choice.dataset.word === fillAnswer) {

                        choice.style.display = "";

                    }

                });

        }

        fillAnswer = text;

        blankBox.innerText = text;

        document
            .querySelectorAll(".fill-choice")
            .forEach(choice => {

                if (choice.dataset.word === text) {

                    choice.style.display = "none";

                }

            });

        playSound("click.mp3");

    });

}
}

// ========================================
// HIỂN THỊ POPUP
// ========================================

function showFeedback(
    icon,
    title,
    message,
    buttonText,
    type
) {

    const feedbackPopup =
        document.getElementById(
            "feedbackPopup"
        );

    const feedbackIcon =
        document.getElementById(
            "feedbackIcon"
        );

    const feedbackTitle =
        document.getElementById(
            "feedbackTitle"
        );

    const feedbackMessage =
        document.getElementById(
            "feedbackMessage"
        );

    const feedbackButton =
        document.getElementById(
            "feedbackButton"
        );


    // Xóa trạng thái popup cũ
    feedbackPopup.classList.remove(
        "success",
        "error",
        "warning",
        "finish"
    );


    // Thêm trạng thái popup mới
    if (type) {

        feedbackPopup
            .classList
            .add(type);

    }


    // Hiển thị icon
    feedbackIcon.src =
        icon;


    // Hiển thị tiêu đề
    feedbackTitle.innerText =
        title;


    // Hiển thị lời nhắn
    feedbackMessage.innerText =
        message;


    // Hiển thị chữ trên nút
    feedbackButton.innerText =
        buttonText;


    // Mở popup
    feedbackPopup
        .classList
        .add("show");

}


// ========================================
// ĐÓNG POPUP
// ========================================

function closeFeedback() {

    document
        .getElementById("feedbackPopup")
        .classList
        .remove("show");

}


// ========================================
// NÚT TIẾP TỤC CỦA CÂU HỎI
// ========================================

document
    .getElementById("nextQuestion")
    .onclick = () => {


        const q =
            questions[currentQuestion];

// ====================================
// CHƯA CHỌN ĐÁP ÁN
// ====================================

if (q.type === "matching") {

    if (
        Object.keys(matchingAnswers).length !==
        q.left.length
    ) {

        playSound("warning.mp3");

        showFeedback(
            "../assets/popup/warning_icon.png",
            "Em chưa nối đủ!",
            "Hãy nối hết các cặp nhé!",
            "Đã hiểu",
            "warning"
        );

        return;

    }

}
else if (q.type === "fill_blank") {

    if (fillAnswer === "") {

        playSound("warning.mp3");

        showFeedback(
            "../assets/popup/warning_icon.png",
            "Em chưa điền từ!",
            "Hãy kéo một từ vào ô trống nhé!",
            "Đã hiểu",
            "warning"
        );

        return;

    }

}
else {

    if (selectedAnswer === -1) {

        playSound("warning.mp3");

        showFeedback(
            "../assets/popup/warning_icon.png",
            "Em chưa chọn đáp án!",
            "Em hãy chọn một đáp án nhé!",
            "Đã hiểu",
            "warning"
        );

        return;

    }

}

        // ====================================
        // TRẢ LỜI ĐÚNG
        // ====================================
        let isCorrect = false;
if (q.type === "matching") {

    console.log("matchingAnswers:", matchingAnswers);

    console.log("answer:", q.answer);

    isCorrect = true;

    for (let i = 0; i < q.answer.length; i++) {

        if (matchingAnswers[i] !== q.answer[i]) {

            isCorrect = false;

            break;

        }

    }

}
else if (q.type === "fill_blank") {

    isCorrect =
        fillAnswer === q.answer;

}
else {

    isCorrect =
        selectedAnswer === q.answer;

}
        if (isCorrect) {

    answerIsCorrect = true;
    if (q.type === "fill_blank") {

    const blank =
        document.getElementById("blankBox");

    if (blank) {

        blank.style.background = "#4CAF50";

        blank.style.color = "#ffffff";

        blank.style.borderColor = "#4CAF50";

    }

}
    if (q.type === "matching") {

    for (let i = 0; i < q.answer.length; i++) {

        const left = document.querySelector(
            `.match-left[data-index="${i}"]`
        );

        const right = document.querySelector(
            `.match-right[data-index="${q.answer[i]}"]`
        );

        left.classList.remove("matched");
        right.classList.remove("matched");

        left.classList.add(`match-color-${i}`);
        right.classList.add(`match-color-${i}`);

    }

}
            // Nếu câu này chưa từng trả lời sai
            // thì được tính là đúng ngay lần đầu
            if (!currentQuestionHadWrongAnswer) {

                correctAnswers++;

            }
            playSound("success.mp3");

            showFeedback(

                "../assets/popup/success_icon.png",

               "Chính xác!",

                "Em giỏi lắm!",

                "Tiếp tục",

                "success"

            );

        }


        // ====================================
        // TRẢ LỜI SAI
        // ====================================

        else {

            answerIsCorrect = false;
            if (q.type === "fill_blank") {

            const blank =
                document.getElementById("blankBox");

            if (blank) {

                blank.style.background = "#F44336";

                blank.style.color = "#ffffff";

                blank.style.borderColor = "#F44336";

            }

        }
            if (q.type === "matching") {

    for (let i = 0; i < q.answer.length; i++) {

        const left = document.querySelector(
            `.match-left[data-index="${i}"]`
        );

        const rightIndex =
            matchingAnswers[i];

        if (rightIndex === undefined)
            continue;

        const right = document.querySelector(
            `.match-right[data-index="${rightIndex}"]`
        );

        left.classList.remove(
            "matched",
            "selected"
        );

        right.classList.remove(
            "matched"
        );

        if (rightIndex === q.answer[i]) {

            left.classList.add(
                `match-color-${i}`
            );

            right.classList.add(
                `match-color-${i}`
            );

        } else {

            left.classList.add(
                "match-wrong"
            );

            right.classList.add(
                "match-wrong"
            );

        }

    }

}
else if (q.type === "fill_blank") {

    const blank =
        document.getElementById("blankBox");

    if (blank) {

        blank.style.background = "#4CAF50";

        blank.style.color = "#ffffff";

        blank.style.borderColor = "#4CAF50";

    }

}
            // Ghi nhận câu này đã từng trả lời sai
            currentQuestionHadWrongAnswer = true;

            // Tăng tổng số lần trả lời sai
            wrongAttempts++;

            playSound("error.mp3");

            showFeedback(

                "../assets/popup/error_icon.png",

                "Chưa chính xác!",

                "Em thử lại nhé!",

                "Thử lại",

                "error"

            );

        }

    };


// ========================================
// NÚT TRONG POPUP
// ========================================

document
    .getElementById("feedbackButton")
    .onclick = () => {
        // ====================================
        // NẾU QUIZ ĐÃ HOÀN THÀNH
        // ====================================

        if (quizFinished) {

            // Lưu kết quả
            sessionStorage.setItem(
                "quizCorrectAnswers",
                correctAnswers
            );

            sessionStorage.setItem(
                "quizTotalQuestions",
                questions.length
            );

            sessionStorage.setItem(
                "quizWrongAttempts",
                wrongAttempts
            );


            // Chuyển sang trang kết quả
            window.location.href =
                `result.html?topic=${topic}&lesson=${lesson}`;


            return;

        }

        // Đóng popup
        closeFeedback();


        // ====================================
        // NẾU CHƯA CHỌN ĐÁP ÁN
        // ====================================
        if (
            selectedAnswer === -1 &&
            questions[currentQuestion].type !== "fill_blank"
        ) {

            return;

        }

        // ====================================
        // NẾU TRẢ LỜI SAI
        // ====================================

        if (
            !answerIsCorrect
        ) {
        if (questions[currentQuestion].type === "fill_blank") {

            document
                .querySelectorAll(".fill-choice")
                .forEach(choice => {

                    choice.style.display = "";

                });

            fillAnswer = "";

            const blank =
                document.getElementById("blankBox");

            if (blank) {

                blank.innerText = "";

                blank.style.background = "#ffffff";

                blank.style.color = "#2196F3";

                blank.style.borderColor = "#4CAF50";

            }

        }
            // Đặt lại đáp án
            selectedAnswer = -1;


            // Xóa màu lựa chọn
            document
                .querySelectorAll(".answer")
                .forEach(answer => {

                    answer
                        .classList
                        .remove("selected");

                });


            // Học sinh được chọn lại
            return;

        }


        // ====================================
        // NẾU TRẢ LỜI ĐÚNG
        // VÀ CHƯA PHẢI CÂU CUỐI
        // ====================================

        if (
            currentQuestion <
            questions.length - 1
        ) {

            // Sang câu tiếp theo
            currentQuestion++;


            // Hiển thị câu mới
            showQuestion();


            return;

        }


        // ====================================
        // NẾU ĐÃ HOÀN THÀNH CÂU CUỐI
        // ====================================
        // Đánh dấu Quiz đã hoàn thành
        quizFinished = true;

        // Phát âm thanh hoàn thành
        playSound("finish.mp3");
        showFeedback(

            "../assets/popup/finish_icon.png",

            "Hoàn thành!",

            "Em đã hoàn thành phần Đọc hiểu!",

            "Xem kết quả",

            "finish"

        );

    };


// ========================================
// KHỞI ĐỘNG
// ========================================
// ========================================
// NÚT NGHE CÂU HỎI
// ========================================

document
    .getElementById("playQuestionAudio")
    .addEventListener("click", () => {

        if (!questionAudio) {

            return;

        }


        // Phát tiếng click
        playSound("click.mp3");


        // Phát lại câu hỏi từ đầu
        questionAudio.currentTime = 0;


        questionAudio
            .play()
            .catch(error => {

                console.log(
                    "Không thể phát âm thanh câu hỏi:",
                    error
                );

            });

    });
loadQuestions();