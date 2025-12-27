// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect with smooth transition
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    let ticking = false;
    
    function updateNavbar() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Keep navbar always visible
        navbar.style.transform = 'translateY(0)';
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Add transition for navbar transform
    navbar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Smooth scroll for navigation links on homepage
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    
    if (isHomePage) {
        // Map menu items to section IDs
        const menuMap = {
            '/': 'hero',
            '/posts/': 'blog',
            '/about/': 'about',
            '/certificates/': 'certificates'
        };
        
        // Handle nav links click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                // If link has target="_blank", let browser handle it naturally
                if (this.getAttribute('target') === '_blank') {
                    return; // Don't prevent default, let browser open new tab
                }
                
                const href = this.getAttribute('href');
                const sectionId = menuMap[href];
                
                if (sectionId) {
                    e.preventDefault();
                    
                    let targetElement;
                    if (sectionId === 'hero') {
                        // Scroll to top for Home
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    } else {
                        targetElement = document.getElementById(sectionId);
                        if (targetElement) {
                            const offsetTop = targetElement.offsetTop - 80;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    }
                    
                    // Update active state (skip links with target="_blank")
                    document.querySelectorAll('.nav-link').forEach(l => {
                        if (l.getAttribute('target') !== '_blank') {
                            l.classList.remove('active');
                        }
                    });
                    if (this.getAttribute('target') !== '_blank') {
                        this.classList.add('active');
                    }
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navRight = document.querySelector('.nav-right');
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (navRight) navRight.classList.remove('active');
                        if (navToggle) navToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navRight = document.querySelector('.nav-right');
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (navRight) navRight.classList.remove('active');
                        if (navToggle) navToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
    }
    
    // Mobile menu toggle with animation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navRight = document.querySelector('.nav-right');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (navRight) navRight.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Set active nav link based on current page or scroll position
    function updateActiveNavLink() {
        if (!isHomePage) {
            const currentPath = window.location.pathname;
            document.querySelectorAll('.nav-link').forEach(link => {
                // Skip "Về tôi" link - it's independent
                if (link.getAttribute('target') === '_blank') {
                    link.classList.remove('active');
                    return;
                }
                
                const linkPath = new URL(link.href).pathname;
                if (currentPath === linkPath || (currentPath === '/' && linkPath === '/')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            // On homepage, update based on scroll position
            const sections = [
                { id: 'hero', offset: 0 },
                { id: 'blog', offset: document.getElementById('blog')?.offsetTop || 0 },
                { id: 'about', offset: document.getElementById('about')?.offsetTop || 0 },
                { id: 'certificates', offset: document.getElementById('certificates')?.offsetTop || 0 }
            ];
            
            const scrollPosition = window.pageYOffset + 100;
            
            let activeSection = 'hero';
            for (let i = sections.length - 1; i >= 0; i--) {
                if (scrollPosition >= sections[i].offset) {
                    activeSection = sections[i].id;
                    break;
                }
            }
            
            document.querySelectorAll('.nav-link').forEach(link => {
                // Skip "Về tôi" link - it's independent and opens in new tab
                if (link.getAttribute('target') === '_blank') {
                    link.classList.remove('active');
                    return;
                }
                
                link.classList.remove('active');
                const href = link.getAttribute('href');
                const menuMap = {
                    '/': 'hero',
                    '/posts/': 'blog',
                    '/about/': 'about',
                    '/certificates/': 'certificates'
                };
                if (menuMap[href] === activeSection) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Initial active state
    updateActiveNavLink();
    
    // Update active state on scroll (only on homepage)
    if (isHomePage) {
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveNavLink, 100);
        });
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.checked = false; // Unchecked = light (left)
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.checked = true; // Checked = dark (right)
    }
    
    // Handle theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                // Dark mode (right)
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                // Light mode (left)
                htmlElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe blog cards only (certificate cards have separate observer)
    document.querySelectorAll('.blog-card').forEach(card => {
        observer.observe(card);
    });
    
    // Intersection Observer for section dividers animation
    const dividerObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const dividerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                dividerObserver.unobserve(entry.target);
            }
        });
    }, dividerObserverOptions);
    
    // Observe section dividers - wait for DOM to be ready
    function observeDividers() {
        const dividers = document.querySelectorAll('.section-divider');
        dividers.forEach(divider => {
            dividerObserver.observe(divider);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDividers);
    } else {
        observeDividers();
    }
    
    // Intersection Observer for About Me section animations
    const aboutSectionObserverOptions = {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '0px 0px -100px 0px'
    };
    
    const aboutSectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const aboutText = entry.target.querySelector('.about-text');
                const aboutVisual = entry.target.querySelector('.about-visual');
                
                if (aboutText) {
                    aboutText.classList.add('animate');
                }
                if (aboutVisual) {
                    aboutVisual.classList.add('animate');
                }
                
                aboutSectionObserver.unobserve(entry.target);
            }
        });
    }, aboutSectionObserverOptions);
    
    // Observe About Me section
    function observeAboutSection() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSectionObserver.observe(aboutSection);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeAboutSection);
    } else {
        observeAboutSection();
    }
    
    // Intersection Observer for Certificates section animations
    const certificatesSectionObserverOptions = {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '0px 0px -100px 0px'
    };
    
    const certificatesSectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const certificateCards = entry.target.querySelectorAll('.certificate-card');
                certificateCards.forEach((card, index) => {
                    // Add delay based on index for staggered effect
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, index * 100);
                });
                
                certificatesSectionObserver.unobserve(entry.target);
            }
        });
    }, certificatesSectionObserverOptions);
    
// Observe Certificates section
function observeCertificatesSection() {
    const certificatesSection = document.getElementById('certificates');
    if (certificatesSection) {
        certificatesSectionObserver.observe(certificatesSection);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeCertificatesSection);
} else {
    observeCertificatesSection();
}


// Copy contact info (email and phone) to clipboard functionality
(function() {
    function copyToClipboard(text, element, originalText) {
        const span = element.querySelector('span');
        if (!span) {
            console.error('Span not found');
            return false;
        }
        
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    // Visual feedback
                    span.textContent = 'Đã copy!';
                    span.style.color = '#60a5fa';
                    element.style.pointerEvents = 'none';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        span.textContent = originalText;
                        span.style.color = '';
                        element.style.pointerEvents = '';
                    }, 2000);
                }).catch(err => {
                    console.log('Clipboard API failed, using fallback:', err);
                    copyFallback(text, element, span, originalText);
                });
                return true;
            } else {
                throw new Error('Clipboard API not available');
            }
        } catch (err) {
            console.log('Using fallback copy method:', err);
            copyFallback(text, element, span, originalText);
            return true;
        }
    }
    
    function copyFallback(text, element, span, originalText) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        textArea.setAttribute('readonly', '');
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        
        try {
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, text.length);
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                span.textContent = 'Đã copy!';
                span.style.color = '#60a5fa';
                element.style.pointerEvents = 'none';
                setTimeout(() => {
                    span.textContent = originalText;
                    span.style.color = '';
                    element.style.pointerEvents = '';
                }, 2000);
            } else {
                alert('Không thể copy. Nội dung: ' + text);
            }
        } catch (fallbackErr) {
            if (document.body.contains(textArea)) {
                document.body.removeChild(textArea);
            }
            console.error('Fallback copy failed:', fallbackErr);
            alert('Không thể copy. Nội dung: ' + text);
        }
    }
    
    function setupContactCopy(elementId, dataAttr, defaultValue) {
        const element = document.getElementById(elementId);
        if (!element) {
            return;
        }
        
        // Check if already has listener
        if (element.dataset.listenerAdded === 'true') {
            return;
        }
        
        element.dataset.listenerAdded = 'true';
        
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const value = this.getAttribute(dataAttr) || defaultValue;
            const span = this.querySelector('span');
            if (!span) {
                console.error('Span not found in contact element');
                return false;
            }
            
            const originalText = span.textContent;
            copyToClipboard(value, this, originalText);
            
            return false;
        });
    }
    
    function init() {
        setupContactCopy('email-contact', 'data-email', 'thuanthien2004tt@gmail.com');
        setupContactCopy('phone-contact', 'data-phone', '0356970964');
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also try after a short delay to ensure element is loaded
    setTimeout(init, 1000);
})();

// Flip card functionality for all certificate cards
(function() {
    function setupFlipCards() {
        const flipCards = document.querySelectorAll('.certificate-card-flip');
        let initializedCount = 0;
        
        flipCards.forEach(function(card) {
            // Check if already initialized
            if (card.dataset.flipInitialized === 'true') {
                initializedCount++;
                return;
            }
            
            // Mark as initialized
            card.dataset.flipInitialized = 'true';
            
            // Add click handler to the card
            card.addEventListener('click', function(e) {
                // Don't flip if clicking on the image (let modal handle it)
                if (e.target.classList.contains('certificate-image')) {
                    return;
                }
                
                e.preventDefault();
                e.stopPropagation();
                this.classList.toggle('flipped');
            });
            
            initializedCount++;
        });
        
        return initializedCount === flipCards.length && flipCards.length > 0;
    }
    
    function initFlipCards() {
        if (setupFlipCards()) {
            return;
        }
        
        // Retry if elements not found
        setTimeout(initFlipCards, 100);
    }
    
    // Try to initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initFlipCards, 100);
        });
    } else {
        setTimeout(initFlipCards, 100);
    }
    
    // Also try after certificates animation
    setTimeout(function() {
        initFlipCards();
    }, 2000);
})();

// Certificate Image Modal functionality
(function() {
    function initCertificateModal() {
        const modal = document.getElementById('certificate-modal');
        const modalImage = document.getElementById('certificate-modal-image');
        const modalClose = document.querySelector('.certificate-modal-close');
        const modalOverlay = document.querySelector('.certificate-modal-overlay');
        const certificateImages = document.querySelectorAll('.certificate-image[data-cert-image]');
        
        if (!modal || !modalImage) {
            setTimeout(initCertificateModal, 100);
            return;
        }
        
        // Function to open modal
        function openModal(imageSrc) {
            if (modalImage && modal) {
                modalImage.src = imageSrc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
        }
        
        // Function to close modal
        function closeModal() {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore body scroll
            }
        }
        
        // Add click event to certificate images
        certificateImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent flip card from flipping
                const imageSrc = this.getAttribute('data-cert-image') || this.src;
                openModal(imageSrc);
            });
        });
        
        // Close modal when clicking close button
        if (modalClose) {
            modalClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeModal();
            });
        }
        
        // Close modal when clicking overlay
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                e.stopPropagation();
                closeModal();
            });
        }
        
        // Close modal when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Prevent modal content from closing when clicking on image
        if (modalImage) {
            modalImage.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCertificateModal);
    } else {
        initCertificateModal();
    }
    
    // Also try after certificates animation
    setTimeout(initCertificateModal, 2000);
})();
    
    // Add hover effect for certificate cards skills
    document.querySelectorAll('.certificate-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const skills = this.querySelectorAll('.skills-list li');
            skills.forEach((skill, index) => {
                setTimeout(() => {
                    skill.style.opacity = '1';
                    skill.style.transform = 'translateX(0)';
                }, index * 50);
            });
        });
    });

    // Blog Search and Filter Functionality
    const blogSearchInput = document.getElementById('blog-search');
    const blogGridsContainer = document.getElementById('blog-grids-container');
    const blogGridsScrollWrapper = document.getElementById('blog-grids-scroll-wrapper');
    const blogScrollNav = document.getElementById('blog-scroll-nav');
    const blogScrollPrev = document.getElementById('blog-scroll-prev');
    const blogScrollNext = document.getElementById('blog-scroll-next');
    const blogScrollIndicators = document.getElementById('blog-scroll-indicators');
    const filterDropdownToggle = document.getElementById('filter-dropdown-toggle');
    const filterDropdownMenu = document.getElementById('filter-dropdown-menu');
    const filterDropdownItems = document.querySelectorAll('.filter-dropdown-item');
    const filterSelectedValue = document.getElementById('filter-selected-value');
    const noResults = document.getElementById('no-results');
    const searchSuggestions = document.getElementById('search-suggestions');
    const blogCardsData = document.getElementById('blog-cards-data');
    let currentFilter = 'all';
    let currentSearch = '';
    let allTags = [];
    const postsPerGrid = 6; // 2 hàng x 3 cột
    let visibleCards = [];
    let currentGridIndex = 0;
    let allBlogCards = [];

    // Initialize: Extract cards from hidden container
    if (blogCardsData) {
        const cards = blogCardsData.querySelectorAll('.blog-card');
        cards.forEach(card => {
            allBlogCards.push(card);
            
            // Collect tags
            const tagsString = card.dataset.tags || '';
            const tags = tagsString.trim().split(/\s+/).filter(t => t);
            tags.forEach(tag => {
                if (!allTags.find(t => t.filter === tag)) {
                    allTags.push({
                        name: tag.charAt(0).toUpperCase() + tag.slice(1),
                        filter: tag
                    });
                }
            });
        });
    }

    // Normalize Vietnamese text for better search
    function normalizeVietnamese(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    // Filter blog cards
    function filterBlogCards() {
        visibleCards = [];
        currentGridIndex = 0;
        
        // First, filter cards based on search and filter
        allBlogCards.forEach(card => {
            const title = normalizeVietnamese(card.dataset.title || '');
            const content = normalizeVietnamese(card.dataset.content || '');
            const tagsString = card.dataset.tags || '';
            const category = normalizeVietnamese(card.dataset.category || '');
            
            // Normalize tags for filtering
            const normalizedTags = normalizeVietnamese(tagsString);
            const cardTags = normalizedTags.trim().split(/\s+/).filter(t => t.length > 0);
            
            let searchTerm = normalizeVietnamese(currentSearch);
            // Remove # if user types hashtag
            const isHashtagSearch = currentSearch.trim().startsWith('#');
            if (isHashtagSearch) {
                searchTerm = searchTerm.replace(/^#/, '').trim();
            }
            
            const matchesSearch = !searchTerm || 
                title.includes(searchTerm) || 
                content.includes(searchTerm) || 
                (isHashtagSearch ? cardTags.some(tag => tag.includes(searchTerm)) : normalizedTags.includes(searchTerm)) ||
                category.includes(searchTerm);
            
            // Filter by tags only - more accurate
            let matchesFilter = false;
            if (currentFilter === 'all') {
                matchesFilter = true;
            } else {
                // Check if the filter tag exists exactly in the card's tags array
                const normalizedFilter = normalizeVietnamese(currentFilter);
                matchesFilter = cardTags.some(tag => tag === normalizedFilter);
            }
            
            if (matchesSearch && matchesFilter) {
                visibleCards.push(card);
            }
        });

        // Show/hide no results message
        if (visibleCards.length === 0) {
            noResults.style.display = 'block';
            blogGridsContainer.style.display = 'none';
            if (blogScrollNav) blogScrollNav.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            blogGridsContainer.style.display = 'flex';
            createGrids();
            updateScrollNavigation();
        }

        // Update blog count
        const blogCountElement = document.querySelector('.blog-count');
        if (blogCountElement) {
            const totalPosts = allBlogCards.length;
            if (currentSearch || currentFilter !== 'all') {
                blogCountElement.textContent = `${visibleCards.length} / ${totalPosts} bài viết`;
            } else {
                blogCountElement.textContent = `${totalPosts} bài viết`;
            }
        }
    }

    // Create grids from visible cards
    function createGrids() {
        // Clear existing grids
        blogGridsContainer.innerHTML = '';
        
        // Create grids (6 cards per grid)
        const totalGrids = Math.ceil(visibleCards.length / postsPerGrid);
        
        for (let i = 0; i < totalGrids; i++) {
            const grid = document.createElement('div');
            grid.className = 'blog-grid';
            grid.dataset.gridIndex = i;
            
            const startIndex = i * postsPerGrid;
            const endIndex = Math.min(startIndex + postsPerGrid, visibleCards.length);
            const gridCards = visibleCards.slice(startIndex, endIndex);
            
            gridCards.forEach(card => {
                grid.appendChild(card.cloneNode(true));
            });
            
            // Add "coming soon" card vào grid cuối cùng nếu chưa đủ 6 cards
            if (i === totalGrids - 1 && gridCards.length < postsPerGrid) {
                const comingSoonCard = createComingSoonCard();
                grid.appendChild(comingSoonCard);
            }
            
            blogGridsContainer.appendChild(grid);
        }
        
        // Nếu grid cuối cùng đã đủ 6 cards, tạo grid mới cho coming soon card
        if (totalGrids > 0 && visibleCards.length % postsPerGrid === 0) {
            const lastGrid = blogGridsContainer.querySelector('.blog-grid:last-child');
            if (lastGrid && lastGrid.children.length === postsPerGrid) {
                const newGrid = document.createElement('div');
                newGrid.className = 'blog-grid';
                newGrid.dataset.gridIndex = totalGrids;
                const comingSoonCard = createComingSoonCard();
                newGrid.appendChild(comingSoonCard);
                blogGridsContainer.appendChild(newGrid);
            }
        }
        
        // Reset to first grid
        if (blogGridsContainer) {
            blogGridsContainer.style.transform = 'translateX(0)';
            currentGridIndex = 0;
        }
    }
    
    // Create "coming soon" card
    function createComingSoonCard() {
        const card = document.createElement('article');
        card.className = 'blog-card blog-card-coming-soon';
        
        card.innerHTML = `
            <div class="blog-card-content">
                <div class="blog-meta-top">
                    <span>Sắp có</span>
                </div>
                <h3 class="blog-title">
                    <span>Các blog mới sẽ sớm xuất hiện tại đây</span>
                </h3>
                <p class="blog-excerpt">Chúng mình đang chuẩn bị những nội dung chất lượng để chia sẻ với các bạn. Hãy quay lại sau nhé!</p>
                <div class="blog-tags">
                    <span class="tag">#ComingSoon</span>
                </div>
            </div>
        `;
        
        return card;
    }

    // Update scroll navigation
    function updateScrollNavigation() {
        // Count grids including coming soon card
        const grids = blogGridsContainer.querySelectorAll('.blog-grid');
        const totalGrids = grids.length;
        
        if (totalGrids <= 1) {
            if (blogScrollNav) blogScrollNav.style.display = 'none';
            return;
        }
        
        if (blogScrollNav) blogScrollNav.style.display = 'flex';
        
        // Update indicators
        if (blogScrollIndicators) {
            blogScrollIndicators.innerHTML = '';
            for (let i = 0; i < totalGrids; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'blog-scroll-indicator';
                if (i === currentGridIndex) indicator.classList.add('active');
                indicator.addEventListener('click', () => scrollToGrid(i));
                blogScrollIndicators.appendChild(indicator);
            }
        }
        
        updateNavButtons();
    }

    // Scroll to specific grid using transform
    function scrollToGrid(index) {
        const grids = blogGridsContainer.querySelectorAll('.blog-grid');
        if (grids[index]) {
            const grid = grids[index];
            const gridWidth = grid.offsetWidth;
            const gap = parseFloat(getComputedStyle(blogGridsContainer).gap) || 0;
            const scrollLeft = index * (gridWidth + gap);
            
            blogGridsContainer.style.transform = `translateX(-${scrollLeft}px)`;
            blogGridsContainer.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            currentGridIndex = index;
            updateActiveIndicator();
            updateNavButtons();
        }
    }

    // Update active indicator
    function updateActiveIndicator() {
        const indicators = blogScrollIndicators.querySelectorAll('.blog-scroll-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentGridIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Update navigation buttons
    function updateNavButtons() {
        const totalGrids = Math.ceil(visibleCards.length / postsPerGrid);
        
        if (blogScrollPrev) {
            blogScrollPrev.disabled = currentGridIndex === 0;
        }
        
        if (blogScrollNext) {
            blogScrollNext.disabled = currentGridIndex >= totalGrids - 1;
        }
    }

    // Scroll navigation handlers
    if (blogScrollPrev) {
        blogScrollPrev.addEventListener('click', () => {
            if (currentGridIndex > 0) {
                scrollToGrid(currentGridIndex - 1);
            }
        });
    }

    if (blogScrollNext) {
        blogScrollNext.addEventListener('click', () => {
            const totalGrids = Math.ceil(visibleCards.length / postsPerGrid);
            if (currentGridIndex < totalGrids - 1) {
                scrollToGrid(currentGridIndex + 1);
            }
        });
    }

    // Prevent scroll with mouse/touch
    if (blogGridsScrollWrapper) {
        blogGridsScrollWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        blogGridsScrollWrapper.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    // Show search suggestions
    function showSuggestions(searchTerm) {
        if (!searchTerm || searchTerm.length < 1) {
            searchSuggestions.style.display = 'none';
            searchSuggestions.innerHTML = '';
            return;
        }

        const isHashtagSearch = searchTerm.trim().startsWith('#');
        let searchQuery = normalizeVietnamese(searchTerm);
        if (isHashtagSearch) {
            searchQuery = searchQuery.replace(/^#/, '').trim();
        }

        // If user types #, show all available hashtags
        if (searchTerm.trim() === '#') {
            const popularTags = allTags.filter(tag => 
                tag.filter === 'java' || tag.filter === 'javascript'
            );
            if (popularTags.length > 0) {
                searchSuggestions.innerHTML = popularTags.map(tag => `
                    <div class="suggestion-item" data-filter="${tag.filter}">
                        <svg class="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M7 7h10M7 12h10M7 17h10"/>
                        </svg>
                        <span class="suggestion-text">#${tag.name}</span>
                        <span class="suggestion-type">Hashtag</span>
                    </div>
                `).join('');
                searchSuggestions.style.display = 'block';
                addSuggestionClickHandlers();
                return;
            }
        }

        // Filter tags based on search
        const matchingTags = allTags.filter(tag => {
            const normalizedTag = normalizeVietnamese(tag.name);
            return normalizedTag.includes(searchQuery);
        });

        if (matchingTags.length === 0) {
            searchSuggestions.style.display = 'none';
            searchSuggestions.innerHTML = '';
            return;
        }

        searchSuggestions.innerHTML = matchingTags.map(tag => `
            <div class="suggestion-item" data-filter="${tag.filter}">
                <svg class="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 7h10M7 12h10M7 17h10"/>
                </svg>
                <span class="suggestion-text">${isHashtagSearch ? '#' : ''}${tag.name}</span>
                <span class="suggestion-type">${isHashtagSearch ? 'Hashtag' : 'Chủ đề'}</span>
            </div>
        `).join('');

        searchSuggestions.style.display = 'block';
        addSuggestionClickHandlers();
    }

    // Add click handlers to suggestions
    function addSuggestionClickHandlers() {
        searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const filterValue = this.dataset.filter;
                // Set filter and update UI - try to match with dropdown items first
                let foundInDropdown = false;
                filterDropdownItems.forEach(dropdownItem => {
                    if (dropdownItem.dataset.filter === filterValue) {
                        dropdownItem.classList.remove('active');
                        dropdownItem.classList.add('active');
                        currentFilter = filterValue;
                        const selectedText = dropdownItem.querySelector('span').textContent.trim();
                        filterSelectedValue.textContent = selectedText;
                        foundInDropdown = true;
                    } else {
                        dropdownItem.classList.remove('active');
                    }
                });
                
                // If not found in dropdown, set filter directly (for tags)
                if (!foundInDropdown) {
                    filterDropdownItems.forEach(dropdownItem => {
                        dropdownItem.classList.remove('active');
                    });
                    // Set "Tất cả" as active but keep the tag filter
                    if (filterDropdownItems[0]) {
                        filterDropdownItems[0].classList.add('active');
                    }
                    currentFilter = filterValue; // This will be a tag, not a category
                }
                
                // Clear search input
                blogSearchInput.value = '';
                currentSearch = '';
                searchSuggestions.style.display = 'none';
                // Close dropdown if open
                if (filterDropdownToggle) filterDropdownToggle.classList.remove('active');
                if (filterDropdownMenu) filterDropdownMenu.classList.remove('active');
                filterBlogCards();
            });
        });
    }

    // Search input handler - Realtime
    if (blogSearchInput) {
        blogSearchInput.addEventListener('input', function() {
            currentSearch = this.value.trim();
            // Show suggestions
            showSuggestions(currentSearch);
            // Filter cards in realtime
            filterBlogCards();
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!blogSearchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });

        // Handle focus
        blogSearchInput.addEventListener('focus', function() {
            if (this.value.trim()) {
                showSuggestions(this.value.trim());
            }
        });
    }

    // Dropdown toggle handler
    if (filterDropdownToggle) {
        filterDropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdownToggle.classList.toggle('active');
            filterDropdownMenu.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (filterDropdownToggle && filterDropdownMenu) {
            if (!filterDropdownToggle.contains(e.target) && !filterDropdownMenu.contains(e.target)) {
                filterDropdownToggle.classList.remove('active');
                filterDropdownMenu.classList.remove('active');
            }
        }
    });

    // Filter dropdown item handlers
    filterDropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            filterDropdownItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            // Update current filter
            currentFilter = this.dataset.filter || 'all';
            // Update selected value text
            const selectedText = this.querySelector('span').textContent.trim();
            filterSelectedValue.textContent = selectedText;
            // Close dropdown
            filterDropdownToggle.classList.remove('active');
            filterDropdownMenu.classList.remove('active');
            // Clear search if filtering by tag
            if (currentFilter !== 'all') {
                blogSearchInput.value = '';
                currentSearch = '';
                searchSuggestions.style.display = 'none';
            }
            filterBlogCards();
        });
    });

    // Smooth scroll for hero CTA buttons
    document.querySelectorAll('.hero-cta a').forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - navbar.offsetHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Initialize: Show first page
    filterBlogCards();
});

