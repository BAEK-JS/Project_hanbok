// Product data
const products = {
    'product-1': {
        name: '전통 한복',
        description: '명절과 특별한 날을 위한 전통 한복'
    },
    'product-2': {
        name: '생활한복',
        description: '일상에서 편하게 입을 수 있는 생활한복'
    },
    'product-3': {
        name: '웨딩한복',
        description: '결혼식을 위한 특별한 웨딩한복'
    },
    'product-4': {
        name: '아동한복',
        description: '아이들을 위한 귀여운 한복'
    }
};

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product');

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Load product info and gallery
function loadGallery() {
    if (!productId || !products[productId]) {
        window.location.href = 'index.html#products';
        return;
    }

    const product = products[productId];
    
    // Set product info
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.title = `${product.name} 갤러리 - 보은한복`;

    // Load gallery images from localStorage
    const galleryKey = `${productId}-gallery`;
    const savedGallery = localStorage.getItem(galleryKey);
    
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyGallery = document.getElementById('emptyGallery');

    if (savedGallery) {
        const images = JSON.parse(savedGallery);
        
        if (images.length > 0) {
            galleryGrid.innerHTML = '';
            images.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item-full';
                item.innerHTML = `
                    <img src="${image.src}" alt="${product.name} ${index + 1}">
                    <div class="gallery-item-overlay">
                        <p class="gallery-item-title">${product.name} ${index + 1}</p>
                    </div>
                `;
                item.addEventListener('click', () => openLightbox(index));
                galleryGrid.appendChild(item);
            });
            emptyGallery.style.display = 'none';
        } else {
            galleryGrid.innerHTML = '';
            emptyGallery.style.display = 'block';
        }
    } else {
        galleryGrid.innerHTML = '';
        emptyGallery.style.display = 'block';
    }
}

// Lightbox functionality
let currentImageIndex = 0;
let galleryImages = [];

function openLightbox(index) {
    const galleryKey = `${productId}-gallery`;
    const savedGallery = localStorage.getItem(galleryKey);
    
    if (savedGallery) {
        galleryImages = JSON.parse(savedGallery);
        currentImageIndex = index;
        showImage();
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showImage() {
    if (galleryImages.length > 0) {
        const product = products[productId];
        document.getElementById('lightboxImage').src = galleryImages[currentImageIndex].src;
        document.getElementById('lightboxCaption').textContent = 
            `${product.name} ${currentImageIndex + 1} / ${galleryImages.length}`;
    }
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage();
}

// Event listeners for lightbox
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-next').addEventListener('click', nextImage);
document.querySelector('.lightbox-prev').addEventListener('click', prevImage);

// Close lightbox when clicking outside image
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    }
});

// Load gallery on page load
loadGallery();
