/* =========================================
   ELEMENTS
========================================= */

const introScreen = document.getElementById("introScreen");
const questionScreen = document.getElementById("questionScreen");
const transitionScreen = document.getElementById("transitionScreen");
const cardsScreen = document.getElementById("cardsScreen");
const photoScreen = document.getElementById("photoScreen");
const finalScreen = document.getElementById("finalScreen");

const startBtn = document.getElementById("startBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const funnyText = document.getElementById("funnyText");
const counter = document.getElementById("counter");

const cardStack = document.getElementById("cardStack");
const cards = [...document.querySelectorAll(".love-card")];
const cardProgress = document.getElementById("cardProgress");

const particleContainer = document.getElementById("particles");

const song = document.getElementById("loveSong");
const musicBtn = document.getElementById("musicBtn");


/* =========================================
   STATE
========================================= */

let noAttempts = 0;
let currentCard = 0;

let startX = 0;
let currentX = 0;
let dragging = false;

let musicStarted = false;
let finishingCards = false;

let heartTimer = null;


/* =========================================
   SCREEN SWITCHER
========================================= */

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");

    if (screen === questionScreen) {

        noBtn.style.display = "block";

    } else {

        noBtn.style.display = "none";

    }

}


/* =========================================
   START
========================================= */

startBtn.addEventListener("click", () => {

    showScreen(questionScreen);

    requestAnimationFrame(() => {

        document.body.appendChild(noBtn);

        noBtn.style.position = "fixed";
        noBtn.style.display = "block";
        noBtn.style.zIndex = "9999";
        noBtn.style.left = "";
        noBtn.style.top = "";
        noBtn.style.transform = "none";

        const yesRect = yesBtn.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();

        const gap = 18;
        const padding = 20;

        let x = yesRect.right + gap;
        let y = yesRect.top;

        if (
            x + noRect.width >
            window.innerWidth - padding
        ) {

            x =
                yesRect.left -
                noRect.width -
                gap;

        }

        x = Math.max(
            padding,
            Math.min(
                x,
                window.innerWidth -
                noRect.width -
                padding
            )
        );

        y = Math.max(
            padding,
            Math.min(
                y,
                window.innerHeight -
                noRect.height -
                padding
            )
        );

        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;

    });

});


/* =========================================
   NO BUTTON
========================================= */

const funnyMessages = [
    "Nice try 😂",
    "You really thought NO would work? 😭",
    "The button has escaped. 🏃‍♂️💨",
    "Why are you chasing it?! 😂",
    "NO button.exe has stopped cooperating 💀",
    "Girl, just press YES 😭❤️",
    "That button clearly doesn't want to be clicked 😂",
    "Almost! ...SIKE 💀",
    "Still trying? I admire the commitment 😂",
    "The NO button has trust issues 😭",
    "Maybe take the hint? 👀",
    "NO is currently on vacation 🏖️😂",
    "Okay this is getting embarrassing for both of us 😭",
    "Fine. Keep chasing it. I'll wait. 😌",
    "You vs. one button. And the button is winning. 💀",
    "At this point YES is literally waving at you 👋😂"
];


function escapeNoButton() {

    if (!questionScreen.classList.contains("active")) {
        return;
    }

    noAttempts++;

    counter.textContent = noAttempts;

    funnyText.textContent =
        funnyMessages[
            (noAttempts - 1) %
            funnyMessages.length
        ];

    moveNoButton();

}


function moveNoButton() {

    noBtn.style.position = "fixed";

    const rect = noBtn.getBoundingClientRect();

    const padding = 20;

    const maxX =
        window.innerWidth -
        rect.width -
        padding;

    const maxY =
        window.innerHeight -
        rect.height -
        padding;

    const x =
        padding +
        Math.random() *
        Math.max(0, maxX - padding);

    const y =
        padding +
        Math.random() *
        Math.max(0, maxY - padding);

    const rotation =
        Math.random() * 16 - 8;

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.transform = `rotate(${rotation}deg)`;

}


/* Desktop */

noBtn.addEventListener("mouseenter", escapeNoButton);


/* Touch */

noBtn.addEventListener("touchstart", event => {

    event.preventDefault();

    escapeNoButton();

}, { passive: false });


/* Click fallback */

noBtn.addEventListener("click", event => {

    event.preventDefault();

    escapeNoButton();

});


/* =========================================
   YES BUTTON
========================================= */

yesBtn.addEventListener("click", () => {

    noBtn.style.display = "none";

    createHeartExplosion();

    document.body.classList.add("shake");

    setTimeout(() => {

        document.body.classList.remove("shake");

        showScreen(transitionScreen);

    }, 550);


    setTimeout(() => {

        showScreen(cardsScreen);

        updateCards();

    }, 2300);

});


/* =========================================
   FLOATING HEARTS
========================================= */

const heartSymbols = [
    "💗",
    "💕",
    "💖",
    "💘",
    "💝",
    "💓",
    "❤️"
];


function createHeart() {

    const heart = document.createElement("span");

    heart.className = "heart-particle";

    heart.textContent =
        heartSymbols[
            Math.floor(
                Math.random() *
                heartSymbols.length
            )
        ];

    heart.style.left =
        `${Math.random() * 100}%`;

    heart.style.fontSize =
        `${14 + Math.random() * 20}px`;

    heart.style.animationDuration =
        `${7 + Math.random() * 5}s`;

    heart.style.setProperty(
        "--drift",
        `${Math.random() * 140 - 70}px`
    );

    particleContainer.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 13000);

}


/*
   Much lighter background effect.
   1 heart every 1.2 seconds.
*/

function startFloatingHearts() {

    if (heartTimer) {
        return;
    }

    heartTimer =
        setInterval(createHeart, 1200);

}


/*
   Only a few initial hearts.
*/

function initialHearts() {

    for (let i = 0; i < 8; i++) {

        setTimeout(
            createHeart,
            i * 250
        );

    }

}

initialHearts();
startFloatingHearts();


/* =========================================
   HEART EXPLOSION
========================================= */

function createHeartExplosion() {

    /*
       Reduced from 65 → 30.
       Still looks dramatic but uses
       much less CPU/GPU.
    */

    const fragment = document.createDocumentFragment();

    const hearts = [];

    for (let i = 0; i < 30; i++) {

        const heart =
            document.createElement("span");

        heart.textContent = "💗";

        heart.style.position = "fixed";
        heart.style.left = "50%";
        heart.style.top = "50%";
        heart.style.zIndex = "100";
        heart.style.pointerEvents = "none";

        heart.style.fontSize =
            `${15 + Math.random() * 22}px`;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            120 +
            Math.random() *
            350;

        const x =
            Math.cos(angle) *
            distance;

        const y =
            Math.sin(angle) *
            distance;

        fragment.appendChild(heart);

        hearts.push({
            element: heart,
            x,
            y
        });

    }

    document.body.appendChild(fragment);

    hearts.forEach(item => {

        const animation =
            item.element.animate(
                [
                    {
                        transform:
                            "translate(-50%, -50%) scale(0.3)",
                        opacity: 1
                    },

                    {
                        transform:
                            `translate(
                                calc(-50% + ${item.x}px),
                                calc(-50% + ${item.y}px)
                            )
                            scale(1.4)`,
                        opacity: 0
                    }
                ],
                {
                    duration:
                        850 +
                        Math.random() * 450,

                    easing:
                        "cubic-bezier(.2,.8,.2,1)",

                    fill: "forwards"
                }
            );

        animation.onfinish = () => {

            item.element.remove();

        };

    });

}


/* =========================================
   CARD STACK
========================================= */

function updateCards() {

    cards.forEach((card, index) => {

        const position =
            index - currentCard;

        if (position < 0) {

            card.style.opacity = "0";
            card.style.pointerEvents = "none";

            return;
        }

        card.style.pointerEvents =
            position === 0
                ? "auto"
                : "none";

        card.style.opacity =
            Math.max(
                0,
                1 - position * 0.2
            );

        card.style.transform =
            `translateY(${position * 12}px)
             scale(${1 - position * 0.05})
             rotate(${position * 1.2}deg)`;

        card.style.zIndex =
            cards.length - position;

    });

    cardProgress.textContent =
        Math.min(
            currentCard + 1,
            cards.length
        );

}


/* =========================================
   SWIPE CARD
========================================= */

function swipeCard(direction) {

    if (currentCard >= cards.length) {

        finishCards();

        return;

    }

    const card =
        cards[currentCard];

    card.style.transition =
        "transform .45s ease, opacity .45s ease";

    card.style.transform =
        `translate(${direction * 120}vw, -30px)
         rotate(${direction * 30}deg)`;

    card.style.opacity = "0";

    currentCard++;

    setTimeout(() => {

        updateCards();

        if (currentCard >= cards.length) {

            setTimeout(
                finishCards,
                650
            );

        }

    }, 300);

}


/* =========================================
   FINISH CARDS
========================================= */

function finishCards() {

    if (finishingCards) {
        return;
    }

    finishingCards = true;

    showScreen(photoScreen);

    setTimeout(() => {

        showScreen(finalScreen);

    }, 15000);

}


/* =========================================
   POINTER DRAG
========================================= */

cardStack.addEventListener(
    "pointerdown",
    event => {

        if (currentCard >= cards.length) {
            return;
        }

        dragging = true;

        startX = event.clientX;
        currentX = startX;

        const card =
            cards[currentCard];

        card.classList.add("swiping");

        cardStack.setPointerCapture(
            event.pointerId
        );

    }
);


cardStack.addEventListener(
    "pointermove",
    event => {

        if (!dragging) {
            return;
        }

        currentX = event.clientX;

        const delta =
            currentX - startX;

        const card =
            cards[currentCard];

        if (!card) {
            return;
        }

        card.style.transform =
            `translateX(${delta}px)
             rotate(${delta * 0.08}deg)`;

        card.style.opacity =
            Math.max(
                0.55,
                1 - Math.abs(delta) / 500
            );

    }
);


function endDrag() {

    if (!dragging) {
        return;
    }

    dragging = false;

    const delta =
        currentX - startX;

    const card =
        cards[currentCard];

    if (!card) {
        return;
    }

    card.classList.remove("swiping");

    if (Math.abs(delta) > 100) {

        swipeCard(
            delta > 0 ? 1 : -1
        );

    } else {

        updateCards();

    }

}


cardStack.addEventListener(
    "pointerup",
    endDrag
);

cardStack.addEventListener(
    "pointercancel",
    endDrag
);


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !cardsScreen.classList.contains("active")
        ) {
            return;
        }

        if (event.key === "ArrowRight") {
            swipeCard(1);
        }

        if (event.key === "ArrowLeft") {
            swipeCard(-1);
        }

    }
);


/* =========================================
   MUSIC
========================================= */

function startMusic() {

    if (musicStarted) {
        return;
    }

    song.volume = 0;

    const playPromise =
        song.play();

    if (!playPromise) {
        return;
    }

    playPromise
        .then(() => {

            musicStarted = true;

            let volume = 0;

            const fade =
                setInterval(() => {

                    volume += 0.05;

                    song.volume =
                        Math.min(
                            volume,
                            0.75
                        );

                    if (volume >= 0.75) {

                        clearInterval(fade);

                    }

                }, 100);

        })
        .catch(() => {

            musicBtn.textContent =
                "🎵 Tap to play our song";

        });

}


/* =========================================
   PHOTO SCREEN
========================================= */

let previousPhotoState = false;

function checkPhotoScreen() {

    const isActive =
        photoScreen.classList.contains("active");

    if (
        isActive &&
        !previousPhotoState
    ) {

        setTimeout(
            startMusic,
            900
        );

    }

    previousPhotoState =
        isActive;

}


/*
   Instead of MutationObserver,
   check only when a screen changes.
*/

const originalShowScreen = showScreen;


/* =========================================
   MUSIC BUTTON
========================================= */

musicBtn.addEventListener(
    "click",
    async () => {

        if (song.paused) {

            try {

                song.volume = 0.75;

                await song.play();

                musicStarted = true;

                musicBtn.textContent =
                    "⏸ Pause our song";

            } catch (error) {

                musicBtn.textContent =
                    "🎵 Tap again to play";

            }

        } else {

            song.pause();

            musicBtn.textContent =
                "🎵 Our song";

        }

    }
);


/* =========================================
   WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            !questionScreen.classList.contains("active") ||
            noBtn.style.display === "none"
        ) {
            return;
        }

        const rect =
            noBtn.getBoundingClientRect();

        const padding = 20;

        let x =
            parseFloat(noBtn.style.left) ||
            padding;

        let y =
            parseFloat(noBtn.style.top) ||
            padding;

        x = Math.max(
            padding,
            Math.min(
                x,
                window.innerWidth -
                rect.width -
                padding
            )
        );

        y = Math.max(
            padding,
            Math.min(
                y,
                window.innerHeight -
                rect.height -
                padding
            )
        );

        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;

    }
);


/* =========================================
   INITIAL STATE
========================================= */

updateCards();

console.log(
    "❤️ Love website optimized and loaded!"
);