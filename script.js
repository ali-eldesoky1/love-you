document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       1. ELEMENTS & HELPERS
    ========================================= */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const on = (element, event, callback) => {
        if (element) {
            element.addEventListener(event, callback);
        }
    };

    const save = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn("تعذر حفظ البيانات:", error);
        }
    };

    const load = (key, fallback) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    };

    const random = (array) =>
        array[Math.floor(Math.random() * array.length)];

    /* =========================================
       2. WEBSITE STATE
    ========================================= */

    const STATE = {
        theme: localStorage.getItem("love_theme") || "dark",

        accent: localStorage.getItem("love_accent") || "pink",

        startDate: localStorage.getItem("love_start_date") || "2024-02-14",

        heartClicks: Number(localStorage.getItem("love_heart_clicks")) || 999,

        userLetters: load("love_custom_letters", []),

        userPhotos: load("love_custom_photos", [])
    };

    /* =========================================
       3. COMPLETE COLOR PALETTES
    ========================================= */

    const colorThemes = {
        pink: {
            main: "#e85d91",
            secondary: "#ff9fbd",
            soft: "rgba(232, 93, 145, 0.13)",
            border: "rgba(232, 93, 145, 0.35)",
            glow: "rgba(232, 93, 145, 0.25)",
            background: "#21151c",
            surface: "#30202a",
            card: "#392532",
            text: "#fff0f5",
            muted: "#d9aabd"
        },

        purple: {
            main: "#a78bfa",
            secondary: "#c4b5fd",
            soft: "rgba(167, 139, 250, 0.13)",
            border: "rgba(167, 139, 250, 0.35)",
            glow: "rgba(167, 139, 250, 0.25)",
            background: "#191525",
            surface: "#272039",
            card: "#312746",
            text: "#f4efff",
            muted: "#c4b5dc"
        },

        blue: {
            main: "#38bdf8",
            secondary: "#7dd3fc",
            soft: "rgba(56, 189, 248, 0.13)",
            border: "rgba(56, 189, 248, 0.35)",
            glow: "rgba(56, 189, 248, 0.25)",
            background: "#111e2b",
            surface: "#1b2d3e",
            card: "#24394c",
            text: "#eaf7ff",
            muted: "#a9c9df"
        },

        green: {
            main: "#34d399",
            secondary: "#6ee7b7",
            soft: "rgba(52, 211, 153, 0.13)",
            border: "rgba(52, 211, 153, 0.35)",
            glow: "rgba(52, 211, 153, 0.25)",
            background: "#12251f",
            surface: "#1c352c",
            card: "#264438",
            text: "#eafff5",
            muted: "#a8d6c1"
        },

        orange: {
            main: "#fb923c",
            secondary: "#fdba74",
            soft: "rgba(251, 146, 60, 0.13)",
            border: "rgba(251, 146, 60, 0.35)",
            glow: "rgba(251, 146, 60, 0.25)",
            background: "#281b13",
            surface: "#3a281d",
            card: "#493224",
            text: "#fff3e8",
            muted: "#dfb99b"
        }
    };

    /* =========================================
       4. COMPLETE COLOR CHANGE
    ========================================= */

    function applyAccent(color) {
        const palette = colorThemes[color];

        if (!palette) return;

        const root = document.documentElement;

        root.style.setProperty("--accent-main", palette.main);
        root.style.setProperty("--accent-secondary", palette.secondary);
        root.style.setProperty("--accent-soft", palette.soft);
        root.style.setProperty("--accent-border", palette.border);
        root.style.setProperty("--accent-glow", palette.glow);

        root.style.setProperty("--theme-background", palette.background);
        root.style.setProperty("--theme-surface", palette.surface);
        root.style.setProperty("--theme-card", palette.card);
        root.style.setProperty("--theme-text", palette.text);
        root.style.setProperty("--theme-muted", palette.muted);

        document.body.dataset.accent = color;

        STATE.accent = color;

        localStorage.setItem("love_accent", color);

        $$(".accent-dot").forEach(dot => {
            dot.classList.toggle(
                "active",
                dot.dataset.accent === color
            );
        });
    }

    // ألوان الموقع
    $$(".accent-dot").forEach(dot => {
        on(dot, "click", () => {
            applyAccent(dot.dataset.accent);
        });
    });

    applyAccent(STATE.accent);

    /* =========================================
       5. DARK / LIGHT MODE
    ========================================= */

    const themeBtn = $("#theme-toggle-btn");
    const themeIcon = $("#theme-icon");
    const themeText = $("#theme-text");

    function applyTheme(theme) {
        STATE.theme = theme;

        document.body.classList.toggle(
            "dark-theme",
            theme === "dark"
        );

        document.body.classList.toggle(
            "light-theme",
            theme === "light"
        );

        if (themeIcon) {
            themeIcon.className = theme === "dark"
                ? "fa-solid fa-moon"
                : "fa-solid fa-sun";
        }

        if (themeText) {
            themeText.textContent = theme === "dark"
                ? "الوضع الليلي"
                : "الوضع النهاري";
        }

        localStorage.setItem("love_theme", theme);
    }

    applyTheme(STATE.theme);

    on(themeBtn, "click", () => {
        applyTheme(
            STATE.theme === "dark" ? "light" : "dark"
        );
    });

    /* =========================================
       6. FALLING ROSE PETALS
    ========================================= */

    const canvas = $("#petals-canvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");

        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const petals = [];

        class RosePetal {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -30;

                this.size = Math.random() * 10 + 7;
                this.speedY = Math.random() * 1.2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;

                this.rotation = Math.random() * 6;
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;

                this.opacity = Math.random() * 0.4 + 0.4;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;

                if (this.y > height + 30) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();

                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = getComputedStyle(document.documentElement)
                    .getPropertyValue("--accent-main").trim() || "#e85d91";

                ctx.beginPath();
                ctx.ellipse(
                    0,
                    0,
                    this.size * 0.5,
                    this.size,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 35; i++) {
            petals.push(new RosePetal());
        }

        function animatePetals() {
            ctx.clearRect(0, 0, width, height);

            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });

            requestAnimationFrame(animatePetals);
        }

        animatePetals();

        on(window, "resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    /* =========================================
       7. CLICK HEART EFFECT
    ========================================= */

    const loveSymbols = ["❤️", "💖", "💕", "✨", "🌸"];

    function createHeart(x, y) {
        const heart = document.createElement("div");

        heart.className = "click-heart";
        heart.textContent = random(loveSymbols);

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1300);
    }

    on(document, "click", event => {
        if (
            event.target.closest("button") ||
            event.target.closest("input") ||
            event.target.closest("textarea") ||
            event.target.closest("label") ||
            event.target.closest(".modal-card")
        ) return;

        createHeart(event.clientX, event.clientY);
    });

    function burstHearts() {
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                createHeart(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 60);
        }
    }

   /* =========================================
   MUSIC PLAYER
========================================= */

/* تشغيل الموسيقى عند دخول الموقع */

const music = new Audio("romantic.mp3");

music.loop = true;
music.volume = 0.5;

let isPlaying = false;

async function playMusic() {
    try {
        await music.play();
        isPlaying = true;
        updateMusicUI();
    } catch (error) {
        console.log("المتصفح ينتظر تفاعل المستخدم لتشغيل الموسيقى.");
    }
}

// محاولة التشغيل فور فتح الموقع
playMusic();

// لو المتصفح منع التشغيل، تبدأ الموسيقى مع أول تفاعل
function startMusicOnInteraction() {
    if (!isPlaying) {
        playMusic();
    }

    document.removeEventListener("click", startMusicOnInteraction);
    document.removeEventListener("keydown", startMusicOnInteraction);
}

document.addEventListener("click", startMusicOnInteraction);
document.addEventListener("keydown", startMusicOnInteraction);
    /* =========================================
       9. LOVE COUNTER
    ========================================= */

    const countDays = $("#count-days");
    const countHours = $("#count-hours");
    const countMinutes = $("#count-minutes");
    const countSeconds = $("#count-seconds");

    const startDateDisplay = $("#start-date-display");
    const changeDateBtn = $("#change-date-btn");
    const dateDrawer = $("#date-picker-drawer");

    const customDate = $("#custom-start-date");
    const saveDateBtn = $("#save-date-btn");

    if (customDate) {
        customDate.value = STATE.startDate;
    }

    function formatDate(date) {
        const parsed = new Date(date + "T00:00:00");

        return parsed.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function updateCounter() {
        const start = new Date(STATE.startDate + "T00:00:00").getTime();

        if (!Number.isFinite(start)) return;

        const difference = Math.max(0, Date.now() - start);

        const days = Math.floor(difference / 86400000);
        const hours = Math.floor((difference % 86400000) / 3600000);
        const minutes = Math.floor((difference % 3600000) / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);

        if (countDays) countDays.textContent = days.toLocaleString("ar-EG");
        if (countHours) countHours.textContent = String(hours).padStart(2, "0");
        if (countMinutes) countMinutes.textContent = String(minutes).padStart(2, "0");
        if (countSeconds) countSeconds.textContent = String(seconds).padStart(2, "0");

        if (startDateDisplay) {
            startDateDisplay.textContent =
                `تاريخ بداية حكايتنا: ${formatDate(STATE.startDate)}`;
        }
    }

    updateCounter();
    setInterval(updateCounter, 1000);

    on(changeDateBtn, "click", () => {
        dateDrawer?.classList.toggle("open");
    });

    on(saveDateBtn, "click", () => {
        if (!customDate?.value) return;

        STATE.startDate = customDate.value;

        localStorage.setItem("love_start_date", STATE.startDate);

        updateCounter();

        dateDrawer?.classList.remove("open");
    });

    /* =========================================
       10. HEARTBEAT BUTTON
    ========================================= */

    const heartbeatBtn = $("#heartbeat-btn");
    const heartCount = $("#heart-count");
    const heartbeatReaction = $("#heartbeat-reaction");

    const loveQuotes = [
        "كل نبضة تحمل معها كلمة حب جديدة ❤️",
        "أتمنى لك يوماً مليئاً بالسعادة 💖",
        "ابتسامتك تجعل اليوم أجمل 🌸",
        "كل لحظة جميلة تستحق أن نتذكرها ✨",
        "الحياة أجمل بالتفاصيل الصغيرة 💕"
    ];

    if (heartCount) {
        heartCount.textContent = STATE.heartClicks.toLocaleString("ar-EG");
    }

    on(heartbeatBtn, "click", () => {
        STATE.heartClicks++;

        localStorage.setItem(
            "love_heart_clicks",
            STATE.heartClicks
        );

        if (heartCount) {
            heartCount.textContent =
                STATE.heartClicks.toLocaleString("ar-EG");
        }

        if (heartbeatReaction) {
            heartbeatReaction.textContent = random(loveQuotes);
        }

        const rect = heartbeatBtn.getBoundingClientRect();

        createHeart(
            rect.left + rect.width / 2,
            rect.top
        );
    });

    /* =========================================
       11. LOVE LETTERS
    ========================================= */

    const defaultLetters = [
        {
            title: "إلى من أضاء عتمتي ",
            date: "اليوم الأول والأبدي",
            preview: "منذ اللحظة الأولى التي التقيتك فيها، أدركت أن في عينيك حياة أخرى تنتظرني...",
            body: `حبيبتي وروحي،

منذ اللحظة الأولى التي التقت فيها عيناي بعينيكِ، أدركتُ أن في هذا الكون معجزات ما زالت تحدث. لم تكوني مجرد شخص مرّ في حياتي، بل كنتِ بمثابة النور الذي أضاء كل عتمة.

معكِ تعلمتُ أن للحب معنى أعمق من الكلمات؛ هو الأمان والراحة والسعادة.

أحبكِ اليوم، وغداً، وإلى آخر نبض في عمري.`
        },
        {
            title: "قصيدة إلى ابتسامتك ",
            date: "مع كل إشراقة شمس",
            preview: "ابتسامتك ليست مجرد ملامح جميلة، بل هي الصباح الحقيقي الذي أستيقظ لأجله...",
            body: `يا أميرتي،

ابتسامتكِ تملك سحراً عجيباً يعيد ترتيب فوضى يومي، ويجعل كل الصعاب تبدو بسيطة أمام رقتك.

ضحكتكِ بالنسبة لي كالموسيقى التي تجعل اليوم أجمل.`
        },
        {
            title: "وعد الأيام القادمة ",
            date: "عهد مكتوب بالقلب",
            preview: "أعدك أن أكون لك السند والأمان، وأن أحبك في أصعب الأيام قبل أيسرها...",
            body: `رفيقة دربي،

أعدكِ بأن أظل لكِ السند الذي لا يميل، وأن أكون صادقاً معكِ، وأن أقدّر وجودكِ وأحترمكِ في كل وقت.`
        },
        {
            title: "سر صغير لقلبك ",
            date: "همسة خاصة",
            preview: "كلما سألوني عن سبب لمعة عيني هذه الأيام، أنطق اسمك سراً وابتسم...",
            body: `هل تعلمين سراً؟

وجودكِ في حياتي جعلني شخصاً أسعد وأكثر حباً للحياة.

شكراً لأنكِ أنتِ، وشكراً على كل لحظة جميلة.`
        }
    ];

    function getAllLetters() {
        return [...defaultLetters, ...STATE.userLetters];
    }

    const lettersGrid = $("#letters-grid");

    const letterModal = $("#letter-modal");
    const modalTitle = $("#modal-letter-title");
    const modalDate = $("#modal-letter-date");
    const modalBody = $("#modal-letter-body");

    const writeModal = $("#write-letter-modal");
    const addLetterBtn = $("#add-letter-btn");
    const newLetterForm = $("#new-letter-form");

    function renderLetters() {
        if (!lettersGrid) return;

        lettersGrid.innerHTML = "";

        getAllLetters().forEach((letter, index) => {
            const card = document.createElement("div");

            card.className = "envelope-card glass-panel";

            const top = document.createElement("div");
            top.className = "envelope-top";

            const rose = document.createElement("span");
            rose.className = "stamp-rose";
            rose.textContent = ["🌹", "🌸", "🌺", "🌷"][index % 4];

            const seal = document.createElement("div");
            seal.className = "wax-seal";
            seal.innerHTML = '<i class="fa-solid fa-heart"></i>';

            top.append(rose, seal);

            const body = document.createElement("div");
            body.className = "envelope-body";

            const title = document.createElement("h3");
            title.className = "letter-title";
            title.textContent = letter.title;

            const preview = document.createElement("p");
            preview.className = "letter-preview";
            preview.textContent = letter.preview;

            const button = document.createElement("span");
            button.className = "read-more-btn";
            button.textContent = "افتح الرسالة 💖";

            body.append(title, preview, button);
            card.append(top, body);

            card.addEventListener("click", () => {
                window.openLetter(index);
            });

            lettersGrid.appendChild(card);
        });
    }

    window.openLetter = function(index) {
        const letter = getAllLetters()[index];

        if (!letter || !letterModal) return;

        if (modalTitle) modalTitle.textContent = letter.title;
        if (modalDate) modalDate.textContent = letter.date;
        if (modalBody) modalBody.textContent = letter.body;

        letterModal.classList.add("active");
    };

    window.closeLetterModal = () => {
        letterModal?.classList.remove("active");
    };

    window.closeWriteModal = () => {
        writeModal?.classList.remove("active");
    };

    on(addLetterBtn, "click", () => {
        writeModal?.classList.add("active");
    });

    window.saveNewLetter = function(event) {
        event.preventDefault();

        const title = $("#new-letter-title")?.value.trim();
        const body = $("#new-letter-text")?.value.trim();

        if (!title || !body) return;

        STATE.userLetters.push({
            title,
            date: new Date().toLocaleDateString("ar-EG"),
            preview: body.substring(0, 75) + "...",
            body
        });

        save("love_custom_letters", STATE.userLetters);

        newLetterForm?.reset();

        window.closeWriteModal();

        renderLetters();
        burstHearts();
    };

    renderLetters();

    /* =========================================
       12. LOVE JAR
    ========================================= */

    const reasonsList = [
        "لأنك تجعل حتى الأيام العادية تبدو كعيد بابتسامتك.",
        "لأن في عينيك أماناً جميلاً.",
        "لأنك تفهمني من نظرة واحدة.",
        "لأن صوتك هو الأغنية المفضلة.",
        "لأنك تساندني وتؤمن بي.",
        "لأن طيبة قلبك ونقاء روحك نادران.",
        "لأن كل تفصيلة صغيرة فيك مميزة.",
        "لأنك تمنحني شعوراً جميلاً.",
        "لأنك تضحك على نكاتي حتى لو لم تكن مضحكة!",
        "لأن المستقبل يبدو أجمل بالأمل.",
        "لأنك تقبلني كما أنا.",
        "لأن وجودك يجعل اللحظات أجمل.",
        "لأن دعواتك لي تعني الكثير.",
        "لأنك أول فكرة جميلة في يومي.",
        "لأنك شخص مميز في حياتي."
    ];

    let reasonIndex = 0;

    const reasonDisplay = $("#reason-display");
    const reasonNum = $("#reason-num");
    const reasonContent = $("#reason-content");
    const nextReasonBtn = $("#next-reason-btn");

    on(nextReasonBtn, "click", () => {
        reasonIndex = (reasonIndex + 1) % reasonsList.length;

        if (reasonNum) {
            reasonNum.textContent = `السبب #${reasonIndex + 1}`;
        }

        if (reasonContent) {
            reasonContent.textContent = `"${reasonsList[reasonIndex]}"`;
        }

        if (reasonDisplay) {
            reasonDisplay.animate(
                [
                    { opacity: 0, transform: "translateY(10px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ],
                { duration: 350 }
            );
        }
    });

    /* =========================================
       13. PHOTO GALLERY
    ========================================= */

    const photoModal = $("#photo-modal");
    const lightboxImg = $("#lightbox-img");
    const lightboxCaption = $("#lightbox-caption");

    const photoUpload = $("#custom-photo-upload");
    const galleryGrid = $("#gallery-grid");

    window.viewPhoto = function(card) {
        if (!card || !photoModal) return;

        const img = card.querySelector("img");
        const caption = card.querySelector(".polaroid-caption h4");

        if (!img) return;

        if (lightboxImg) lightboxImg.src = img.src;

        if (lightboxCaption) {
            lightboxCaption.textContent = caption?.textContent || "";
        }

        photoModal.classList.add("active");
    };

    window.closePhotoModal = () => {
        photoModal?.classList.remove("active");
    };

    function renderUserPhotos() {
        if (!galleryGrid) return;

        galleryGrid.querySelectorAll("[data-user-photo]").forEach(card => {
            card.remove();
        });

        STATE.userPhotos.forEach(photo => {
            const card = document.createElement("div");

            card.className = "polaroid-card glass-panel";
            card.dataset.userPhoto = "true";

            card.innerHTML = `
                <div class="polaroid-pin">🌹</div>
                <div class="polaroid-img-wrap">
                    <img alt="صورة خاصة">
                </div>
                <div class="polaroid-caption">
                    <h4>ذكرى خاصة</h4>
                    <span>لحظة جميلة ❤️</span>
                </div>
            `;

            card.querySelector("img").src = photo;

            card.addEventListener("click", () => {
                window.viewPhoto(card);
            });

            galleryGrid.appendChild(card);
        });
    }

    on(photoUpload, "change", event => {
        const file = event.target.files?.[0];

        if (!file || !file.type.startsWith("image/")) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("حجم الصورة كبير. اختر صورة أقل من 2 ميجابايت.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            STATE.userPhotos.push(reader.result);

            if (STATE.userPhotos.length > 10) {
                STATE.userPhotos.shift();
            }

            save("love_custom_photos", STATE.userPhotos);

            renderUserPhotos();
            burstHearts();
        };

        reader.readAsDataURL(file);

        event.target.value = "";
    });

    renderUserPhotos();

    /* =========================================
       14. DAILY FORTUNE
    ========================================= */

    const fortuneMessages = [
        "🌸 رسالة اليوم: أتمنى أن يكون يومك مليئاً بالفرح.",
        "🌹 رسالة اليوم: ابتسامتك تجعل كل شيء أجمل.",
        "✨ رسالة اليوم: لا تنسي أن تمنحي نفسك وقتاً للسعادة.",
        "💌 رسالة اليوم: أنتِ تستحقين كل الأشياء الجميلة.",
        "🕊️ رسالة اليوم: أتمنى لكِ أياماً هادئة ومليئة بالخير."
    ];

    const fortuneBtn = $("#fortune-btn");
    const fortuneBox = $("#fortune-box");

    on(fortuneBtn, "click", () => {
        if (fortuneBox) {
            fortuneBox.textContent = random(fortuneMessages);
        }
    });

    /* =========================================
       15. COMPATIBILITY BUTTON
    ========================================= */

    const calcCompatBtn = $("#calc-compat-btn");
    const compatBox = $("#compat-box");

    on(calcCompatBtn, "click", () => {
        const name1 = $("#name1")?.value.trim() || "أنا";
        const name2 = $("#name2")?.value.trim() || "أنتِ";

        if (compatBox) {
            compatBox.textContent =
                `💖 ${name1} و ${name2} .. أجمل شيء هو الاحترام والتفاهم بينكما.`;
        }

        burstHearts();
    });

    /* =========================================
       16. MOBILE NAVIGATION
    ========================================= */

    const mobileMenuBtn = $("#mobile-menu-btn");
    const navLinks = $("#nav-links");

    on(mobileMenuBtn, "click", () => {
        navLinks?.classList.toggle("mobile-open");
    });

    $$(".nav-link").forEach(link => {
        on(link, "click", () => {
            navLinks?.classList.remove("mobile-open");

            $$(".nav-link").forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    /* =========================================
       17. RELOCK BUTTON
    ========================================= */

    on($("#relock-btn"), "click", () => {
        pauseMusic();

        // غيّر login.html لو صفحة كلمة المرور عندك باسم مختلف
        window.location.href = "login.html";
    });

    /* =========================================
       18. CLOSE MODALS WITH ESCAPE
    ========================================= */

    on(document, "keydown", event => {
        if (event.key === "Escape") {
            window.closeLetterModal();
            window.closeWriteModal();
            window.closePhotoModal();
        }
    });

    /* =========================================
       19. INITIALIZATION
    ========================================= */

    console.log("Love Website JavaScript Loaded Successfully ❤️");

});