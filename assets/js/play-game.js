const INACTIVITY_TIME = 10000;

AFRAME.registerComponent('nurikabe-interaction', {
    init: function () {
        const el = this.el;
        let lastClickTime = 0;
        const DOUBLE_TAP_THRESHOLD = 300;
        let inactivityTimer;

        el.addEventListener('click', (evt) => {
            console.log('ぬりかべさんがクリックされました！');
            this.playLaughSound();
            this.resetInactivityTimer();
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < DOUBLE_TAP_THRESHOLD) {
                this.handleDoubleClick();
            }
            lastClickTime = currentTime;
        });

        el.addEventListener('mousedown', () => {
            console.log('ぬりかべさんがドラッグされました！');
            el.setAttribute('animation__drag', {
                property: 'position',
                to: '0 1 -2.05',
                dir: 'alternate',
                dur: 100,
                easing: 'easeInQuad'
            });
            this.playRandomTouchSound();
            this.resetInactivityTimer();
        });

        el.addEventListener('mouseup', () => {
            el.removeAttribute('animation__drag');
        });

        const head = document.getElementById('nurikabe-head');
        const body = document.getElementById('nurikabe-body');
        const foot = document.getElementById('nurikabe-foot');

        if (head) {
            head.addEventListener('click', () => {
                this.playSound('water-sound', 0.5);
                this.resetInactivityTimer();
            });
        }
        if (body) {
            body.addEventListener('click', () => {
                this.playSound('bell-sound', 0.7);
                this.resetInactivityTimer();
            });
        }
        if (foot) {
            foot.addEventListener('click', () => {
                this.playSound('small-bell-sound', 0.6);
                this.resetInactivityTimer();
            });
        }

        this.startInactivityTimer();

        const gameStartButton = document.getElementById('game-start-button');
        const sceneEl = document.querySelector('a-scene');

        if (gameStartButton && sceneEl) {
            gameStartButton.addEventListener('click', () => {
                sceneEl.requestFullscreen();
            });
        }
    },
    
    playLaughSound: function () {
        this.playSound('laugh-sound', 0.1); // 0.1という音量引数を明示的に渡す　音量変更
    },

    playRandomTouchSound: function () {
        const sounds = ['laugh-sound', 'small-bell-sound'];
        const randomSoundId = sounds[Math.floor(Math.random() * sounds.length)];
        this.playSound(randomSoundId);
    },

    playSound: function (id, volume = 0.1) {
        const soundEl = document.getElementById(id);
        if (soundEl) {
            soundEl.currentTime = 0;
            soundEl.volume = volume;
            soundEl.play();
        }
    },

    handleDoubleClick: function () {
        const el = this.el;
        el.setAttribute('animation__roll', {
            property: 'rotation',
            to: '0 0 90',
            dur: 800,
            easing: 'easeOutQuad'
        });
        setTimeout(() => {
            el.setAttribute('animation__unroll', {
                property: 'rotation',
                to: '0 0 0',
                dur: 800,
                easing: 'easeOutQuad'
            });
        }, 2000);
    },

    startInactivityTimer: function () {
        this.inactivityTimer = setTimeout(() => {
            this.playYawnAnimation();
        }, INACTIVITY_TIME);
    },

    resetInactivityTimer: function () {
        clearTimeout(this.inactivityTimer);
        this.startInactivityTimer();
    },

    playYawnAnimation: function () {
        const el = this.el;
        this.playSound('yawn-sound');
        el.setAttribute('animation__yawn_scale', {
            property: 'scale',
            to: '1.05 1.05 1.05',
            dir: 'alternate',
            dur: 500,
            easing: 'easeInQuad',
            loop: true
        });
        setTimeout(() => {
            el.removeAttribute('animation__yawn_scale');
            el.setAttribute('scale', '1 1 1');
        }, 2000);
    }
});