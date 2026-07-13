// ========================================
// NHẠC NỀN TRANG CHỦ
// ========================================

playBGM("home");


// ========================================
// NÚT BẬT / TẮT NHẠC NỀN
// ========================================

const bgmToggleButton =
    document.getElementById("bgmToggleButton");

const bgmToggleIcon =
    document.getElementById("bgmToggleIcon");


// Cập nhật hình ảnh nút theo trạng thái nhạc
function updateBGMButton() {

    if (isBGMEnabled()) {

        // Nhạc đang bật
        bgmToggleIcon.src =
            "assets/icons/sound.png";

        bgmToggleButton.setAttribute(
            "aria-label",
            "Tắt nhạc nền"
        );

        bgmToggleButton.title =
            "Tắt nhạc nền";

    } else {

        // Nhạc đang tắt
        bgmToggleIcon.src =
            "assets/icons/unsound.png";

        bgmToggleButton.setAttribute(
            "aria-label",
            "Bật nhạc nền"
        );

        bgmToggleButton.title =
            "Bật nhạc nền";

    }

}


// Hiển thị đúng icon ngay khi mở trang
updateBGMButton();


// Khi bấm nút
bgmToggleButton.addEventListener(
    "click",
    function() {

        // Bật hoặc tắt nhạc nền
        toggleBGM();

        // Đổi icon
        updateBGMButton();

        // Hiệu ứng click vẫn hoạt động
        playSFX("click");

    }
);


// ========================================
// NÚT BẮT ĐẦU
// ========================================

const startButton =
    document.querySelector(".start-button");

startButton.addEventListener(
    "click",
    function(event) {

        // Ngăn chuyển trang ngay lập tức
        event.preventDefault();

        // Phát hiệu ứng click
        playSFX("click");

        // Lấy đường dẫn trang tiếp theo
        const nextPage =
            startButton.href;

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