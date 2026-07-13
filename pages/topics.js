// ========================================
// NHẠC NỀN TRANG CHỦ ĐỀ
// ========================================

playBGM("topic");


// ========================================
// NÚT BẬT / TẮT NHẠC NỀN
// ========================================

const bgmToggleButton =
    document.getElementById("bgmToggleButton");

const bgmToggleIcon =
    document.getElementById("bgmToggleIcon");


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


// Hiển thị đúng icon ngay khi mở trang
updateBGMButton();


// ========================================
// XỬ LÝ KHI BẤM NÚT ÂM THANH
// ========================================

bgmToggleButton.addEventListener(
    "click",
    function() {

        // Bật hoặc tắt nhạc nền
        toggleBGM();

        // Cập nhật lại icon
        updateBGMButton();

        // Phát hiệu ứng click
        playSFX("click");

    }
);