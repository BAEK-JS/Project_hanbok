// Load product images from localStorage
function loadProductImages() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const savedImage = localStorage.getItem(productId);
        
        if (savedImage) {
            const imageContainer = card.querySelector('.product-image');
            const placeholder = imageContainer.querySelector('.image-placeholder');
            
            // Create img element
            const img = document.createElement('img');
            img.src = savedImage;
            img.alt = placeholder.getAttribute('data-default-text');
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            // Replace placeholder with image
            placeholder.innerHTML = '';
            placeholder.appendChild(img);
        }
    });
}

// Load About section image
function loadAboutImage() {
    const aboutImage = document.getElementById('aboutImage');
    if (aboutImage) {
        const savedImage = localStorage.getItem('about-image');
        
        if (savedImage) {
            const img = document.createElement('img');
            img.src = savedImage;
            img.alt = aboutImage.getAttribute('data-default-text');
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            aboutImage.innerHTML = '';
            aboutImage.appendChild(img);
        }
    }
}

// Load Main Gallery images
function loadMainGallery() {
    const galleryGrid = document.getElementById('mainGalleryGrid');
    const emptyMessage = document.getElementById('emptyGalleryMessage');
    
    if (!galleryGrid) return;
    
    const savedGallery = localStorage.getItem('main-gallery');
    
    if (savedGallery) {
        const images = JSON.parse(savedGallery);
        
        if (images.length > 0) {
            galleryGrid.innerHTML = '';
            images.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <div class="image-placeholder">
                        <img src="${image.src}" alt="갤러리 이미지 ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `;
                galleryGrid.appendChild(item);
            });
            if (emptyMessage) emptyMessage.style.display = 'none';
        } else {
            galleryGrid.innerHTML = '';
            if (emptyMessage) emptyMessage.style.display = 'block';
        }
    } else {
        galleryGrid.innerHTML = '';
        if (emptyMessage) emptyMessage.style.display = 'block';
    }
}

// Navigation functionality
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.product-card, .gallery-item, .feature-item, .info-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contact form handling with KakaoTalk
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const phone = contactForm.querySelector('input[name="phone"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // Simple validation
        if (!name || !email || !phone || !message) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 주소를 입력해주세요.');
            return;
        }
        
        // Create KakaoTalk message
        const kakaoMessage = `[보은한복 문의]\n\n이름: ${name}\n이메일: ${email}\n전화번호: ${phone}\n\n문의 내용:\n${message}`;
        
        // Open KakaoTalk with pre-filled message
        // 카카오톡 채널 또는 개인 카카오톡으로 문의 전송
        // 실제 사용 시 카카오톡 채널 URL을 설정해야 합니다
        sendToKakaoTalk(kakaoMessage, name, email, phone, message);
    });
}

// KakaoTalk 문의 전송 함수
function sendToKakaoTalk(fullMessage, name, email, phone, message) {
    // 방법 1: 카카오톡 채널로 이동 (실제 채널 URL 필요)
    // const kakaoChannelUrl = 'http://pf.kakao.com/_your_channel_id/chat';
    
    // 방법 2: 카카오톡 공유하기 (메시지 복사)
    if (navigator.share) {
        navigator.share({
            title: '보은한복 문의',
            text: fullMessage
        }).then(() => {
            alert('문의 내용이 준비되었습니다. 카카오톡에서 전송해주세요.');
            contactForm.reset();
        }).catch((error) => {
            console.log('공유 실패:', error);
            fallbackKakaoTalk(fullMessage);
        });
    } else {
        fallbackKakaoTalk(fullMessage);
    }
}

// 대체 방법: 클립보드에 복사 후 카카오톡 열기
function fallbackKakaoTalk(message) {
    // 클립보드에 복사
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).then(() => {
            // 카카오톡 모바일 앱 열기 시도
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
                // 모바일: 카카오톡 앱 열기
                window.location.href = 'kakaotalk://';
                
                setTimeout(() => {
                    alert('문의 내용이 복사되었습니다.\n\n카카오톡을 열고 "보은한복"으로 검색하여\n복사된 내용을 붙여넣기 해주세요.');
                }, 1000);
            } else {
                // PC: 카카오톡 PC 버전 열기 또는 안내
                alert('문의 내용이 복사되었습니다.\n\n카카오톡을 열고 "보은한복"으로 검색하여\n복사된 내용을 붙여넣기(Ctrl+V) 해주세요.\n\n또는 전화(02-1234-5678)로 문의 부탁드립니다.');
            }
            
            contactForm.reset();
        }).catch((err) => {
            // 클립보드 복사 실패
            showKakaoModal(message);
        });
    } else {
        // 클립보드 API 미지원
        showKakaoModal(message);
    }
}

// 모달로 메시지 표시
function showKakaoModal(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    content.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #c41e3a;">문의 내용</h3>
        <p style="margin-bottom: 15px; color: #666;">아래 내용을 복사하여 카카오톡으로 보내주세요:</p>
        <textarea readonly style="
            width: 100%;
            height: 200px;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-family: 'Noto Sans KR', sans-serif;
            resize: none;
            margin-bottom: 20px;
        ">${message}</textarea>
        <div style="display: flex; gap: 10px;">
            <button onclick="copyToClipboard(this)" style="
                flex: 1;
                padding: 12px;
                background: #c41e3a;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">복사하기</button>
            <button onclick="this.closest('.modal-kakao').remove()" style="
                flex: 1;
                padding: 12px;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">닫기</button>
        </div>
    `;
    
    modal.className = 'modal-kakao';
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    contactForm.reset();
}

// 카카오톡 채널 링크 클릭
const kakaoChannelLink = document.getElementById('kakaoChannelLink');
if (kakaoChannelLink) {
    kakaoChannelLink.addEventListener('click', () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // 모바일: 카카오톡 앱 열기
            window.location.href = 'kakaotalk://';
            setTimeout(() => {
                alert('카카오톡 앱이 열립니다.\n"보은한복"을 검색하여 문의해주세요.');
            }, 500);
        } else {
            // PC: 안내 메시지
            alert('카카오톡 PC 버전에서 "보은한복"을 검색하여 문의해주세요.\n\n또는 전화(02-1234-5678)로 문의 부탁드립니다.');
        }
    });
}

// 복사 함수
window.copyToClipboard = function(button) {
    const textarea = button.parentElement.previousElementSibling;
    textarea.select();
    document.execCommand('copy');
    
    const originalText = button.textContent;
    button.textContent = '복사완료!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#c41e3a';
    }, 2000);
}

// Gallery lightbox effect (simple implementation)
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // You can implement a lightbox here
        console.log('Gallery item clicked');
    });
});

// Product card hover effect enhancement
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add active class to first nav link on page load
if (window.location.hash) {
    const hash = window.location.hash;
    navLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });
} else {
    navLinks[0].classList.add('active');
}

// Load product images, about image, and main gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProductImages();
    loadAboutImage();
    loadMainGallery();
});
