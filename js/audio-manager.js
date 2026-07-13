// ========================================
// AUDIO MANAGER - VUI ĐỌC CÙNG EM
// Quản lý nhạc nền và hiệu ứng âm thanh
// Chạy được trên Live Server và GitHub Pages
// ========================================


// ========================================
// 1. XÁC ĐỊNH ĐƯỜNG DẪN GỐC CỦA ỨNG DỤNG
// ========================================

// Nếu đang chạy trên GitHub Pages:
// https://vankhanh135.github.io/vui-doc-cung-em/
//
// thì BASE_PATH sẽ là:
// /vui-doc-cung-em/
//
// Nếu đang chạy trên Live Server:
// http://127.0.0.1:5500/
//
// thì BASE_PATH sẽ là:
// /

const isGitHubPages =
    window.location.hostname.endsWith(
        "github.io"
    );


const BASE_PATH =
    isGitHubPages
        ? "/vui-doc-cung-em/"
        : "/";


// ========================================
// 2. HÀM TẠO ĐƯỜNG DẪN ÂM THANH
// ========================================

function audioPath(path) {

    return BASE_PATH + path;

}


// ========================================
// 3. DANH SÁCH NHẠC NỀN
// ========================================

// ========================================
// 1. ĐƯỜNG DẪN GỐC CỦA ỨNG DỤNG
// ========================================

// Tự động lấy đúng thư mục dự án trên GitHub Pages
const BASE_URL =
    window.location.hostname.includes("github.io")
        ? "/vui-doc-cung-em"
        : "";


// ========================================
// 2. DANH SÁCH NHẠC NỀN
// ========================================

const BGM = {

    home: `${BASE_URL}/audio/bgm/home.mp3`,

    topic: `${BASE_URL}/audio/bgm/topic.mp3`,

    lessonList: `${BASE_URL}/audio/bgm/lesson-list.mp3`,

    game: `${BASE_URL}/audio/bgm/game.mp3`,

    profile: `${BASE_URL}/audio/bgm/profile.mp3`,

    result: `${BASE_URL}/audio/bgm/result.mp3`,

    badge: `${BASE_URL}/audio/bgm/badge.mp3`,

    aiWaiting: `${BASE_URL}/audio/bgm/ai_waiting.mp3`

};


// ========================================
// 3. DANH SÁCH HIỆU ỨNG ÂM THANH
// ========================================

const SFX = {

    click: `${BASE_URL}/audio/sfx/click.mp3`,

    success: `${BASE_URL}/audio/sfx/success.mp3`,

    error: `${BASE_URL}/audio/sfx/error.mp3`,

    warning: `${BASE_URL}/audio/sfx/warning.mp3`,

    popupOpen: `${BASE_URL}/audio/sfx/popup_open.mp3`,

    popupClose: `${BASE_URL}/audio/sfx/popup_close.mp3`,

    star: `${BASE_URL}/audio/sfx/star.mp3`,

    badge: `${BASE_URL}/audio/sfx/badge.mp3`,

    reward: `${BASE_URL}/audio/sfx/reward.mp3`,

    trophy: `${BASE_URL}/audio/sfx/trophy.mp3`,

    unlock: `${BASE_URL}/audio/sfx/unlock.mp3`,

    finish: `${BASE_URL}/audio/sfx/finish.mp3`,

    aiStart: `${BASE_URL}/audio/sfx/ai_start.mp3`,

    aiDone: `${BASE_URL}/audio/sfx/ai_done.mp3`

};


// ========================================
// 5. TẠO TRÌNH PHÁT NHẠC NỀN
// ========================================

const bgmPlayer =
    new Audio();


bgmPlayer.loop =
    true;


bgmPlayer.volume =
    0.2;


// ========================================
// 6. ĐỌC TRẠNG THÁI ÂM THANH ĐÃ LƯU
// ========================================

const savedBGMState =
    localStorage.getItem(
        "bgmEnabled"
    );


let bgmEnabled =
    savedBGMState === null
        ? true
        : savedBGMState === "true";


const savedSFXState =
    localStorage.getItem(
        "sfxEnabled"
    );


let sfxEnabled =
    savedSFXState === null
        ? true
        : savedSFXState === "true";


let currentBGM =
    null;


// ========================================
// 7. PHÁT NHẠC NỀN
// ========================================

function playBGM(name) {

    const source =
        BGM[name];


    if (!source) {

        console.warn(
            "Không tìm thấy nhạc nền:",
            name
        );

        return;

    }


    // Ghi nhớ bài nhạc hiện tại
    currentBGM =
        name;


    // Nếu nhạc nền đang tắt
    if (!bgmEnabled) {

        return;

    }


    // Nếu đúng bài đang phát
    // thì không phát lại từ đầu
    if (
        bgmPlayer.src === source &&
        !bgmPlayer.paused
    ) {

        return;

    }


    bgmPlayer.pause();


    bgmPlayer.currentTime =
        0;


    bgmPlayer.src =
        source;


    bgmPlayer
        .play()
        .catch(() => {

            console.log(
                "Trình duyệt đang chờ người dùng tương tác để phát nhạc."
            );

        });

}


// ========================================
// 8. DỪNG NHẠC NỀN
// ========================================

function stopBGM() {

    bgmPlayer.pause();


    bgmPlayer.currentTime =
        0;


    currentBGM =
        null;

}


// ========================================
// 9. TẠM DỪNG NHẠC NỀN
// ========================================

function pauseBGM() {

    bgmPlayer.pause();

}


// ========================================
// 10. TIẾP TỤC NHẠC NỀN
// ========================================

function resumeBGM() {

    if (
        bgmEnabled &&
        bgmPlayer.src
    ) {

        bgmPlayer
            .play()
            .catch(() => {});

    }

}


// ========================================
// 11. PHÁT HIỆU ỨNG ÂM THANH
// ========================================

function playSFX(name) {

    if (!sfxEnabled) {

        return;

    }


    const source =
        SFX[name];


    if (!source) {

        console.warn(
            "Không tìm thấy hiệu ứng:",
            name
        );

        return;

    }


    const sound =
        new Audio(
            source
        );


    sound.volume =
        0.7;


    sound
        .play()
        .catch(() => {});

}


// ========================================
// 12. BẬT / TẮT NHẠC NỀN
// ========================================

function toggleBGM() {

    bgmEnabled =
        !bgmEnabled;


    localStorage.setItem(
        "bgmEnabled",
        bgmEnabled
    );


    if (!bgmEnabled) {

        pauseBGM();

    }

    else {

        if (
            bgmPlayer.src
        ) {

            resumeBGM();

        }

        else if (
            currentBGM
        ) {

            playBGM(
                currentBGM
            );

        }

    }


    return bgmEnabled;

}


// ========================================
// 13. KIỂM TRA NHẠC NỀN
// ========================================

function isBGMEnabled() {

    return bgmEnabled;

}


// ========================================
// 14. BẬT / TẮT HIỆU ỨNG ÂM THANH
// ========================================

function toggleSFX() {

    sfxEnabled =
        !sfxEnabled;


    localStorage.setItem(
        "sfxEnabled",
        sfxEnabled
    );


    return sfxEnabled;

}


// ========================================
// 15. KIỂM TRA HIỆU ỨNG ÂM THANH
// ========================================

function isSFXEnabled() {

    return sfxEnabled;

}


// ========================================
// 16. THAY ĐỔI ÂM LƯỢNG NHẠC NỀN
// ========================================

function setBGMVolume(
    volume
) {

    bgmPlayer.volume =
        Math.max(
            0,
            Math.min(
                1,
                volume
            )
        );

}


// ========================================
// 17. PHÁT NHẠC SAU TƯƠNG TÁC ĐẦU TIÊN
// ========================================

function enableAudioAfterInteraction() {

    if (
        currentBGM &&
        bgmEnabled &&
        bgmPlayer.paused
    ) {

        if (
            !bgmPlayer.src
        ) {

            bgmPlayer.src =
                BGM[
                    currentBGM
                ];

        }


        bgmPlayer
            .play()
            .catch(() => {});

    }

}


// ========================================
// 18. LẮNG NGHE TƯƠNG TÁC ĐẦU TIÊN
// ========================================

document.addEventListener(
    "click",
    enableAudioAfterInteraction,
    {
        once: true
    }
);


document.addEventListener(
    "touchstart",
    enableAudioAfterInteraction,
    {
        once: true
    }
);


// ========================================
// 19. KIỂM TRA TRONG CONSOLE
// ========================================

console.log(
    "Audio Manager đã được tải."
);


console.log(
    "Đường dẫn gốc của ứng dụng:",
    BASE_PATH
);