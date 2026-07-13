// ========================================
// AUDIO MANAGER - VUI ĐỌC CÙNG EM
// Quản lý nhạc nền và hiệu ứng âm thanh
// ========================================


// ========================================
// 1. DANH SÁCH NHẠC NỀN
// ========================================

const BGM = {

    home: "/audio/bgm/home.mp3",

    topic: "/audio/bgm/topic.mp3",

    lessonList: "/audio/bgm/lesson-list.mp3",

    game: "/audio/bgm/game.mp3",

    profile: "/audio/bgm/profile.mp3",

    result: "/audio/bgm/result.mp3",

    badge: "/audio/bgm/badge.mp3",

    aiWaiting: "/audio/bgm/ai_waiting.mp3"

};


// ========================================
// 2. DANH SÁCH HIỆU ỨNG ÂM THANH
// ========================================

const SFX = {

    click: "/audio/sfx/click.mp3",

    success: "/audio/sfx/success.mp3",

    error: "/audio/sfx/error.mp3",

    warning: "/audio/sfx/warning.mp3",

    popupOpen: "/audio/sfx/popup_open.mp3",

    popupClose: "/audio/sfx/popup_close.mp3",

    star: "/audio/sfx/star.mp3",

    badge: "/audio/sfx/badge.mp3",

    reward: "/audio/sfx/reward.mp3",

    trophy: "/audio/sfx/trophy.mp3",

    unlock: "/audio/sfx/unlock.mp3",

    finish: "/audio/sfx/finish.mp3",

    aiStart: "/audio/sfx/ai_start.mp3",

    aiDone: "/audio/sfx/ai_done.mp3"

};


// ========================================
// 3. TẠO TRÌNH PHÁT NHẠC NỀN
// ========================================

const bgmPlayer = new Audio();

bgmPlayer.loop = true;

bgmPlayer.volume = 0.2;


// ========================================
// 4. ĐỌC TRẠNG THÁI ÂM THANH ĐÃ LƯU
// ========================================

// Nếu chưa từng lưu thì mặc định bật nhạc nền
const savedBGMState = localStorage.getItem("bgmEnabled");

// Nếu chưa có dữ liệu -> true
// Nếu đã lưu "false" -> false
let bgmEnabled =
    savedBGMState === null
        ? true
        : savedBGMState === "true";


// Nếu chưa từng lưu thì mặc định bật hiệu ứng âm thanh
const savedSFXState = localStorage.getItem("sfxEnabled");

let sfxEnabled =
    savedSFXState === null
        ? true
        : savedSFXState === "true";


let currentBGM = null;


// ========================================
// 5. PHÁT NHẠC NỀN
// ========================================

function playBGM(name) {

    const source = BGM[name];

    if (!source) {

        console.warn(
            "Không tìm thấy nhạc nền:",
            name
        );

        return;

    }


    // Ghi nhớ bài nhạc hiện tại
    currentBGM = name;


    // Nếu nhạc nền đang bị tắt
    // thì không phát
    if (!bgmEnabled) {

        return;

    }


    // Nếu đúng bài đang phát
    // thì không phát lại từ đầu
    if (
        bgmPlayer.src.includes(source) &&
        !bgmPlayer.paused
    ) {

        return;

    }


    bgmPlayer.pause();

    bgmPlayer.currentTime = 0;

    bgmPlayer.src = source;


    bgmPlayer.play().catch(() => {

        console.log(
            "Trình duyệt đang chờ người dùng tương tác để phát nhạc."
        );

    });

}


// ========================================
// 6. DỪNG NHẠC NỀN
// ========================================

function stopBGM() {

    bgmPlayer.pause();

    bgmPlayer.currentTime = 0;

    currentBGM = null;

}


// ========================================
// 7. TẠM DỪNG NHẠC NỀN
// ========================================

function pauseBGM() {

    bgmPlayer.pause();

}


// ========================================
// 8. TIẾP TỤC NHẠC NỀN
// ========================================

function resumeBGM() {

    if (
        bgmEnabled &&
        bgmPlayer.src
    ) {

        bgmPlayer.play().catch(() => {});

    }

}


// ========================================
// 9. PHÁT HIỆU ỨNG ÂM THANH
// ========================================

function playSFX(name) {

    if (!sfxEnabled) return;

    const source = SFX[name];

    if (!source) {

        console.warn(
            "Không tìm thấy hiệu ứng:",
            name
        );

        return;

    }


    const sound = new Audio(source);

    sound.volume = 0.7;

    sound.play().catch(() => {});

}


// ========================================
// 10. BẬT / TẮT NHẠC NỀN
// ========================================

function toggleBGM() {

    bgmEnabled = !bgmEnabled;


    // Lưu trạng thái
    localStorage.setItem(
        "bgmEnabled",
        bgmEnabled
    );


    if (!bgmEnabled) {

        pauseBGM();

    } else {

        // Nếu đã có bài nhạc được chọn
        // thì phát tiếp
        if (bgmPlayer.src) {

            resumeBGM();

        } else if (currentBGM) {

            playBGM(currentBGM);

        }

    }


    return bgmEnabled;

}


// ========================================
// 11. KIỂM TRA NHẠC NỀN ĐANG BẬT HAY TẮT
// ========================================

function isBGMEnabled() {

    return bgmEnabled;

}


// ========================================
// 12. BẬT / TẮT HIỆU ỨNG ÂM THANH
// ========================================

function toggleSFX() {

    sfxEnabled = !sfxEnabled;


    // Lưu trạng thái
    localStorage.setItem(
        "sfxEnabled",
        sfxEnabled
    );


    return sfxEnabled;

}


// ========================================
// 13. KIỂM TRA HIỆU ỨNG ĐANG BẬT HAY TẮT
// ========================================

function isSFXEnabled() {

    return sfxEnabled;

}


// ========================================
// 14. THAY ĐỔI ÂM LƯỢNG NHẠC NỀN
// ========================================

function setBGMVolume(volume) {

    bgmPlayer.volume = Math.max(
        0,
        Math.min(1, volume)
    );

}


// ========================================
// 15. PHÁT NHẠC SAU LẦN TƯƠNG TÁC ĐẦU TIÊN
// ========================================

function enableAudioAfterInteraction() {

    if (
        currentBGM &&
        bgmEnabled &&
        bgmPlayer.paused
    ) {

        // Nếu chưa có nguồn nhạc
        // thì tải bài nhạc hiện tại
        if (!bgmPlayer.src) {

            bgmPlayer.src = BGM[currentBGM];

        }


        bgmPlayer.play().catch(() => {});

    }

}


// Người dùng chỉ cần tương tác một lần
document.addEventListener(
    "click",
    enableAudioAfterInteraction,
    { once: true }
);

document.addEventListener(
    "touchstart",
    enableAudioAfterInteraction,
    { once: true }
);


// ========================================
// AUDIO MANAGER ĐÃ SẴN SÀNG
// ========================================

console.log(
    "Audio Manager đã được tải."
);