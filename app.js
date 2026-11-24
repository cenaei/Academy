/**
 * Academy Dashboard - Core Application Logic
 * Modular, Accessible, and Hardened against XSS & Leaks
 */
(function () {
  'use strict';

  class AcademyApp {
    constructor() {
      // DOM Elements
      this.tabs = document.querySelectorAll('[role="tab"]');
      this.tabPanels = document.querySelectorAll('[role="tabpanel"]');
      this.topbarTitle = document.getElementById('topbar-title');
      this.searchInput = document.getElementById('search');
      this.themeToggleBtn = document.getElementById('theme-toggle-btn');
      this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
      this.sidebar = document.querySelector('.sidebar');
      this.sidebarBackdrop = document.querySelector('.sidebar-backdrop');
      this.splashScreen = document.querySelector('.splash-screen');
      this.liveAnnouncer = document.getElementById('sr-announcer');

      // State
      this.activeTabId = 'dashboard';
      this.theme = this.getInitialTheme();

      this.init();
    }

    init() {
      this.applyTheme(this.theme);
      this.bindTabEvents();
      this.bindSearchEvents();
      this.bindThemeEvents();
      this.bindMobileMenu();
      this.bindChatEvents();
      this.bindCourseFilterEvents();
      this.dismissSplashScreen();
    }

    // --- Theme Management ---
    getInitialTheme() {
      const stored = localStorage.getItem('academy-theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
      this.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('academy-theme', theme);

      if (this.themeToggleBtn) {
        const isDark = theme === 'dark';
        this.themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
        this.themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      }
    }

    toggleTheme() {
      const newTheme = this.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
      this.announce(`Switched to ${newTheme} theme`);
    }

    bindThemeEvents() {
      if (this.themeToggleBtn) {
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
      }

      // Sync with OS if user hasn't explicitly set a preference
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('academy-theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // --- Tab Navigation & WAI-ARIA Management ---
    bindTabEvents() {
      const tabList = document.querySelector('[role="tablist"]');
      if (!tabList) return;

      // Delegated click
      tabList.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('[role="tab"]');
        if (!tabBtn) return;
        const tabId = tabBtn.getAttribute('data-tab');
        if (tabId) {
          this.switchTab(tabId, tabBtn);
          // Auto close mobile drawer if open
          this.closeSidebar();
        }
      });

      // Keyboard navigation (WAI-ARIA Arrow key navigation)
      tabList.addEventListener('keydown', (e) => {
        const tabsArray = Array.from(this.tabs);
        const currentIndex = tabsArray.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        let targetIndex = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (currentIndex + 1) % tabsArray.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = tabsArray.length - 1;
        }

        if (targetIndex !== null) {
          const targetTab = tabsArray[targetIndex];
          targetTab.focus();
          const tabId = targetTab.getAttribute('data-tab');
          this.switchTab(tabId, targetTab);
        }
      });
    }

    switchTab(tabId, activeBtn) {
      if (!tabId) return;
      this.activeTabId = tabId;

      // Update Tab Buttons
      this.tabs.forEach((tab) => {
        const isMatch = tab === activeBtn || tab.getAttribute('data-tab') === tabId;
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        tab.setAttribute('tabindex', isMatch ? '0' : '-1');
        if (isMatch) {
          tab.classList.add('selected');
        } else {
          tab.classList.remove('selected');
        }
      });

      // Update Tab Panels
      const panelId = tabId + 'Tab';
      this.tabPanels.forEach((panel) => {
        if (panel.id === panelId) {
          panel.classList.add('active');
          panel.hidden = false;
        } else {
          panel.classList.remove('active');
          panel.hidden = true;
        }
      });

      // Update Topbar Title
      const tabTitle = this.formatTitle(tabId);
      if (this.topbarTitle) {
        this.topbarTitle.textContent = tabTitle;
      }
      document.title = `${tabTitle} | Academy Study Dashboard`;

      this.announce(`Viewing ${tabTitle} tab`);
    }

    formatTitle(id) {
      return id.charAt(0).toUpperCase() + id.slice(1);
    }

    announce(message) {
      if (this.liveAnnouncer) {
        this.liveAnnouncer.textContent = message;
      }
    }

    // --- Search & Filtering ---
    bindSearchEvents() {
      if (!this.searchInput) return;

      this.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        this.filterContent(query);
      });
    }

    filterContent(query) {
      // 1. Filter My Courses Table
      const tableRows = document.querySelectorAll('.data-table tbody tr');
      let visibleRowCount = 0;
      tableRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(query);
        row.style.display = matches ? '' : 'none';
        if (matches) visibleRowCount++;
      });

      // 2. Filter New Courses Carousel
      const carouselCards = document.querySelectorAll('.courses-carousel .course-card');
      carouselCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });

      // 3. Filter Courses Grid in Courses Tab
      const gridCards = document.querySelectorAll('.courses-grid .course-item-card');
      gridCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });
    }

    // --- Mobile Drawer Menu ---
    bindMobileMenu() {
      if (this.mobileMenuBtn && this.sidebar) {
        this.mobileMenuBtn.addEventListener('click', () => {
          this.sidebar.classList.toggle('open');
          if (this.sidebarBackdrop) {
            this.sidebarBackdrop.classList.toggle('active');
          }
        });
      }

      if (this.sidebarBackdrop) {
        this.sidebarBackdrop.addEventListener('click', () => {
          this.closeSidebar();
        });
      }

      // Close on ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.sidebar && this.sidebar.classList.contains('open')) {
          this.closeSidebar();
        }
      });
    }

    closeSidebar() {
      if (this.sidebar && this.sidebar.classList.contains('open')) {
        this.sidebar.classList.remove('open');
        if (this.sidebarBackdrop) {
          this.sidebarBackdrop.classList.remove('active');
        }
      }
    }

    // --- Secondary Tab Features ---
    bindChatEvents() {
      const chatForm = document.getElementById('chat-form');
      const chatInput = document.getElementById('chat-input');
      const messagesContainer = document.getElementById('chat-messages');

      if (!chatForm || !chatInput || !messagesContainer) return;

      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        // Create new outgoing message element securely
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble message-bubble--outgoing';
        bubble.textContent = text;

        messagesContainer.appendChild(bubble);
        chatInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate instructor reply after 1.2s
        setTimeout(() => {
          const reply = document.createElement('div');
          reply.className = 'message-bubble message-bubble--incoming';
          reply.textContent = 'Great question! Let me check the documentation and get back to you shortly.';
          messagesContainer.appendChild(reply);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1200);
      });
    }

    bindCourseFilterEvents() {
      const pillsContainer = document.querySelector('.filter-pills');
      if (!pillsContainer) return;

      pillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        pillsContainer.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter');
        const cards = document.querySelectorAll('.courses-grid .course-item-card');

        cards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // --- Gentle Splash Screen Dismiss ---
    dismissSplashScreen() {
      if (!this.splashScreen) return;
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          this.splashScreen.classList.add('hidden');
        }, 350);
      });
    }
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.app = new AcademyApp();
    });
  } else {
    window.app = new AcademyApp();
  }
})();
