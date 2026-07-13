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
// LẤY KẾT QUẢ TỪ QUIZ
// ========================================

const correctAnswers =
    Number(
        sessionStorage.getItem(
            "quizCorrectAnswers"
        )
    ) || 0;


const totalQuestions =
    Number(
        sessionStorage.getItem(
            "quizTotalQuestions"
        )
    ) || 5;


const wrongAttempts =
    Number(
        sessionStorage.getItem(
            "quizWrongAttempts"
        )
    ) || 0;


// ========================================
// LẤY CÁC PHẦN TỬ TRÊN TRANG
// ========================================

const correctScoreElement =
    document.getElementById(
        "correctScore"
    );


const totalScoreElement =
    document.getElementById(
        "totalScore"
    );


const wrongAttemptsElement =
    document.getElementById(
        "wrongAttempts"
    );


const resultMessageElement =
    document.getElementById(
        "resultMessage"
    );
// ========================================
// PHẦN TỬ XẾP HẠNG SAO
// ========================================

const starRatingElement =
    document.getElementById(
        "starRating"
    );
// ========================================
// PHẦN TỬ PHẦN THƯỞNG
// ========================================

const rewardTextElement =
    document.getElementById(
        "rewardText"
    );
// ========================================
// HIỂN THỊ KẾT QUẢ
// ========================================

correctScoreElement.innerText =
    correctAnswers;


totalScoreElement.innerText =
    totalQuestions;


wrongAttemptsElement.innerText =
    wrongAttempts;


// ========================================
// TÍNH TỈ LỆ HOÀN THÀNH
// ========================================

const scorePercent =
    totalQuestions > 0
        ? (
            correctAnswers /
            totalQuestions
        ) * 100
        : 0;


// ========================================
// HIỂN THỊ LỜI KHEN VÀ XẾP HẠNG SAO
// ========================================

let numberOfStars = 1;


if (
    scorePercent === 100
) {

    numberOfStars = 3;

    resultMessageElement.innerText =
        "Xuất sắc! Em đã trả lời đúng tất cả các câu ngay lần đầu!";

}

else if (
    scorePercent >= 80
) {

    numberOfStars = 3;

    resultMessageElement.innerText =
        "Rất tốt! Em đã hiểu bài đọc rất tốt!";

}

else if (
    scorePercent >= 60
) {

    numberOfStars = 2;

    resultMessageElement.innerText =
        "Tốt lắm! Em hãy tiếp tục cố gắng nhé!";

}

else {

    numberOfStars = 1;

    resultMessageElement.innerText =
        "Em đã hoàn thành bài học! Hãy luyện đọc thêm để tiến bộ hơn nhé!";

}


// Hiển thị số sao
starRatingElement.innerText =
    "⭐".repeat(
        numberOfStars
    );
// ========================================
// HIỂN THỊ PHẦN THƯỞNG
// ========================================

rewardTextElement.innerText =
    `Em nhận được ${numberOfStars} ngôi sao!`;
// ========================================
// LƯU TIẾN ĐỘ BÀI HỌC
// ========================================

// Tạo mã riêng cho từng bài học
const progressKey =
    `topic${topic}-lesson${lesson}`;


// Lấy dữ liệu tiến độ đã lưu trước đó
const savedProgress =
    JSON.parse(
        localStorage.getItem(
            "readingProgress"
        )
    ) || {};


// Lấy thành tích cũ của bài học hiện tại
const oldResult =
    savedProgress[
        progressKey
    ] || {
        completed: false,
        stars: 0,
        correctAnswers: 0,
        totalQuestions: totalQuestions,
        wrongAttempts: 0
    };


// Chỉ giữ số sao cao nhất
const bestStars =
    Math.max(
        oldResult.stars || 0,
        numberOfStars
    );


// Chỉ giữ số câu đúng cao nhất
const bestCorrectAnswers =
    Math.max(
        oldResult.correctAnswers || 0,
        correctAnswers
    );


// Lưu kết quả mới
savedProgress[
    progressKey
] = {

    completed: true,

    stars:
        bestStars,

    correctAnswers:
        bestCorrectAnswers,

    totalQuestions:
        totalQuestions,

    wrongAttempts:
        wrongAttempts

};


// Lưu toàn bộ tiến độ vào trình duyệt
localStorage.setItem(

    "readingProgress",

    JSON.stringify(
        savedProgress
    )

);


// Kiểm tra dữ liệu đã lưu
console.log(
    "Tiến độ bài học đã được lưu:",
    savedProgress[
        progressKey
    ]
);
// ========================================
// PHÁT ÂM THANH CLICK
// ========================================

function playClickSound() {

    const audio =
        new Audio(
            "../audio/sfx/click.mp3"
        );


    audio.volume = 0.8;


    audio
        .play()
        .catch(() => {});

}


// ========================================
// NÚT HỌC LẠI
// ========================================

document
    .getElementById(
        "retryButton"
    )
    .addEventListener(
        "click",
        () => {

            playClickSound();


            setTimeout(
                () => {

                    window.location.href =
                        `lesson.html?topic=${topic}&lesson=${lesson}`;

                },
                150
            );

        }
    );


// ========================================
// NÚT CHỌN BÀI KHÁC
// ========================================

document
    .getElementById(
        "lessonListButton"
    )
    .addEventListener(
        "click",
        () => {

            playClickSound();


            setTimeout(
                () => {

                    window.location.href =
                        `lesson-list.html?topic=${topic}`;

                },
                150
            );

        }
    );


// ========================================
// NÚT TRANG CHỦ
// ========================================

document
    .getElementById(
        "homeButton"
    )
    .addEventListener(
        "click",
        () => {

            playClickSound();


            setTimeout(
                () => {

                    window.location.href =
                        "../index.html";

                },
                150
            );

        }
    );


// ========================================
// KIỂM TRA TRONG CONSOLE
// ========================================

console.log(
    "Kết quả Quiz:",
    {
        topic: topic,
        lesson: lesson,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        wrongAttempts: wrongAttempts
    }
);