// assets/js/play-game.js
// 「あそびば」ページ専用のA-Frameカスタムコンポーネント

// A-Frameライブラリが読み込まれていることを前提とします
// <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>

const INACTIVITY_TIME = 10000; // 10秒

// nurikabe-interactionカスタムコンポーネントを登録
AFRAME.registerComponent('nurikabe-interaction', {
    init: function () {
        const el = this.el; // ぬりかべさんのメインエンティティ
        
        let lastClickTime = 0;
        const DOUBLE_TAP_THRESHOLD = 300;
        let inactivityTimer;

        // 3Dモデルにマウスダウン/クリックイベントを付与
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

        // ドラッグ（マウスダウンとマウスアップ）イベントを付与
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
        
        // --- 触れる場所によるサウンドの演出 ---
        const head = document.getElementById('nurikabe-head');
        const body = document.getElementById('nurikabe-body');
        const foot = document.getElementById('nurikabe-foot');

        if (head) {
            head.addEventListener('click', () => {
                console.log('頭を触った！');
                this.playSound('water-sound');
                this.resetInactivityTimer();
            });
        }
        if (body) {
            body.addEventListener('click', () => {
                console.log('お腹を触った！');
                this.playSound('bell-sound');
                this.resetInactivityTimer();
            });
        }
        if (foot) {
            foot.addEventListener('click', () => {
                console.log('足を触った！');
                this.playSound('small-bell-sound');
                this.resetInactivityTimer();
            });
        }

        this.startInactivityTimer();
        
        // 全画面表示ボタンのイベントリスナーを追加
        const gameStartButton = document.getElementById('game-start-button');
        const sceneEl = document.querySelector('a-scene');

        if (gameStartButton && sceneEl) {
            gameStartButton.addEventListener('click', () => {
               // ボタンのテキストを変更するギミックを削除
                sceneEl.requestFullscreen();
            });
        }
    },

    // ぬりかべさんが笑うサウンドを再生
    playLaughSound: function () {
        const soundEl = document.getElementById('laugh-sound');
        if (soundEl) {
            soundEl.currentTime = 0;
            soundEl.play();
        }
    },

    // ランダムなタッチサウンドを再生
    playRandomTouchSound: function () {
        const sounds = ['laugh-sound', 'small-bell-sound'];
        const randomSoundId = sounds[Math.floor(Math.random() * sounds.length)];
        this.playSound(randomSoundId);
    },

    // 特定のサウンドを再生するヘルパー関数
    playSound: function (id) {
        const soundEl = document.getElementById(id);
        if (soundEl) {
            soundEl.currentTime = 0;
            soundEl.play();
        }
    },

    // ダブルタップ時の処理（寝転がるアニメーション）
    handleDoubleClick: function () {
        const el = this.el;
        console.log('ダブルタップされました！ぬりかべさんが寝転がります。');
        
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

    // 非活動タイマーを開始
    startInactivityTimer: function () {
        this.inactivityTimer = setTimeout(() => {
            this.playYawnAnimation();
        }, INACTIVITY_TIME);
    },

    // 非活動タイマーをリセット
    resetInactivityTimer: function () {
        clearTimeout(this.inactivityTimer);
        this.startInactivityTimer();
    },

    // あくびアニメーションとサウンドの再生
    playYawnAnimation: function () {
        const el = this.el;
        console.log('ぬりかべさんが退屈そうにあくびをします。');
        
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