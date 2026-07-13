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
    params.get("topic") || 1;


// ========================================
// HIỂN THỊ TÊN CHỦ ĐỀ
// ========================================

document.getElementById(
    "topicTitle"
).innerHTML =
    topics[topic].title;


// ========================================
// HIỂN THỊ DANH SÁCH BÀI HỌC
// ========================================

const container =
    document.getElementById(
        "lessonContainer"
    );


// ========================================
// LẤY TIẾN ĐỘ ĐÃ LƯU
// ========================================

const savedProgress =
    JSON.parse(
        localStorage.getItem(
            "readingProgress"
        )
    ) || {};


// ========================================
// TẠO DANH SÁCH BÀI HỌC
// ========================================

topics[topic].lessons.forEach(
    (lessonName, index) => {

        // Số thứ tự bài học
        const lessonNumber =
            index + 1;


        // Mã riêng của bài học
        const progressKey =
            `topic${topic}-lesson${lessonNumber}`;


        // Lấy tiến độ của bài học
        const lessonProgress =
            savedProgress[
                progressKey
            ];


        // Nội dung trạng thái
        let progressHTML = "";


        // Nếu bài học đã hoàn thành
        if (
            lessonProgress &&
            lessonProgress.completed
        ) {

            const stars =
                "⭐".repeat(
                    lessonProgress.stars || 0
                );


            progressHTML = `

                <div class="lesson-progress">

                    <span class="completed-text">

                        ✓ Đã hoàn thành

                    </span>

                    <span class="lesson-stars">

                        ${stars}

                    </span>

                </div>

            `;

        }


        // Tạo thẻ bài học
        container.innerHTML += `

            <a
                class="lesson-card"
                href="lesson.html?topic=${topic}&lesson=${lessonNumber}"
            >

                <span class="lesson-number">

                    📖 Bài ${lessonNumber}

                </span>


                <span class="lesson-name">

                    ${lessonName}

                </span>


                ${progressHTML}

            </a>

        `;

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


// Cập nhật icon theo trạng thái nhạc nền
function updateBGMButton() {

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

bgmToggleButton.addEventListener(
    "click",
    function() {

        toggleBGM();

        updateBGMButton();

        playSFX("click");

    }
);


// ========================================
// HIỆU ỨNG CLICK KHI CHỌN BÀI HỌC
// ========================================

document
    .querySelectorAll(".lesson-card")
    .forEach(function(card) {

        card.addEventListener(
            "click",
            function(event) {

                // Ngăn chuyển trang ngay lập tức
                event.preventDefault();

                // Phát âm thanh click
                playSFX("click");

                // Lấy địa chỉ bài học
                const nextPage =
                    card.href;

                // Chờ một chút rồi chuyển trang
                setTimeout(
                    function() {

                        window.location.href =
                            nextPage;

                    },
                    200
                );

            }
        );

    });