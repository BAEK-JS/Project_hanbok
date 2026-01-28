// Check if admin is logged in
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Product data
const products = [
    {
        id: 'product-1',
        name: '전통 한복',
        description: '명절과 특별한 날을 위한 전통 한복',
        price: '₩500,000 ~'
    },
    {
        id: 'product-2',
        name: '생활한복',
        description: '일상에서 편하게 입을 수 있는 생활한복',
        price: '₩300,000 ~'
    },
    {
        id: 'product-3',
        name: '웨딩한복',
        description: '결혼식을 위한 특별한 웨딩한복',
        price: '₩800,000 ~'
    },
    {
        id: 'product-4',
        name: '아동한복',
        description: '아이들을 위한 귀여운 한복',
        price: '₩200,000 ~'
    }
];

let currentProductId = null;

// Load products
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const savedImage = localStorage.getItem(product.id);
        
        const card = document.createElement('div');
        card.className = 'product-admin-card';
        card.innerHTML = `
            <div class="product-admin-image" onclick="openUploadModal('${product.id}')">
                ${savedImage 
                    ? `<img src="${savedImage}" alt="${product.name}">` 
                    : `<div class="placeholder">${product.name}</div>`
                }
                <div class="image-upload-overlay">
                    <div class="upload-icon">📷</div>
                    <div class="upload-text">이미지 업로드</div>
                </div>
            </div>
            <div class="product-admin-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-admin-actions">
                    <button class="btn btn-primary btn-small" onclick="openUploadModal('${product.id}')">
                        이미지 변경
                    </button>
                    ${savedImage 
                        ? `<button class="btn btn-outline btn-small" onclick="removeImage('${product.id}')">삭제</button>` 
                        : ''
                    }
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Open upload modal
function openUploadModal(productId) {
    currentProductId = productId;
    const product = products.find(p => p.id === productId);
    
    document.getElementById('productName').value = product.name;
    document.getElementById('imageFile').value = '';
    document.getElementById('fileName').textContent = '';
    document.getElementById('previewImage').style.display = 'none';
    document.getElementById('uploadModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('uploadModal').classList.remove('active');
    currentProductId = null;
}

// Preview image
document.getElementById('imageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('previewImage');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Upload image
function uploadImage() {
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('이미지 파일을 선택해주세요.');
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // Save to localStorage
        localStorage.setItem(currentProductId, e.target.result);
        
        // Show success message
        showSuccessMessage('이미지가 성공적으로 업로드되었습니다.');
        
        // Close modal and reload products
        closeModal();
        loadProducts();
    };
    reader.readAsDataURL(file);
}

// Remove image
function removeImage(productId) {
    if (confirm('이미지를 삭제하시겠습니까?')) {
        localStorage.removeItem(productId);
        showSuccessMessage('이미지가 삭제되었습니다.');
        loadProducts();
    }
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        window.location.href = 'admin-login.html';
    }
});

// Close modal when clicking outside
document.getElementById('uploadModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load gallery images if gallery tab is clicked
        if (tabName === 'gallery-images') {
            loadGalleryImages();
        }
    });
});

// Gallery management
let selectedGalleryFiles = [];

function openGalleryUploadModal() {
    document.getElementById('galleryUploadModal').classList.add('active');
    document.getElementById('galleryImageFile').value = '';
    document.getElementById('galleryFileNames').textContent = '';
    document.getElementById('galleryPreviewContainer').innerHTML = '';
    selectedGalleryFiles = [];
}

function closeGalleryModal() {
    document.getElementById('galleryUploadModal').classList.remove('active');
    selectedGalleryFiles = [];
}

// Preview gallery images
document.getElementById('galleryImageFile').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    selectedGalleryFiles = files;
    
    if (files.length > 0) {
        document.getElementById('galleryFileNames').textContent = 
            `${files.length}개 파일 선택됨`;
        
        const previewContainer = document.getElementById('galleryPreviewContainer');
        previewContainer.innerHTML = '';
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'gallery-preview-item';
                previewItem.innerHTML = `<img src="${e.target.result}" alt="Preview ${index + 1}">`;
                previewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }
});

// Upload gallery images
function uploadGalleryImages() {
    const productId = document.getElementById('galleryProductSelect').value;
    
    if (selectedGalleryFiles.length === 0) {
        alert('이미지 파일을 선택해주세요.');
        return;
    }

    // Check file sizes
    for (let file of selectedGalleryFiles) {
        if (file.size > 5 * 1024 * 1024) {
            alert('각 파일 크기는 5MB 이하여야 합니다.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }
    }

    // Get existing gallery
    const galleryKey = `${productId}-gallery`;
    let gallery = [];
    const savedGallery = localStorage.getItem(galleryKey);
    if (savedGallery) {
        gallery = JSON.parse(savedGallery);
    }

    // Process all files
    let processedCount = 0;
    selectedGalleryFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            gallery.push({
                src: e.target.result,
                uploadedAt: new Date().toISOString()
            });
            
            processedCount++;
            
            // Save when all files are processed
            if (processedCount === selectedGalleryFiles.length) {
                localStorage.setItem(galleryKey, JSON.stringify(gallery));
                showSuccessMessage(`${selectedGalleryFiles.length}개의 이미지가 업로드되었습니다.`);
                closeGalleryModal();
                loadGalleryImages();
            }
        };
        reader.readAsDataURL(file);
    });
}

// Load gallery images
function loadGalleryImages() {
    const productId = document.getElementById('galleryProductSelect').value;
    const galleryKey = `${productId}-gallery`;
    const savedGallery = localStorage.getItem(galleryKey);
    
    const grid = document.getElementById('galleryImagesGrid');
    grid.innerHTML = '';
    
    if (savedGallery) {
        const images = JSON.parse(savedGallery);
        
        if (images.length > 0) {
            images.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-admin-item';
                item.innerHTML = `
                    <img src="${image.src}" alt="Gallery ${index + 1}" class="gallery-admin-image">
                    <div class="gallery-admin-actions">
                        <span class="gallery-item-number">이미지 ${index + 1}</span>
                        <button class="btn-delete-gallery" onclick="deleteGalleryImage('${productId}', ${index})">
                            삭제
                        </button>
                    </div>
                `;
                grid.appendChild(item);
            });
        } else {
            grid.innerHTML = '<div class="empty-gallery-admin"><p>등록된 갤러리 이미지가 없습니다.</p></div>';
        }
    } else {
        grid.innerHTML = '<div class="empty-gallery-admin"><p>등록된 갤러리 이미지가 없습니다.</p></div>';
    }
}

// Delete gallery image
function deleteGalleryImage(productId, index) {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) {
        return;
    }
    
    const galleryKey = `${productId}-gallery`;
    const savedGallery = localStorage.getItem(galleryKey);
    
    if (savedGallery) {
        let gallery = JSON.parse(savedGallery);
        gallery.splice(index, 1);
        localStorage.setItem(galleryKey, JSON.stringify(gallery));
        showSuccessMessage('이미지가 삭제되었습니다.');
        loadGalleryImages();
    }
}

// Product selector change event
document.getElementById('galleryProductSelect').addEventListener('change', loadGalleryImages);

// Close gallery modal when clicking outside
document.getElementById('galleryUploadModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeGalleryModal();
    }
});

// Initial load
loadProducts();
