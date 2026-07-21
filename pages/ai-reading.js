// ========================================
// TRANG ĐỌC CÙNG AI
// ========================================


// ========================================
// LẤY CÁC PHẦN TỬ
// ========================================

const robotGuideVideo =
    document.getElementById(
        "robotGuideVideo"
    );

const playGuideButton =
    document.getElementById(
        "playGuideButton"
    );

const readingContent =
    document.getElementById(
        "readingContent"
    );

// ========================================
// NỘI DUNG BÀI ĐỌC CHUẨN
// ========================================

let referenceText = "";
let referenceSections = [];
// ========================================
// VĂN BẢN HỌC SINH ĐỌC
// ========================================

let recognizedText = "";

let wrongWordList = [];
// ========================================
// NHẬN DẠNG GIỌNG NÓI
// ========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;
// Đối tượng nhận dạng giọng nói
let speechRecognition = null;
let recognizedSections = [];
if (SpeechRecognition) {

    speechRecognition =
        new SpeechRecognition();

}
// ========================================
// CẤU HÌNH NHẬN DẠNG GIỌNG NÓI
// ========================================

if (speechRecognition) {

    // Nhận dạng tiếng Việt
    speechRecognition.lang =
        "vi-VN";

    // Nhận liên tục
    speechRecognition.continuous =
        true;

    // Trả kết quả tạm thời
    speechRecognition.interimResults =
        true;

    // Chỉ lấy 1 phương án tốt nhất
    speechRecognition.maxAlternatives =
        1;
// ========================================
// KHI AI KẾT THÚC NHẬN DẠNG
// ========================================

}
// ========================================
// KHI AI NHẬN ĐƯỢC GIỌNG NÓI
// ========================================

if (speechRecognition) {

    speechRecognition.addEventListener(
        "result",
        function (event) {

            let finalTranscript = "";
            let interimTranscript = "";
            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

            if (
                event.results[i].isFinal
            ) {

                finalTranscript +=
                    event.results[i][0].transcript;

            }
            else {

                interimTranscript +=
                    event.results[i][0].transcript;

            }

            }


            // Chỉ lưu khi AI đã nhận dạng xong đoạn này
        if (finalTranscript) {

            recognizedText +=
                " " + finalTranscript.trim();

            recognizedText =
                normalizeText(recognizedText);

            console.log(
                "AI đã nhận:",
                recognizedText
            );
            readingStatus.innerHTML = `
            <img
            src="../assets/popup/ai_icon.png"
            class="reading-status-ai-icon"
            >

            <span>
            🎤 ${recognizedText}${interimTranscript}
            </span>
            `;
        }

        }
    );
    speechRecognition.addEventListener(
        "end",
        function () {

            console.log("AI kết thúc nhận dạng");

            compareSections(
                referenceSections,
                recognizedText
            );

        }
    );
}
if (!SpeechRecognition) {

    console.warn(
        "Trình duyệt không hỗ trợ Speech Recognition."
    );

}
// ========================================
// DANH SÁCH ĐƯỜNG DẪN CÁC BÀI HỌC
// ========================================

const aiReadingLessons = {

    "1-1":
        "topic1/toi-la-hoc-sinh-lop-1"

};


// ========================================
// LẤY TOPIC VÀ LESSON TỪ URL
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const topic =
    params.get("topic") || "1";

const lesson =
    params.get("lesson") || "1";


// ========================================
// TẠO MÃ BÀI HỌC
// ========================================

const lessonKey =
    `${topic}-${lesson}`;

const lessonFolder =
    aiReadingLessons[lessonKey];


// ========================================
// TẢI NỘI DUNG BÀI ĐỌC AI
// ========================================

async function loadAIReading() {

    // Kiểm tra bài học có tồn tại hay không
    if (!lessonFolder) {

        readingContent.innerHTML = `

            <div class="reading-error">

                <p>
                    Chưa có dữ liệu Đọc cùng AI
                    cho bài học này.
                </p>

            </div>

        `;

        return;

    }


    // Tạo đường dẫn đến file ai-reading.json
    const dataPath =
        `../assets/lessons/${lessonFolder}/ai-reading.json`;


    try {

        // Đọc file JSON
        const response =
            await fetch(
                dataPath
            );


        // Nếu không tải được file
        if (!response.ok) {

            throw new Error(
                `Không thể tải dữ liệu: ${response.status}`
            );

        }


        // Chuyển dữ liệu sang JSON
        const data =
            await response.json();
        // Lưu toàn bộ bài đọc chuẩn
        referenceText =
            `${data.title}. ${data.paragraphs.join(" ")}.`;
        referenceSections = [

            data.title,

            ...data.paragraphs,


        ];
        console.log(
            "Bài đọc chuẩn:",
            referenceText
        );
        // Hiển thị toàn bộ bài đọc
        // ========================================
        // TẠO CÁC ĐOẠN VĂN
        // ========================================

        const paragraphsHTML =
            data.paragraphs
                .map(
                    paragraph => `

                        <p class="reading-paragraph">
                            ${paragraph}
                        </p>

                    `
                )
                .join("");


        // ========================================
        // HIỂN THỊ NỘI DUNG BÀI ĐỌC
        // ========================================

        readingContent.innerHTML = `

            <article class="full-reading-text">

                <div class="reading-text">

                    ${paragraphsHTML}

                </div>


                <p class="reading-author">

                    (${data.author})

                </p>

            </article>

        `;


        // Hiển thị thông tin kiểm tra
        console.log(
            "Đã tải bài đọc AI:",
            data
        );

    }


    catch (error) {

        console.error(
            "Lỗi tải bài đọc AI:",
            error
        );


        readingContent.innerHTML = `

            <div class="reading-error">

                <p>
                    Không thể tải nội dung bài đọc.
                </p>

            </div>

        `;

    }

}


// ========================================
// BẤM NÚT NGHE HƯỚNG DẪN
// ========================================

playGuideButton.addEventListener(
    "click",
    function () {

        // Nếu video đang phát
        if (!robotGuideVideo.paused) {

            robotGuideVideo.pause();

            playGuideButton.innerHTML =
                "▶️ Tiếp tục hướng dẫn";

            return;

        }


        // Nếu video đã phát hết
        if (robotGuideVideo.ended) {

            robotGuideVideo.currentTime = 0;

        }


        // Phát video
        robotGuideVideo.play();

        playGuideButton.innerHTML =
            "⏸️ Tạm dừng";

    }
);


// ========================================
// KHI VIDEO PHÁT XONG
// ========================================

robotGuideVideo.addEventListener(
    "ended",
    function () {

        playGuideButton.innerHTML =
            "🔄 Nghe lại hướng dẫn";

    }
);


// ========================================
// KHỞI ĐỘNG TRANG
// ========================================

loadAIReading();
// ========================================
// LẤY NÚT BẮT ĐẦU ĐỌC
// ========================================

const startReadingButton =
    document.getElementById(
        "startReadingButton"
    );

const readingStatus =
    document.getElementById(
        "readingStatus"
    );
const readingResult =

document.getElementById(

"readingResult"

);
const goQuizButton =
    document.getElementById(
        "goQuizButton"
    );
const playRecordingButton =
    document.getElementById(
        "playRecordingButton"
    );
// ========================================
// BIẾN GHI ÂM GIỌNG ĐỌC
// ========================================

let mediaRecorder = null;

let audioChunks = [];
// Lưu bản ghi âm hoàn chỉnh
let recordedAudioBlob = null;
// Đường dẫn tạm để phát lại bản ghi âm
let recordedAudioURL = null;
// Trình phát bản ghi âm
let recordedAudioPlayer = null;
// ========================================
// BẤM NÚT BẮT ĐẦU ĐỌC
// ========================================

startReadingButton.addEventListener(
    "click",
    async function () {
        // ========================================
        // NẾU ĐANG GHI ÂM → DỪNG GHI ÂM
        // ========================================

        if (
            mediaRecorder &&
            mediaRecorder.state === "recording"
        ) {

            // Dừng ghi âm
            mediaRecorder.stop();

            // Dừng AI nhận dạng giọng nói
            if (speechRecognition) {

                speechRecognition.stop();

            }

            return;

        }
        try {

            // Yêu cầu quyền sử dụng micro
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
            // ========================================
            // KHỞI TẠO GHI ÂM
            // ========================================

            mediaRecorder =
                new MediaRecorder(
                    stream
                );


            // Xóa dữ liệu ghi âm cũ
            audioChunks = [];
            // ========================================
            // GIẢI PHÓNG ĐƯỜNG DẪN BẢN GHI CŨ
            // ========================================

            if (recordedAudioURL) {

                URL.revokeObjectURL(
                    recordedAudioURL
                );

                recordedAudioURL = null;

            }
            // Ẩn nút nghe lại của bản ghi cũ
            playRecordingButton.hidden = true;

            playRecordingButton.textContent =
                "🔊 NGHE LẠI BÀI ĐỌC";
            // ========================================
            // XÓA TRÌNH PHÁT BẢN GHI CŨ
            // ========================================

            if (recordedAudioPlayer) {

                recordedAudioPlayer.pause();

                recordedAudioPlayer = null;

            }
            // ========================================
            // NHẬN DỮ LIỆU ÂM THANH
            // ========================================

            mediaRecorder.addEventListener(
                "dataavailable",
                function (event) {

                    // Chỉ lưu dữ liệu khi có âm thanh
                    if (event.data.size > 0) {

                        audioChunks.push(
                            event.data
                        );

                    }

                }
            );
            // ========================================
            // KHI DỪNG GHI ÂM
            // ========================================

            mediaRecorder.addEventListener(
                "stop",
                function () {

                    // Ghép các phần âm thanh
                    // thành một dữ liệu âm thanh hoàn chỉnh
                    recordedAudioBlob =
                        new Blob(
                            audioChunks,
                            {
                                type: mediaRecorder.mimeType
                            }
                        );
                // ========================================
                // TẠO ĐƯỜNG DẪN PHÁT LẠI BẢN GHI
                // ========================================

                recordedAudioURL =
                    URL.createObjectURL(
                        recordedAudioBlob
                    );

                console.log(
                    "Đường dẫn bản ghi:",
                    recordedAudioURL
                );

                    console.log(
                        "Đã lưu bản ghi âm:",
                        recordedAudioBlob
                    );
            // ========================================
            // TẮT MICRO SAU KHI GHI ÂM XONG
            // ========================================

            mediaRecorder.stream
                .getTracks()
                .forEach(
                    track => track.stop()
                );
                    // ========================================
                    // CẬP NHẬT GIAO DIỆN KHI ĐỌC XONG
                    // ========================================

                    startReadingButton.classList.remove(
                        "is-listening"
                    );

                    startReadingButton.querySelector("span").textContent =
                        "ĐỌC LẠI";

                    readingStatus.innerHTML = `
                        <img
                            src="../assets/popup/ai_icon.png"
                            alt="AI"
                            class="reading-status-ai-icon"
                        >
                        <span>
                            AI đang phân tích bài đọc của em...
                        </span>
                    `;
                    // Hiển thị nút nghe lại bản ghi
                    playRecordingButton.hidden = false;
                    speechRecognition.stop();
                }
            );
            // Bắt đầu ghi âm
            mediaRecorder.start();
// ========================================
// BẮT ĐẦU NHẬN DẠNG GIỌNG NÓI
// ========================================
if (speechRecognition) {

    // Reset toàn bộ dữ liệu của lần đọc trước
    recognizedText = "";
    recognizedSections = [];
    wrongWordList = [];

    readingResult.hidden = true;
    readingResult.innerHTML = "";

    speechRecognition.abort();   // đảm bảo phiên trước đã kết thúc

    setTimeout(() => {
        speechRecognition.start();
    }, 200);

}
            
            // Nếu mở micro thành công
            readingStatus.textContent =
                "🎤 AI đang nghe... Em hãy bắt đầu đọc nhé!";

            startReadingButton.classList.add(
                "is-listening"
            );

            startReadingButton.querySelector("span").textContent =
                "ĐANG NGHE...";

            console.log(
                "Đã mở micro thành công:",
                stream
            );

        } catch (error) {

            // Nếu không mở được micro
            readingStatus.textContent =
                "⚠️ Không thể sử dụng micro. Hãy cho phép quyền truy cập micro.";

            console.error(
                "Lỗi micro:",
                error
            );

        }

    }
);
// ========================================
// NGHE LẠI BẢN GHI ÂM
// ========================================

playRecordingButton.addEventListener(
    "click",
    function () {

        // Kiểm tra đã có bản ghi hay chưa
        if (!recordedAudioURL) {

            return;

        }


        // Nếu chưa có trình phát
        // thì tạo trình phát mới
        if (!recordedAudioPlayer) {

            recordedAudioPlayer =
                new Audio(
                    recordedAudioURL
                );
        // Khi bản ghi phát xong
        recordedAudioPlayer.addEventListener(
            "ended",
            function () {

                playRecordingButton.textContent =
                    "🔊 NGHE LẠI BÀI ĐỌC";

            }
        );
        }
        // ========================================
        // NẾU ĐANG PHÁT → TẠM DỪNG
        // ========================================

        if (!recordedAudioPlayer.paused) {

            recordedAudioPlayer.pause();

            playRecordingButton.textContent =
                "▶️ TIẾP TỤC NGHE";

            return;

        }

        // ========================================
        // NẾU ĐANG DỪNG → TIẾP TỤC PHÁT
        // ========================================

        recordedAudioPlayer.play();

        playRecordingButton.textContent =
            "⏸️ TẠM DỪNG";

    }
    
);
// ========================================
// ĐỌC SỐ TIẾNG VIỆT
// ========================================

const NUMBER_WORDS = {
    0: "không",
    1: "một",
    2: "hai",
    3: "ba",
    4: "bốn",
    5: "năm",
    6: "sáu",
    7: "bảy",
    8: "tám",
    9: "chín",
    10: "mười"
};
function numberToVietnamese(number) {

    number = Number(number);

    if (NUMBER_WORDS[number]) {
        return NUMBER_WORDS[number];
    }

    return number.toString();

}
// ========================================
// CHUẨN HÓA VĂN BẢN
// ========================================
function normalizeText(text) {

    text = text.toLowerCase();

    // =========================
    // Chuẩn hóa các ký hiệu
    // =========================

    text = text.replace(/\btp\./g, "thành phố");
    text = text.replace(/\bq\./g, "quận");
    text = text.replace(/\bp\./g, "phường");
    text = text.replace(/\bth\./g, "thị");

    // =========================
    // 1A -> một a
    // 2B -> hai b
    // =========================

    text = text.replace(

        /\b(\d+)([a-z])\b/gi,

        (_, num, letter) => {

            return (
                numberToVietnamese(num)
                + " "
                + letter.toLowerCase()
            );

        }

    );

    // =========================
    // Chuyển toàn bộ số thành chữ
    // =========================

    text = text.replace(

        /\b\d+\b/g,

        match => numberToVietnamese(match)

    );

    // =========================
    // Chuẩn hóa một số cách AI hay đọc
    // =========================

    text = text.replace(/\bmột a\b/g, "một a");
    text = text.replace(/\bmột á\b/g, "một a");

    text = text.replace(/\blê quý đônn\b/g, "lê quý đôn");
    text = text.replace(/\bquý dôn\b/g, "quý đôn");

    // =========================
    // Bỏ dấu câu
    // =========================

    text = text.replace(

        /[.,!?;:()"']/g,

        " "

    );

    // =========================
    // Chuẩn hóa khoảng trắng
    // =========================

    text = text.replace(

        /\s+/g,

        " "

    );
    text = text.replace(/\bphẩy\b/g, " ");
    text = text.replace(/\bchấm\b/g, " ");
    return text.trim();

}

// ========================================
// SO SÁNH BÀI ĐỌC
// ========================================
// ========================================
// TÌM TỪ TIẾP THEO
// ========================================

function findWord(
    words,
    target,
    startIndex
) {

    for (
        let i = startIndex;
        i < words.length;
        i++
    ) {

        if (words[i] === target) {

            return i;

        }

    }

    return -1;

}
function tokenize(text) {

    let words = text.split(" ");

    const phrases = [

        "học sinh",

        "lớp một",

        "lê quý đôn",

        "tiểu học",

        "đồng phục",

        "hãnh diện",

        "đầu năm",

        "truyện tranh",

        "trung sơn",

    ];

    let result = [];

    for (let i = 0; i < words.length;) {

        let merged = false;

        for (const phrase of phrases) {

            const parts = phrase.split(" ");

            const current =
                words
                .slice(i, i + parts.length)
                .join(" ");

            if (current === phrase) {

                result.push(phrase);

                i += parts.length;

                merged = true;

                break;

            }

        }

        if (!merged) {

            result.push(words[i]);

            i++;

        }

    }

    return result;

}
const fillerWords = [
    "ờ",
    "à",
    "ừ",
    "ừm",
    "ơ",
    "ờm",
    "nha",
    "nhé",
    "ha"
];
function splitIntoSections(text) {

    // Chuẩn hóa trước
    text = normalizeText(text);

    // Chia theo dấu chấm nếu có
    let sections = text
        .split(".")
        .map(item => item.trim())
        .filter(item => item.length > 0);

    // Nếu chỉ có 1 đoạn
    // nghĩa là AI không đọc dấu chấm
    if (sections.length <= 1) {

        return [
            text
        ];

    }

    return sections;

}
// ========================================
// TÌM VỊ TRÍ CÂU GIỐNG NHẤT
// ========================================

function findSentenceInText(sentence, fullText, startIndex = 0) {

    const sentenceWords = tokenize(normalizeText(sentence));
    const textWords = tokenize(normalizeText(fullText));

    if (!sentenceWords.length || !textWords.length) {

        return {
            start: -1,
            end: -1,
            percent: 0
        };

    }

    let bestStart = -1;
    let bestEnd = -1;
    let bestScore = -1;

    const minWindow = Math.max(
        3,
        Math.floor(sentenceWords.length * 0.7)
    );

    const maxWindow = Math.min(
        textWords.length,
        Math.ceil(sentenceWords.length * 1.3)
    );

        for (

            let i = startIndex;

            i <= Math.min(
                startIndex + 3,
                textWords.length - 1
            );

            i++

        )
        {

        for (let windowSize = minWindow; windowSize <= maxWindow; windowSize++) {

            if (i + windowSize > textWords.length) break;

            const windowWords =
                textWords.slice(i, i + windowSize);

            let score = 0;

            const used = new Set();

            for (const word of sentenceWords) {

                const pos = windowWords.indexOf(word);

                if (pos !== -1 && !used.has(pos)) {

                    used.add(pos);
                    score++;

                }

            }

            if (score > bestScore) {

                bestScore = score;
                bestStart = i;
                bestEnd = i + windowSize;

            }

        }

    }

    return {

        start: bestStart,

        end: bestEnd,

        percent: bestScore / sentenceWords.length

    };

}
// ========================================
// CĂN CHỈNH TỪ BẰNG LCS
// ========================================

function alignWordsLCS(originalWords, spokenWords) {

    const m = originalWords.length;
    const n = spokenWords.length;

    const dp = Array.from(
        { length: m + 1 },
        () => Array(n + 1).fill(0)
    );

    for (let i = m - 1; i >= 0; i--) {

        for (let j = n - 1; j >= 0; j--) {

            if (originalWords[i] === spokenWords[j]) {

                dp[i][j] =
                    dp[i + 1][j + 1] + 1;

            }

            else {

                dp[i][j] = Math.max(

                    dp[i + 1][j],

                    dp[i][j + 1]

                );

            }

        }

    }

    let i = 0;
    let j = 0;

    const result = [];

    while (

        i < m &&
        j < n

    ) {

        if (

            originalWords[i] === spokenWords[j]

        ) {

            result.push({

                type: "correct",

                original: originalWords[i],

                spoken: spokenWords[j]

            });

            i++;
            j++;

            continue;

        }

        if (

            dp[i + 1][j] >= dp[i][j + 1]

        ) {

            result.push({

                type: "missing",

                original: originalWords[i],

                spoken: ""

            });

            i++;

        }

        else {

            result.push({

                type: "extra",

                original: "",

                spoken: spokenWords[j]

            });

            j++;

        }

    }

    while (i < m) {

        result.push({

            type: "missing",

            original: originalWords[i],

            spoken: ""

        });

        i++;

    }

    while (j < n) {

        result.push({

            type: "extra",

            original: "",

            spoken: spokenWords[j]

        });

        j++;

    }

    return result;

}
// ========================================
// TÍNH ĐIỂM TỪ KẾT QUẢ ALIGN
// ========================================

function calculateScore(alignment) {

    let correct = 0;
    let wrong = 0;

    const wrongWords = [];

    for (const item of alignment) {

        switch (item.type) {

            case "correct":

                correct++;

                break;

            case "missing":

                wrong++;

                wrongWords.push(item.original);

                break;

            case "extra":

                // Không trừ điểm
                break;

        }

    }

    const percent =

        Math.round(

            correct /

            Math.max(1, correct + wrong)

            * 100

        );

    return {

        correct,

        wrong,

        percent,

        wrongWords

    };

}
// ========================================
// XÂY DỰNG PHẢN HỒI
// ========================================
// ========================================
// XÂY DỰNG PHẢN HỒI
// ========================================
function buildFeedback(score) {

    const wrongCount = score.wrong;

    let scoreText = "";
    let grade = "";
    let message = "";
    let suggestion = "";
    let action = "";

    if (wrongCount === 0) {

        scoreText = "Hoàn thành tốt";

        message =
            "🌟 Xuất sắc! Em đọc rất lưu loát.";

        suggestion =
            "Em có thể chuyển sang bài tiếp theo.";

        action = "next";

    }

    else if (wrongCount <= 2) {

        scoreText = "Hoàn thành tốt";

        message =
            "👍 Em đọc rất tốt.";

        suggestion =
            "Em chỉ cần đọc chậm và rõ hơn một chút nhé.";

        action = "retry";

    }

    else if (wrongCount <= 5) {

        scoreText = "Hoàn thành";

        message =
            "😊 Em đã cố gắng.";

        suggestion =
            "Hãy đọc lại bài một lần nữa để đạt kết quả tốt hơn.";

        action = "retry";

    }

    else if (wrongCount <= 9) {

        scoreText = "Hoàn thành";

        message =
            "📖 Em nên nghe bài mẫu rồi đọc lại nhé.";

        suggestion =
            "Nghe bài mẫu sẽ giúp em đọc tốt hơn.";

        action = "listen";

    }

    else {

        scoreText = "Chưa hoàn thành";

        message =
            "📖 Em cần luyện đọc thêm.";

        suggestion =
            "Hãy nghe bài mẫu rồi đọc lại để tiến bộ hơn nhé.";

        action = "listen";

    }

    return {

        score: scoreText,
        grade: grade,
        message: message,
        suggestion: suggestion,
        action: action

    };

}
// ========================================
// SO SÁNH HAI ĐOẠN VĂN
// ========================================
function compareTexts(originalText, spokenText) {

    const originalWords =
        tokenize(
            normalizeText(originalText)
        );

    const spokenWords =
        tokenize(
            normalizeText(spokenText)
        ).filter(
            word => !fillerWords.includes(word)
        );

    const alignment =
        alignWordsLCS(
            originalWords,
            spokenWords
        );

    let correct = 0;
    let wrong = 0;
    const wrongWords = [];

    for (const item of alignment) {

        if (item.type === "correct") {
            correct++;
        }

        if (item.type === "missing") {
            wrong++;
            wrongWords.push(item.original);
        }

        // Không trừ điểm các từ AI nhận dư
        // (extra) vì học sinh thường thêm từ đệm.
    }

    wrongWordList.push(...wrongWords);

    return {

        correct,

        wrong,

        percent: Math.round(
            correct /
            Math.max(1, correct + wrong) * 100
        ),

        wrongWords

    };

}
// ========================================
// SO SÁNH TOÀN BÀI ĐỌC
// ========================================
function compareSections(referenceSections, recognizedText) {

    wrongWordList = [];

    recognizedText = normalizeText(recognizedText);

    const spokenWords = tokenize(recognizedText);

    let pointer = 0;

    let totalCorrect = 0;
    let totalWrong = 0;

    console.clear();

    for (let i = 0; i < referenceSections.length; i++) {

        const original =
            normalizeText(referenceSections[i] || "");

        const originalWords =
            tokenize(original);

        // Chỉ lấy tối đa số từ của câu + 2
        const spoken =
            spokenWords
                .slice(
                    pointer,
                    pointer + originalWords.length + 2
                )
                .join(" ");

        console.log("====================");
        console.log("Câu", i + 1);
        console.log("Chuẩn:", original);
        console.log("Đọc :", spoken);

        const result =
            compareTexts(
                original,
                spoken
            );

        totalCorrect += result.correct;
        totalWrong += result.wrong;

        // Chỉ tiến con trỏ theo độ dài câu chuẩn
        pointer += originalWords.length;

    }

    const percent =
        Math.round(
            totalCorrect /
            Math.max(
                1,
                totalCorrect + totalWrong
            ) * 100
        );

    const uniqueWrongWords =
        [...new Set(wrongWordList)];

    const feedback =
        buildFeedback({
            wrong: uniqueWrongWords.length
        });

    readingResult.hidden = false;

    readingResult.innerHTML = `
        <h3>🌟 KẾT QUẢ ĐỌC</h3>
        <div class="reading-score">
            ${feedback.score}
        </div>

        <div class="reading-grade">
            ${feedback.grade}
        </div>

        <div class="result-message">
            ${feedback.message}
        </div>

        <div class="result-suggestion">
            ${feedback.suggestion}
        </div>

        <p><b>Các từ cần luyện:</b></p>

        ${
            uniqueWrongWords.length
                ? uniqueWrongWords
                    .map(
                        w =>
                            `<span class="bad">🔴 ${w}</span>`
                    )
                    .join("")
                : "<span class='good'>Không có lỗi 🎉</span>"
        }
    `;

// ========================================
// HIỂN THỊ NÚT ĐỌC HIỂU
// ========================================

if (percent >= 80) {

    goQuizButton.hidden = false;

}
else{

    goQuizButton.hidden = true;

}
    console.log("--------------------");
    console.log(percent + "%");
    console.log(uniqueWrongWords);

}
// ========================================
// ĐỌC TỪ CẦN LUYỆN
// ========================================

document.addEventListener("click", function (event) {

    const word = event.target.closest(".speak-word");

    if (!word) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
        word.dataset.word
    );

    utterance.lang = "vi-VN";

    utterance.rate = 0.8;

    speechSynthesis.speak(utterance);

});
function retryReading() {

    readingResult.hidden = true;

    startReadingButton.click();

}

function playLessonAudio() {

    alert("Bước tiếp theo chúng ta sẽ phát bài đọc mẫu.");

}

function goToNextLesson() {

    window.location.href =
    `quiz.html?topic=${topic}&lesson=${lesson}`;

}
goQuizButton.addEventListener(

    "click",

    function(){

        window.location.href =

        `quiz.html?topic=${topic}&lesson=${lesson}`;

    }

);
