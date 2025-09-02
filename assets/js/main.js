document.addEventListener('DOMContentLoaded', () => {
    // スクロール時のフェードインを管理するIntersection Observer
    const fadeInElements = document.querySelectorAll('.fade-in-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeInElements.forEach(el => observer.observe(el));

    // 「ひみつ」項目のインタラクション（マウスオーバー/タップでぷるぷる）
    const secretItem = document.querySelector('.secret-item');
    if (secretItem) {
        secretItem.addEventListener('mouseenter', () => {
            // CSSの:hoverにアニメーションを任せる
        });
        secretItem.addEventListener('touchstart', () => {
            secretItem.classList.toggle('is-tapped');
        });
    }

    // ハンバーガーメニューの開閉機能
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.site-nav');

    if(hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
            hamburgerBtn.classList.toggle('is-active');
        });
    }
});