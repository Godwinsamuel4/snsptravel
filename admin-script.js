
// Admin Panel Management
class AdminPanel {
    constructor() {
        this.blogManager = null;
        this.notificationManager = null;
        this.currentEditId = null;
        this.init();
    }

    init() {
        // Wait for the main blog manager to be available
        if (window.blogManager) {
            this.blogManager = window.blogManager;
        } else {
            // Create a new instance if not available
            this.blogManager = {
                blogs: this.loadBlogs(),
                saveBlogs: () => localStorage.setItem('snsp_blogs', JSON.stringify(this.blogs)),
                getAllBlogs: () => this.blogs,
                addBlog: (blogData) => this.addBlog(blogData),
                updateBlog: (id, blogData) => this.updateBlog(id, blogData),
                deleteBlog: (id) => this.deleteBlog(id),
                getBlog: (id) => this.blogs.find(blog => blog.id === id)
            };
        }

        this.notificationManager = {
            show: this.showNotification
        };

        this.setupEventListeners();
        this.loadDashboard();
        this.showSection('dashboard');
    }

    loadBlogs() {
        const defaultBlogs = [
            {
                id: '1',
                title: 'How to Find the Best Flight Deals',
                excerpt: 'Discover insider tips and tricks for finding the cheapest flights for your next adventure.',
                content: 'Finding the best flight deals requires strategy and timing. Here are some proven methods to save money on your next trip...',
                category: 'Flight Tips',
                date: '2025-01-10',
                status: 'published',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop'
            },
            {
                id: '2',
                title: 'Ultimate Guide to Hotel Bookings',
                excerpt: 'Learn how to book the perfect accommodation for your travels with these expert tips.',
                content: 'Booking the right hotel can make or break your travel experience. Here\'s everything you need to know...',
                category: 'Hotels',
                date: '2025-01-08',
                status: 'published',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop'
            },
            {
                id: '3',
                title: 'Visa Application Success Stories',
                excerpt: 'Real experiences and tips from successful visa applications around the world.',
                content: 'Getting a visa can be challenging, but with the right approach, you can increase your chances of success...',
                category: 'Visa',
                date: '2025-01-05',
                status: 'draft',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop'
            }
        ];

        const savedBlogs = localStorage.getItem('snsp_blogs');
        this.blogs = savedBlogs ? JSON.parse(savedBlogs) : defaultBlogs;
        return this.blogs;
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.menu-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Form submissions
        document.getElementById('add-blog-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddBlog();
        });

        document.getElementById('edit-blog-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditBlog();
        });

        // Settings forms
        document.querySelectorAll('.settings-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSettingsUpdate(form);
            });
        });
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Show section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`)?.classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            blogs: 'Blog Management',
            'add-blog': 'Add New Blog',
            settings: 'Settings'
        };
        document.getElementById('page-title').textContent = titles[sectionName] || sectionName;

        // Load section-specific data
        if (sectionName === 'dashboard') {
            this.loadDashboard();
        } else if (sectionName === 'blogs') {
            this.loadAllBlogs();
        }
    }

    loadDashboard() {
        const blogs = this.blogManager.getAllBlogs();
        const published = blogs.filter(blog => blog.status === 'published').length;
        const drafts = blogs.filter(blog => blog.status === 'draft').length;

        document.getElementById('total-blogs').textContent = blogs.length;
        document.getElementById('published-blogs').textContent = published;
        document.getElementById('draft-blogs').textContent = drafts;

        // Load recent blogs
        const recentBlogs = blogs.slice(-5).reverse();
        const recentBlogsList = document.getElementById('recent-blogs-list');
        
        if (recentBlogs.length === 0) {
            recentBlogsList.innerHTML = '<p style="padding: 1rem; text-align: center; color: #7f8c8d;">No blog posts yet.</p>';
            return;
        }

        recentBlogsList.innerHTML = recentBlogs.map(blog => `
            <div class="blog-item">
                <div class="blog-info">
                    <h4>${blog.title}</h4>
                    <div class="blog-meta">
                        <span><i class="fas fa-tag"></i> ${blog.category}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
                        <span class="status-badge status-${blog.status}">${blog.status}</span>
                    </div>
                </div>
                <div class="blog-actions">
                    <button class="btn-edit" onclick="adminPanel.openEditModal('${blog.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteBlog('${blog.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadAllBlogs() {
        const blogs = this.blogManager.getAllBlogs();
        const allBlogsList = document.getElementById('all-blogs-list');
        
        if (blogs.length === 0) {
            allBlogsList.innerHTML = '<p style="padding: 2rem; text-align: center; color: #7f8c8d;">No blog posts yet. <a href="#" onclick="adminPanel.showSection(\'add-blog\')">Create your first blog post</a>.</p>';
            return;
        }

        allBlogsList.innerHTML = blogs.map(blog => `
            <div class="blog-item">
                <div class="blog-info">
                    <h4>${blog.title}</h4>
                    <p style="color: #7f8c8d; margin: 0.5rem 0;">${blog.excerpt}</p>
                    <div class="blog-meta">
                        <span><i class="fas fa-tag"></i> ${blog.category}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
                        <span class="status-badge status-${blog.status}">${blog.status}</span>
                    </div>
                </div>
                <div class="blog-actions">
                    <button class="btn-edit" onclick="adminPanel.openEditModal('${blog.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteBlog('${blog.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    handleAddBlog() {
        const title = document.getElementById('blog-title').value.trim();
        const excerpt = document.getElementById('blog-excerpt').value.trim();
        const category = document.getElementById('blog-category').value;
        const image = document.getElementById('blog-image').value.trim();
        const content = document.getElementById('blog-content').innerHTML;
        const status = document.querySelector('input[name="blog-status"]:checked').value;

        if (!title || !excerpt || !content) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const blogData = {
            title,
            excerpt,
            category,
            image: image || 'https://via.placeholder.com/400x200?text=Travel',
            content,
            status
        };

        try {
            this.addBlog(blogData);
            this.showNotification('Blog post created successfully!', 'success');
            this.resetForm();
            this.loadDashboard();
        } catch (error) {
            this.showNotification('Error creating blog post', 'error');
            console.error(error);
        }
    }

    handleEditBlog() {
        const id = document.getElementById('edit-blog-id').value;
        const title = document.getElementById('edit-blog-title').value.trim();
        const excerpt = document.getElementById('edit-blog-excerpt').value.trim();
        const category = document.getElementById('edit-blog-category').value;
        const image = document.getElementById('edit-blog-image').value.trim();
        const content = document.getElementById('edit-blog-content').innerHTML;
        const status = document.querySelector('input[name="edit-blog-status"]:checked').value;

        if (!title || !excerpt || !content) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const blogData = {
            title,
            excerpt,
            category,
            image: image || 'https://via.placeholder.com/400x200?text=Travel',
            content,
            status
        };

        try {
            this.updateBlog(id, blogData);
            this.showNotification('Blog post updated successfully!', 'success');
            this.closeEditModal();
            this.loadDashboard();
            this.loadAllBlogs();
        } catch (error) {
            this.showNotification('Error updating blog post', 'error');
            console.error(error);
        }
    }

    addBlog(blogData) {
        const newBlog = {
            id: Date.now().toString(),
            ...blogData,
            date: new Date().toISOString().split('T')[0]
        };
        this.blogs.push(newBlog);
        this.saveBlogs();
        return newBlog;
    }

    updateBlog(id, blogData) {
        const index = this.blogs.findIndex(blog => blog.id === id);
        if (index !== -1) {
            this.blogs[index] = { ...this.blogs[index], ...blogData };
            this.saveBlogs();
            return this.blogs[index];
        }
        return null;
    }

    deleteBlog(id) {
        if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            this.blogs = this.blogs.filter(blog => blog.id !== id);
            this.saveBlogs();
            this.showNotification('Blog post deleted successfully', 'success');
            this.loadDashboard();
            this.loadAllBlogs();
            return true;
        }
        return false;
    }

    saveBlogs() {
        localStorage.setItem('snsp_blogs', JSON.stringify(this.blogs));
    }

    openEditModal(id) {
        const blog = this.blogs.find(b => b.id === id);
        if (!blog) return;

        document.getElementById('edit-blog-id').value = blog.id;
        document.getElementById('edit-blog-title').value = blog.title;
        document.getElementById('edit-blog-excerpt').value = blog.excerpt;
        document.getElementById('edit-blog-category').value = blog.category;
        document.getElementById('edit-blog-image').value = blog.image;
        document.getElementById('edit-blog-content').innerHTML = blog.content;
        document.querySelector(`input[name="edit-blog-status"][value="${blog.status}"]`).checked = true;

        document.getElementById('edit-modal').style.display = 'block';
    }

    closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    resetForm() {
        document.getElementById('add-blog-form').reset();
        document.getElementById('blog-content').innerHTML = '';
        document.querySelector('input[name="blog-status"][value="published"]').checked = true;
    }

    handleSettingsUpdate(form) {
        this.showNotification('Settings updated successfully!', 'success');
    }

    exportData() {
        const data = {
            blogs: this.blogs,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `snsp-travel-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    importData(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.blogs && Array.isArray(data.blogs)) {
                    if (confirm('This will replace all existing blog data. Are you sure?')) {
                        this.blogs = data.blogs;
                        this.saveBlogs();
                        this.loadDashboard();
                        this.loadAllBlogs();
                        this.showNotification('Data imported successfully!', 'success');
                    }
                } else {
                    this.showNotification('Invalid data format', 'error');
                }
            } catch (error) {
                this.showNotification('Error reading file', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
        input.value = '';
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px',
            animation: 'slideInRight 0.3s ease'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || '#3498db';
    }
}

// Rich Text Editor Functions
function formatText(command) {
    document.execCommand(command, false, null);
}

function insertList() {
    document.execCommand('insertUnorderedList', false, null);
}

// Global Functions
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        window.location.href = 'admin-login.html';
    }
}

function showSection(section) {
    adminPanel.showSection(section);
}

function resetForm() {
    adminPanel.resetForm();
}

function closeEditModal() {
    adminPanel.closeEditModal();
}

function exportData() {
    adminPanel.exportData();
}

function importData(input) {
    adminPanel.importData(input);
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    // Simple auth check
    const hasAuth = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    if (!hasAuth) {
        window.location.href = 'admin-login.html';
        return;
    }

    adminPanel = new AdminPanel();
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('edit-modal');
    if (e.target === modal) {
        adminPanel.closeEditModal();
    }
});
