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

    const q =
        questions[currentQuestion];


    // Đặt lại trạng thái câu hỏi
    selectedAnswer = -1;

    answerIsCorrect = false;
    // Câu mới chưa có lần trả lời sai nào
    currentQuestionHadWrongAnswer = false;

    // Hiển thị số câu
    document
        .getElementById("questionNumber")
        .innerText =
        `Câu ${currentQuestion + 1} / ${questions.length}`;


    // Hiển thị nội dung câu hỏi
    document
        .getElementById("questionText")
        .innerText =
        q.question;
    // ========================================
    // CHUẨN BỊ ÂM THANH CÂU HỎI
    // ========================================

    // Dừng âm thanh câu hỏi cũ nếu đang phát
    if (questionAudio) {

        questionAudio.pause();

        questionAudio.currentTime = 0;

    }


    // Tạo âm thanh cho câu hỏi hiện tại
    questionAudio =
        new Audio(q.audio);

    // Tạo các đáp án
    let html = "";


    q.options.forEach(
        (option, index) => {

            html += `

                <div
                    class="answer"
                    data-index="${index}"
                >

                    ${option}

                </div>

            `;

        }
    );


    document
        .getElementById("answers")
        .innerHTML =
        html;


    // ========================================
    // CHỌN ĐÁP ÁN
    // ========================================

    document
        .querySelectorAll(".answer")
        .forEach(item => {

            item.onclick = () => {

                // Xóa lựa chọn cũ
                document
                    .querySelectorAll(".answer")
                    .forEach(answer => {

                        answer
                            .classList
                            .remove("selected");

                    });


                // Chọn đáp án mới
                item
                    .classList
                    .add("selected");


                selectedAnswer =
                    Number(
                        item.dataset.index
                    );
                // Phát âm thanh khi chọn đáp án
                playSound("click.mp3");
            };

        });

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


        // ====================================
        // CHƯA CHỌN ĐÁP ÁN
        // ====================================

        if (
            selectedAnswer === -1
        ) {

            answerIsCorrect = false;
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


        const q =
            questions[currentQuestion];


        // ====================================
        // TRẢ LỜI ĐÚNG
        // ====================================

        if (
            selectedAnswer ===
            q.answer
        ) {

            answerIsCorrect = true;
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
            selectedAnswer === -1
        ) {

            return;

        }


        // ====================================
        // NẾU TRẢ LỜI SAI
        // ====================================

        if (
            !answerIsCorrect
        ) {

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