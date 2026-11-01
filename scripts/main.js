// ===== SECTION SCROLL OBSERVER =====
    window.addEventListener('DOMContentLoaded', () => {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          const navLink = document.querySelector(`.side-nav a[href="#${id}"]`);

          if (entry.isIntersecting) {
            document.querySelectorAll('.side-nav a.nav-link').forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
          }
        });
      }, observerOptions);

      document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
      });

      // ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
      document.querySelectorAll('.side-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
            // Get the position of the target section
            const targetPosition = targetSection.offsetTop;

            // Smooth scroll to the target position
            window.scrollTo({
              top: targetPosition - 20, // Add small offset for better visibility
              behavior: 'smooth'
            });

            // Update active state
            document.querySelectorAll('.side-nav a.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
          }
        });
      });
    });

    // ===== MODAL & KEYBOARD FUNCTIONALITY =====
    // Store the element that triggered the modal for focus restoration
    let lastFocusedElement = null;
    let previousBodyOverflow = '';

    function openModal(modalId) {
      lastFocusedElement = document.activeElement;
      const modal = document.getElementById(modalId);
      if (!modal) return;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      modal.inert = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.querySelectorAll(':scope > *').forEach((element) => {
        if (element !== modal) element.inert = true;
      });
      modal.style.display = 'flex';

      // Focus the close button for accessibility
      setTimeout(() => {
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) closeButton.focus();
      }, 100);
    }

    function closeModal(event, modalId) {
      if (event.target.classList.contains('modal-overlay')) {
        forceCloseModal(modalId);
      }
    }

    function forceCloseModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      document.body.querySelectorAll(':scope > *').forEach((element) => {
        if (element !== modal) element.inert = false;
      });
      document.body.style.overflow = previousBodyOverflow;

      // Restore focus to the element that opened the modal
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }

    // Keyboard support for interactive cards
    function handleCardKeyPress(event, modalId) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(modalId);
      }
    }

    // Global keyboard event listener for ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        // Find all open modals and close them
        const openModals = document.querySelectorAll('.modal-overlay[style*="display: flex"]');
        openModals.forEach(modal => {
          forceCloseModal(modal.id);
        });
      }
    });

    // Trap focus within modal when open
    document.addEventListener('keydown', function(event) {
      if (event.key !== 'Tab') return;

      const openModal = document.querySelector('.modal-overlay[style*="display: flex"]');
      if (!openModal) return;

      const focusableElements = openModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    });
