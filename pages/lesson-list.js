// ========================================
// DỮ LIỆU CÁC CHỦ ĐỀ VÀ BÀI HỌC
// ========================================

const topics = {

    1: {

        title: "TÔI VÀ CÁC BẠN",

        lessons: [

            "Tôi là học sinh lớp 1",

            "Đôi tai xấu xí",

            "Bạn của gió",

            "Giải thưởng tình bạn",

            "Sinh nhật của voi con"

        ]

    },


    2: {

        title: "MÁI ẤM GIA ĐÌNH",

        lessons: [

            "Nụ hôn trên bàn tay",

            "Làm anh",

            "Cả nhà đi chơi núi",

            "Quạt cho bà ngủ",

            "Bữa cơm gia đình",

            "Ngôi nhà"

        ]

    },


    3: {

        title: "BÀI HỌC TỪ CUỘC SỐNG",

        lessons: [

            "Kiến và chim bồ câu",

            "Câu chuyện của rễ",

            "Câu hỏi của sói",

            "Chú bé chăn cừu",

            "Tiếng vọng của núi"

        ]

    },


    4: {

        title: "THIÊN NHIÊN KÌ THÚ",

        lessons: [

            "Loài chim của biển cả",

            "Chúa tể rừng xanh",

            "Cuộc thi tài năng rừng xanh",

            "Cây liễu dẻo dai"

        ]

    }

};


// ========================================
// LẤY CHỦ ĐỀ TỪ URL
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const topic =
    params.get("topic") || "1";


// ========================================
// KIỂM TRA CHỦ ĐỀ
// ========================================

const currentTopic =
    topics[topic] || topics[1];


// ========================================
// HIỂN THỊ TÊN CHỦ ĐỀ
// ========================================

document.getElementById(
    "topicTitle"
).textContent =
    currentTopic.title;


// ========================================
// KHU VỰC DANH SÁCH BÀI HỌC
// ========================================

const container =
    document.getElementById(
        "lessonContainer"
    );


// ========================================
// LẤY TIẾN ĐỘ ĐÃ LƯU
// ========================================

let savedProgress = {};

try {

    savedProgress =
        JSON.parse(
            localStorage.getItem(
                "readingProgress"
            )
        ) || {};

} catch (error) {

    console.error(
        "Không thể đọc tiến độ bài học:",
        error
    );

    savedProgress = {};

}


// ========================================
// TẠO DANH SÁCH BÀI HỌC
// ========================================

currentTopic.lessons.forEach(
    (lessonName, index) => {

        // Số thứ tự bài học
        const lessonNumber =
            index + 1;


        // Mã riêng của bài học
        const progressKey =
            `topic${topic}-lesson${lessonNumber}`;


        // Lấy tiến độ của bài học
        const lessonProgress =
            savedProgress[progressKey];


        // Kiểm tra bài đã hoàn thành chưa
        const isCompleted =
            Boolean(
                lessonProgress &&
                lessonProgress.completed
            );


        // ========================================
        // XỬ LÝ SỐ SAO
        // ========================================

        let starCount = 0;

        if (isCompleted) {

            starCount =
                Number(
                    lessonProgress.stars
                ) || 0;

        }


        // Giới hạn từ 0 đến 3 sao
        starCount =
            Math.max(
                0,
                Math.min(
                    3,
                    starCount
                )
            );


        // Tạo 3 vị trí sao cố định
        const starsHTML =
            Array.from(
                {
                    length: 3
                },
                (_, starIndex) => {

                    if (
                        starIndex < starCount
                    ) {

                        return `
                            <span
                                class="star filled-star"
                                aria-hidden="true"
                            >
                                ⭐
                            </span>
                        `;

                    }

                    return `
                        <span
                            class="star empty-star"
                            aria-hidden="true"
                        >
                            ☆
                        </span>
                    `;

                }
            ).join("");


        // ========================================
        // TRẠNG THÁI BÀI HỌC
        // ========================================

        const statusText =
            isCompleted
                ? "✓ Đã hoàn thành"
                : "Chưa hoàn thành";


        const statusClass =
            isCompleted
                ? "completed-text"
                : "not-completed-text";


        // ========================================
        // TẠO THẺ BÀI HỌC
        // ========================================

        const lessonCard =
            document.createElement(
                "a"
            );


        lessonCard.className =
            "lesson-card";


        lessonCard.href =
            `preview.html?topic=${topic}&lesson=${lessonNumber}`;


        lessonCard.innerHTML = `

            <div class="lesson-main-content">

                <span class="lesson-number">

                    📖 Bài ${lessonNumber}

                </span>


                <span class="lesson-name">

                    ${lessonName}

                </span>

            </div>


            <div class="lesson-progress">

                <span class="${statusClass}">

                    ${statusText}

                </span>


                <span
                    class="lesson-stars"
                    aria-label="${starCount} trên 3 sao"
                >

                    ${starsHTML}

                </span>

            </div>

        `;


        // ========================================
        // HIỆU ỨNG CLICK
        // ========================================

        lessonCard.addEventListener(
            "click",
            function(event) {

                // Ngăn chuyển trang ngay lập tức
                event.preventDefault();


                // Phát âm thanh click
                playSFX("click");


                // Lấy địa chỉ bài học
                const nextPage =
                    lessonCard.href;


                // Chờ âm thanh click rồi chuyển trang
                setTimeout(
                    function() {

                        window.location.href =
                            nextPage;

                    },
                    200
                );

            }
        );


        // Thêm thẻ vào danh sách
        container.appendChild(
            lessonCard
        );

    }
);


// ========================================
// NHẠC NỀN DANH SÁCH BÀI HỌC
// ========================================

playBGM("lessonList");


// ========================================
// NÚT BẬT / TẮT NHẠC NỀN
// ========================================

const bgmToggleButton =
    document.getElementById(
        "bgmToggleButton"
    );

const bgmToggleIcon =
    document.getElementById(
        "bgmToggleIcon"
    );


// ========================================
// CẬP NHẬT ICON NHẠC NỀN
// ========================================

function updateBGMButton() {

    if (
        !bgmToggleButton ||
        !bgmToggleIcon
    ) {

        return;

    }


    if (isBGMEnabled()) {

        // Nhạc đang bật
        bgmToggleIcon.src =
            "../assets/icons/sound.png";


        bgmToggleButton.setAttribute(
            "aria-label",
            "Tắt nhạc nền"
        );


        bgmToggleButton.title =
            "Tắt nhạc nền";

    } else {

        // Nhạc đang tắt
        bgmToggleIcon.src =
            "../assets/icons/unsound.png";


        bgmToggleButton.setAttribute(
            "aria-label",
            "Bật nhạc nền"
        );


        bgmToggleButton.title =
            "Bật nhạc nền";

    }

}


// Hiển thị đúng icon khi mở trang
updateBGMButton();


// ========================================
// BẤM NÚT BẬT / TẮT NHẠC
// ========================================

if (bgmToggleButton) {

    bgmToggleButton.addEventListener(
        "click",
        function() {

            toggleBGM();

            updateBGMButton();

            playSFX("click");

        }
    );

}