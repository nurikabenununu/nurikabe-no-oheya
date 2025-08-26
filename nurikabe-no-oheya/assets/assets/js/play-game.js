// assets/js/play-game.js
// 「あそびば」ページ専用のA-Frameカスタムコンポーネント

// A-Frameライブラリが読み込まれていることを前提とします
// <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>

// nurikabe-interactionカスタムコンポーネントを登録
AFRAME.registerComponent('nurikabe-interaction', {
    // コンポーネントの初期化
    init: function () {
        const el = this.el; // ぬりかべさんのメインエンティティ
        
        // インタラクション判定用の変数
        let lastClickTime = 0;
        const DOUBLE_TAP_THRESHOLD = 300; // ダブルタップ判定の閾値 (ms)
        let inactivityTimer;
        const INACTIVITY_TIME = 10000; // 非活動状態と判定する時間 (10秒)

        // 3Dモデルにマウスダウン/クリックイベントを付与
        el.addEventListener('click', (evt) => {
            console.log('ぬりかべさんがクリックされました！');
            this.playLaughSound(); // 笑い声の再生
            this.resetInactivityTimer(); // 非活動タイマーのリセット

            // ダブルタップ判定
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < DOUBLE_TAP_THRESHOLD) {
                this.handleDoubleClick();
            }
            lastClickTime = currentTime;
        });

        // ドラッグ（マウスダウンとマウスアップ）イベントを付与
        el.addEventListener('mousedown', () => {
            console.log('ぬりかべさんがドラッグされました！');
            // ドラッグ中のリアクション（例: 揺れるアニメーション）
            el.setAttribute('animation__drag', {
                property: 'position',
                to: '0 1 -2.05', // 少し奥に引っ込む
                dir: 'alternate',
                dur: 100,
                easing: 'easeInQuad'
            });
            // 触覚的なフィードバックのサウンドを再生
            this.playRandomTouchSound();
            this.resetInactivityTimer();
        });

        el.addEventListener('mouseup', () => {
            // ドラッグ終了時のアニメーションを元に戻す
            el.removeAttribute('animation__drag');
        });
        
        // --- 触れる場所によるサウンドの演出 ---
        // 3Dモデルがパーツごとに分割されていることを想定し、それぞれのパーツにイベントを設定
        const head = document.getElementById('nurikabe-head');
        const body = document.getElementById('nurikabe-body');
        const foot = document.getElementById('nurikabe-foot');

        if (head) {
            head.addEventListener('click', () => {
                console.log('頭を触った！');
                this.playSound('water-sound'); // 水のせせらぎ
                this.resetInactivityTimer();
            });
        }
        if (body) {
            body.addEventListener('click', () => {
                console.log('お腹を触った！');
                this.playSound('bell-sound'); // 風鈴の音
                this.resetInactivityTimer();
            });
        }
        if (foot) {
            foot.addEventListener('click', () => {
                console.log('足を触った！');
                this.playSound('small-bell-sound'); // 小さな鈴の音
                this.resetInactivityTimer();
            });
        }

        // 非活動タイマーの初期設定
        this.startInactivityTimer();
    },

    // ぬりかべさんが笑うサウンドを再生
    playLaughSound: function () {
        const soundEl = document.getElementById('laugh-sound');
        if (soundEl) {
            soundEl.currentTime = 0; // 最初から再生
            soundEl.play();
        }
    },

    // ランダムなタッチサウンド（「くすぐったいよ〜」など）を再生
    playRandomTouchSound: function () {
        const sounds = ['laugh-sound', 'small-bell-sound']; // 例
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

    // --- インタラクションの多様化 ---
    // ダブルタップ時の処理（寝転がるアニメーション）
    handleDoubleClick: function () {
        const el = this.el;
        console.log('ダブルタップされました！ぬりかべさんが寝転がります。');
        
        el.setAttribute('animation__roll', {
            property: 'rotation',
            to: '0 0 90', // 横に寝転がる
            dur: 800,
            easing: 'easeOutQuad'
        });

        // 一定時間後に元に戻す
        setTimeout(() => {
            el.setAttribute('animation__unroll', {
                property: 'rotation',
                to: '0 0 0',
                dur: 800,
                easing: 'easeOutQuad'
            });
        }, 2000); // 2秒後に元に戻る
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
        
        this.playSound('yawn-sound'); // あくびサウンド

        el.setAttribute('animation__yawn_scale', {
            property: 'scale',
            to: '1.05 1.05 1.05', // 少し膨らむ
            dir: 'alternate',
            dur: 500,
            easing: 'easeInQuad',
            loop: true
        });

        // 2秒後にアニメーションを停止
        setTimeout(() => {
            el.removeAttribute('animation__yawn_scale');
            el.setAttribute('scale', '1 1 1'); // スケールを元に戻す
        }, 2000);
    }
});