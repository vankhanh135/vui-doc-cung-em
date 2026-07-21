const params = new URLSearchParams(window.location.search);

const topic = params.get("topic") || 1;
const lesson = params.get("lesson") || 1;
// ========================================
// THÔNG TIN THƯ MỤC BÀI HỌC
// ========================================

const lessonDataMap = {

    "1-1":"toi-la-hoc-sinh-lop-1",
    "1-2":"doi-tai-xau-xi",
    "1-3":"ban-cua-gio",
    "1-4":"giai-thuong-tinh-ban",
    "1-5":"sinh-nhat-cua-voi-con"

};

const lessonFolder =
    lessonDataMap[`${topic}-${lesson}`];
let currentPage = 0;
let lessonData = null;
let wordsData = null;
let readingWasPlaying = false;
let readingStarted = false;
// ========================================
// CHUẨN HÓA ĐƯỜNG DẪN FILE
// Chạy được cả Live Server và GitHub Pages
// ========================================
function resolvePath(path) {

    if (!path) return "";

    // Nếu là URL đầy đủ thì giữ nguyên
    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    // Chuẩn hóa đường dẫn
    const cleanPath = path
        .replace(/^(\.\.\/)+/, "")
        .replace(/^\.\//, "")
        .replace(/^\/+/, "");

    // lesson.html nằm trong thư mục pages
    // ../ sẽ quay về thư mục gốc của project
    return new URL(
        "../" + cleanPath,
        window.location.href
    ).href;
}
// =========================
// Đọc dữ liệu
// =========================
async function loadLesson() {

    const lessonResponse = await fetch(
        `../assets/lessons/topic${topic}/${lessonFolder}/lesson.json`
    );
    lessonData = await lessonResponse.json();

    const wordsResponse = await fetch(
        `../assets/lessons/topic${topic}/toi-la-hoc-sinh-lop-1/words.json`
    );
    wordsData = await wordsResponse.json();

    document.getElementById("lessonTitle").innerText = lessonData.title;

    showPage();
}

// =========================
// Hiển thị trang
// =========================
function showPage() {

    const page = lessonData.pages[currentPage];

    // =========================
    // TẠO TỪNG TIẾNG RIÊNG BIỆT
    // ĐỂ KHỚP VỚI TIMESTAMP
    // =========================

    const arr = page.text.split(" ");

    let html = "";


    // Hàm làm sạch dấu câu để so sánh từ
    function cleanWord(text) {

        return text
            .toLowerCase()
            .replace(/[.,!?;:()"“”'…]/g, "");

    }


// Duyệt từng tiếng trong câu
for (let i = 0; i < arr.length; i++) {

    const currentWord =
        cleanWord(arr[i]);


    // Mặc định từ này không có popup
    let vocabularyWord = "";


    // ========================================
    // KIỂM TRA TỪNG TỪ KHÓ TRONG words.json
    // ========================================

    for (const item of wordsData.words) {

        const vocabularyParts =
            item.word
                .toLowerCase()
                .split(/\s+/)
                .map(cleanWord);


        // Kiểm tra tiếng hiện tại có nằm
        // trong một cụm từ khó hay không
        const isPartOfVocabulary =
            vocabularyParts.includes(
                currentWord
            );


        if (isPartOfVocabulary) {

            // Kiểm tra cụm từ khó có thật sự
            // xuất hiện quanh vị trí hiện tại không

            for (
                let start =
                    Math.max(
                        0,
                        i - vocabularyParts.length + 1
                    );

                start <= i;

                start++
            ) {

                const phraseParts =
                    arr
                        .slice(
                            start,
                            start + vocabularyParts.length
                        )
                        .map(cleanWord);


                if (
                    phraseParts.join(" ") ===
                    vocabularyParts.join(" ")
                ) {

                    vocabularyWord =
                        item.word;

                    break;

                }

            }

        }


        if (vocabularyWord) {

            break;

        }

    }


    // ========================================
    // TẠO SPAN CHO TỪNG TIẾNG
    // ========================================

    if (vocabularyWord) {

        // Tiếng thuộc từ khó
        html += `
            <span
                class="word vocabulary-word"
                data-word="${vocabularyWord}"
            >
                ${arr[i]}
            </span>
        `;

    } else {

        // Tiếng bình thường
        html += `
            <span class="word">
                ${arr[i]}
            </span>
        `;

    }

}

    document.getElementById("lessonContainer").innerHTML = `
        <img
            class="lesson-image"
            src="../assets/lessons/topic${topic}/toi-la-hoc-sinh-lop-1/${page.image}">

        <p class="lesson-text">
            ${html}
        </p>

        <audio id="pageAudio">
            <source src="${resolvePath(page.audio)}" type="audio/mpeg">
        </audio>
    `;

    //=======================
    // Thanh tiến trình
    //=======================

    // =======================
    // NÚT CHUYỂN TRANG
    // =======================

    const prevBtn =
        document.getElementById("prevBtn");

    const nextBtn =
        document.getElementById("nextBtn");


    // Trang đầu tiên không thể quay lại
    prevBtn.disabled =
        currentPage === 0;


    // Nếu đang ở trang cuối
    if (
        currentPage ===
        lessonData.pages.length - 1
    ) {

        // Không khóa nút
        nextBtn.disabled = false;

        // Đổi nội dung nút
        nextBtn.innerHTML =
            "Tiếp tục: Luyện đọc ➡";

        // Thêm class để làm nổi bật
        nextBtn.classList.add(
            "quiz-button"
        );

    } else {

        // Các trang bình thường
        nextBtn.disabled = false;

        nextBtn.innerHTML =
            "Trang sau ➡";

        nextBtn.classList.remove(
            "quiz-button"
        );

    }

    const percent =
        ((currentPage + 1) / lessonData.pages.length) * 100;

    document.getElementById("progressFill").style.width =
        percent + "%";

    document.getElementById("pageNumber").innerText =
        `Trang ${currentPage + 1} / ${lessonData.pages.length}`;

    //=======================
    // Âm thanh
    //=======================

    const audio = document.getElementById("pageAudio");

    audio.load();

    highlightWords(audio);

    enablePopup();


    // ========================================
    // XỬ LÝ PHÁT ÂM THANH
    // ========================================

    // Nếu học sinh đã bấm "Đọc bài"
    // thì các trang tiếp theo vẫn tự động phát
    if (readingStarted) {

        audio.play().catch(() => {});

    }
}
// ========================================
// NÚT NGHE LẠI TRANG HIỆN TẠI
// ========================================

const replayReadingBtn =
    document.getElementById("replayReadingBtn");


replayReadingBtn?.addEventListener("click", () => {

    // Lấy audio của trang hiện tại
    const pageAudio =
        document.getElementById("pageAudio");


    if (!pageAudio) {
        return;
    }


    // Đánh dấu học sinh đã bắt đầu nghe bài đọc
    readingStarted = true;


    // Dừng âm thanh từ khó nếu đang phát
    const popupAudio =
        document.getElementById("popupAudio");


    if (popupAudio) {

        popupAudio.pause();

        popupAudio.currentTime = 0;

    }


    // Phát lại bài đọc từ đầu
    pageAudio.pause();

    pageAudio.currentTime = 0;

    pageAudio.play().catch(error => {

        console.error(
            "Không thể phát lại bài đọc:",
            error
        );

    });

});
// =========================
// TÔ SÁNG CHỮ THEO TIMESTAMP
// =========================

function highlightWords(audio) {

    const words =
        Array.from(
            document.querySelectorAll(".word")
        );

    const timings =
        lessonData.pages[currentPage].timings;


    if (
        !timings ||
        timings.length === 0
    ) {

        console.warn(
            "Trang này chưa có dữ liệu timings."
        );

        return;

    }


    // Kiểm tra số tiếng
    if (words.length !== timings.length) {

        console.warn(
            "Số tiếng và timing không khớp:",
            words.length,
            timings.length
        );

    }


    let currentIndex = -1;

    let animationFrameId = null;


    // =========================
    // XÓA TOÀN BỘ HIGHLIGHT
    // =========================

    function clearHighlight() {

        words.forEach(word => {

            word.classList.remove("active");

        });

        currentIndex = -1;

    }


    // =========================
    // CẬP NHẬT HIGHLIGHT
    // =========================

    function updateHighlight() {

        const currentTime =
            audio.currentTime;


        const index =
            timings.findIndex(
                timing =>

                    currentTime >= timing.start

                    &&

                    currentTime < timing.end
            );


        // Chỉ thay đổi khi sang tiếng mới
        if (
            index !== currentIndex
        ) {

            // Xóa highlight cũ
            if (
                currentIndex >= 0 &&
                words[currentIndex]
            ) {

                words[currentIndex]
                    .classList
                    .remove("active");

            }


            // Highlight tiếng mới
            if (
                index >= 0 &&
                words[index]
            ) {

                words[index]
                    .classList
                    .add("active");

            }


            currentIndex = index;

        }


        // Tiếp tục kiểm tra
        if (!audio.paused) {

            animationFrameId =
                requestAnimationFrame(
                    updateHighlight
                );

        }

    }


    // =========================
    // KHI AUDIO BẮT ĐẦU PHÁT
    // =========================

    audio.addEventListener(
        "play",
        () => {

            // Tránh chạy nhiều vòng lặp cùng lúc
            if (animationFrameId) {

                cancelAnimationFrame(
                    animationFrameId
                );

            }


            updateHighlight();

        }
    );


    // =========================
    // KHI AUDIO TẠM DỪNG
    // =========================

    audio.addEventListener(
        "pause",
        () => {

            if (animationFrameId) {

                cancelAnimationFrame(
                    animationFrameId
                );

                animationFrameId = null;

            }

        }
    );


    // =========================
    // KHI KÉO THANH AUDIO
    // =========================

    audio.addEventListener(
        "seeked",
        () => {

            updateHighlight();

        }
    );


    // =========================
    // KHI AUDIO KẾT THÚC
    // =========================

    audio.addEventListener(
        "ended",
        () => {

            if (animationFrameId) {

                cancelAnimationFrame(
                    animationFrameId
                );

                animationFrameId = null;

            }


            clearHighlight();

        }
    );

}

// =========================
// Popup từ khó
// =========================
function enablePopup() {

    document.querySelectorAll("[data-word]").forEach(item => {

        item.onclick = () => {

            const word = item.dataset.word;

            const info =
                wordsData.words.find(w => w.word === word);

            if (!info) return;

            document.getElementById("popupWord").innerText =
                info.word;

            document.getElementById("popupMeaning").innerText =
                info.meaning;

            document.getElementById("popupImage").src =
                `../assets/lessons/topic${topic}/toi-la-hoc-sinh-lop-1/${info.image}`;

            const popupAudio = document.getElementById("popupAudio");

            // Dừng audio của bài đọc
            const pageAudio = document.getElementById("pageAudio");

            if (pageAudio) {

                // Ghi nhớ bài đọc có đang phát hay không
                readingWasPlaying = !pageAudio.paused;

                // Dừng bài đọc
                pageAudio.pause();

            }

            // Audio của popup

            popupAudio.src = resolvePath(info.audio);

            popupAudio.currentTime = 0;

            // Hiện popup
            document.getElementById("popup").style.display = "flex";

            // Phát audio từ
            popupAudio.play().catch(() => {});
        };

    });

}

// =========================
// Đóng popup
// =========================

function closePopup() {

    // Dừng audio của popup
    const popupAudio = document.getElementById("popupAudio");

    popupAudio.pause();
    popupAudio.currentTime = 0;

    // Đóng popup
    document.getElementById("popup").style.display = "none";

    // Tiếp tục bài đọc nếu trước đó đang phát
    const pageAudio = document.getElementById("pageAudio");

    if (pageAudio && readingWasPlaying) {

        pageAudio.play().catch(() => {});

    }

}

// Nút X
document.getElementById("closePopup")?.addEventListener("click", closePopup);

// Nút Đóng
document.getElementById("closePopupBottom")?.addEventListener("click", closePopup);

// Bấm ra ngoài popup
document.getElementById("popup")?.addEventListener("click", (e) => {

    if (e.target.id === "popup") {

        closePopup();

    }

});
// =========================
// Nghe lại từ
// =========================

document.getElementById("playWordAudio")?.addEventListener("click", () => {

    const audio = document.getElementById("popupAudio");

    audio.currentTime = 0;

    audio.play().catch(() => {});

});

// Nhấn ESC
document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closePopup();

    }

});
// =========================
// NÚT BẮT ĐẦU ĐỌC
// =========================

const startReadingBtn =
    document.getElementById("startReadingBtn");

const readingStartGuide =
    document.getElementById("readingStartGuide");


startReadingBtn.addEventListener("click", () => {

    // Đánh dấu học sinh đã bắt đầu đọc
    readingStarted = true;

    // Ẩn bàn tay và nút Đọc bài
    readingStartGuide.classList.add("hidden");

    // Lấy âm thanh của trang hiện tại
    const pageAudio =
        document.getElementById("pageAudio");

    if (pageAudio) {

        // Bắt đầu từ đầu
        pageAudio.currentTime = 0;

        // Phát bài đọc
        pageAudio.play().catch(() => {});

    }

});
// =========================
// Nút chuyển trang
// =========================
document.getElementById("prevBtn").onclick = () => {

    if (currentPage > 0) {

        currentPage--;

        showPage();

    }

};

document.getElementById("nextBtn").onclick = () => {

    // ========================================
    // NẾU CHƯA PHẢI TRANG CUỐI
    // ========================================

    if (
        currentPage <
        lessonData.pages.length - 1
    ) {

        currentPage++;

        showPage();

        return;

    }


    // ========================================
    // NẾU ĐANG Ở TRANG CUỐI
    // CHUYỂN SANG PHẦN ĐỌC HIỂU
    // ========================================

    const pageAudio =
        document.getElementById("pageAudio");


    // Dừng âm thanh bài đọc nếu còn phát
    if (pageAudio) {

        pageAudio.pause();

        pageAudio.currentTime = 0;

    }


    // Dừng âm thanh popup từ khó nếu còn phát
    const popupAudio =
        document.getElementById("popupAudio");

    if (popupAudio) {

        popupAudio.pause();

        popupAudio.currentTime = 0;

    }


    // Chuyển sang trang Đọc hiểu
    window.location.href =
        `ai-reading.html?topic=${topic}&lesson=${lesson}`;

};

//=========================
// Khởi động
//=========================
console.log("lesson.js đã được tải");

loadLesson();

console.log("loadLesson() đã được gọi");
