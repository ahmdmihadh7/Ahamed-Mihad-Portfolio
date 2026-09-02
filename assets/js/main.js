/**
 * AHAMED MIHAD S - PREMIUM ENGINEERING PORTFOLIO JAVASCRIPT
 * Handles sticky nav, scroll spy, mobile drawer, custom cursor motion,
 * interactive card spotlights, modals, clipboard copy, and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // Modal Elements
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // =========================================================================
  // 1. CUSTOM ENGINEERING CURSOR MOTION & SPRING PHYSICS
  // =========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);

  if (!isTouchDevice && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = false;
    let hasMoved = false;

    // Fast tracking for center dot, interpolated tracking for ring
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        cursorDot.classList.remove('cursor-hidden');
        cursorRing.classList.remove('cursor-hidden');
      }

      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      isMoving = true;
    }, { passive: true });

    // Smooth spring physics for outer ring
    function renderCursor() {
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Mouse Down / Up Tactile Feedback
    window.addEventListener('mousedown', () => {
      cursorRing.classList.add('clicking');
    });

    window.addEventListener('mouseup', () => {
      cursorRing.classList.remove('clicking');
    });

    // Hover detection for interactive targets
    function attachHoverListeners() {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, .project-card, .cert-card, .skill-chip, .focus-pill, .interest-card, .copy-btn, .tag, .timeline-card, .highlight-card'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorRing.classList.add('hover-active');
          cursorDot.classList.add('hover-active');
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('hover-active');
          cursorDot.classList.remove('hover-active');
        });
      });
    }

    attachHoverListeners();

    // Re-bind when new content or modals open
    window.refreshCursorListeners = attachHoverListeners;

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorDot.classList.add('cursor-hidden');
      cursorRing.classList.add('cursor-hidden');
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.classList.remove('cursor-hidden');
      cursorRing.classList.remove('cursor-hidden');
    });
  }

  // =========================================================================
  // 2. INTERACTIVE CARD SPOTLIGHT MOUSE GLOW
  // =========================================================================
  const spotlightCards = document.querySelectorAll('.project-card, .cert-card, .skill-category-card, .focus-card, .edu-card, .highlight-card');
  spotlightCards.forEach((card) => {
    card.classList.add('spotlight-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // =========================================================================
  // 3. STICKY HEADER & SCROLL TO TOP VISIBILITY
  // =========================================================================
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    updateScrollSpy(scrollY);
  }, { passive: true });

  // =========================================================================
  // 4. SCROLL SPY NAVIGATION
  // =========================================================================
  function updateScrollSpy(scrollY) {
    const headerOffset = 140;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // =========================================================================
  // 5. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openMobileMenu);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // =========================================================================
  // 6. SCROLL TO TOP
  // =========================================================================
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 7. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  let toastTimeout;
  window.showToast = function(msg) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // =========================================================================
  // 8. COPY TO CLIPBOARD HELPER
  // =========================================================================
  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`);
    }).catch(() => {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(`${label} copied to clipboard!`);
    });
  };

  // =========================================================================
  // 9. MODAL SYSTEM & RICH PROJECTS / CERTS DATA
  // =========================================================================
  function openModal(title, contentHtml) {
    if (!modalOverlay) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.refreshCursorListeners) window.refreshCursorListeners();
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileMenu();
    }
  });

  // Project Details Modal Handler (6 High-Impact Engineering Projects)
  window.showProjectModal = function(projectId) {
    const projectsData = {
      'battery-pack': {
        title: 'Battery Pack Design & Prototyping',
        category: 'Battery Systems / CAD / Circuit Design',
        html: `
          <div style="font-family: var(--font-main);">
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <span class="tag">Battery Pack Design</span>
              <span class="tag">CAD Layout</span>
              <span class="tag">Circuit Design</span>
              <span class="tag">Prototyping</span>
            </div>
            <p style="color: #D4D3CC; margin-bottom: 1.25rem; line-height: 1.7;">
              Designed and prototyped a battery pack, including CAD layout of the enclosure and cell arrangement and circuit design for protection and assembly.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.9rem; color: var(--accent-green-light); margin-bottom: 8px; font-family: var(--font-mono); text-transform: uppercase;">Engineering Highlights</h4>
              <ul style="list-style-position: inside; color: #CAC9C3; font-size: 0.9rem; display: flex; flex-direction: column; gap: 6px;">
                <li>Cell layout geometry & spatial optimization for thermal stability</li>
                <li>Protection circuit design for over-current, under-voltage, and charge control</li>
                <li>CAD mechanical enclosure model for structural integrity & assembly</li>
              </ul>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
              Domain: Energy Systems & Hardware Prototyping
            </div>
          </div>
        `
      },
      'aegis-iot': {
        title: 'Aegis: IoT Elderly-Safety Device',
        category: 'Embedded Systems / IoT / Venture Development',
        html: `
          <div style="font-family: var(--font-main);">
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <span class="tag">ESP32</span>
              <span class="tag">mmWave Radar</span>
              <span class="tag">PIR Sensors</span>
              <span class="tag">GSM Alerts</span>
              <span class="tag">91.11% Viability Index</span>
            </div>
            <p style="color: #D4D3CC; margin-bottom: 1.25rem; line-height: 1.7;">
              Led market research, marketing strategy, and technical venture validation for Aegis — a camera-free IoT elderly safety device engineered for privacy-preserving non-intrusive monitoring.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.9rem; color: var(--accent-green-light); margin-bottom: 8px; font-family: var(--font-mono); text-transform: uppercase;">System Architecture & Validation</h4>
              <ul style="list-style-position: inside; color: #CAC9C3; font-size: 0.9rem; display: flex; flex-direction: column; gap: 6px;">
                <li>Camera-free privacy architecture using mmWave micro-motion radar and PIR sensing</li>
                <li>Microcontroller integration on ESP32 with dedicated GSM fail-safe SMS/call alerts</li>
                <li>Awarded a 91.11% viability index under the Wadhwani Foundation Ignite India Program</li>
              </ul>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
              Recognition: Certified Practice Venture (Wadhwani Foundation)
            </div>
          </div>
        `
      },
      'embedded-hardware': {
        title: 'Embedded Hardware Interfacing & Firmware',
        category: 'Embedded Systems',
        html: `
          <div style="font-family: var(--font-main);">
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <span class="tag">Embedded C</span>
              <span class="tag">Microcontrollers</span>
              <span class="tag">Hardware Interfacing</span>
              <span class="tag">Lab Development</span>
            </div>
            <p style="color: #D4D3CC; margin-bottom: 1.25rem; line-height: 1.7;">
              Built and tested microcontroller-driven hardware interfacing tasks covering core embedded programming concepts and peripheral communication.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.9rem; color: var(--accent-green-light); margin-bottom: 8px; font-family: var(--font-mono); text-transform: uppercase;">Technical Implementation</h4>
              <ul style="list-style-position: inside; color: #CAC9C3; font-size: 0.9rem; display: flex; flex-direction: column; gap: 6px;">
                <li>Microcontroller firmware development written in Embedded C</li>
                <li>Peripherals & sensor hardware interfacing in offline lab environment</li>
                <li>End-to-end testing and validation of signal integrity and logic routines</li>
              </ul>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
              Completed at Pumo Technovation Embedded Lab
            </div>
          </div>
        `
      },
      'hmi-plc': {
        title: 'Industrial HMI + PLC Control System',
        category: 'Industrial Automation',
        html: `
          <div style="font-family: var(--font-main);">
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <span class="tag">Siemens TIA Portal</span>
              <span class="tag">PLC</span>
              <span class="tag">HMI Design</span>
              <span class="tag">Automation</span>
            </div>
            <p style="color: #D4D3CC; margin-bottom: 1.25rem; line-height: 1.7;">
              Combined Siemens TIA Portal PLC programming with HMI screen design to monitor and control an automated industrial process.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.9rem; color: var(--accent-green-light); margin-bottom: 8px; font-family: var(--font-mono); text-transform: uppercase;">Control Architecture</h4>
              <ul style="list-style-position: inside; color: #CAC9C3; font-size: 0.9rem; display: flex; flex-direction: column; gap: 6px;">
                <li>Configured PLC ladder and functional logic routines in Siemens TIA Portal</li>
                <li>Designed intuitive operator HMI screens for real-time process monitoring</li>
                <li>Structured alarm triggers, status indicators, and process safety loops</li>
              </ul>
            </div>
          </div>
        `
      },
      'renewable-sim': {
        title: 'Renewable Energy & Wind Power Simulation',
        category: 'Simulation & Design / Renewable Energy',
        html: `
          <div style="font-family: var(--font-main);">
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <span class="tag">MATLAB</span>
              <span class="tag">Simulink</span>
              <span class="tag">Wind Energy</span>
              <span class="tag">Power Systems</span>
            </div>
            <p style="color: #D4D3CC; margin-bottom: 1.25rem; line-height: 1.7;">
              Developed and analyzed dynamic simulation models in MATLAB/Simulink for renewable energy generation and wind turbine power conversion systems.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.9rem; color: var(--accent-green-light); margin-bottom: 8px; font-family: var(--font-mono); text-transform: uppercase;">Simulation Capabilities</h4>
              <ul style="list-style-position: inside; color: #CAC9C3; font-size: 0.9rem; display: flex; flex-direction: column; gap: 6px;">
                <li>Wind turbine aerodynamic & generator power curve modeling</li>
                <li>Simulink control loops for voltage regulation and maximum power tracking</li>
                <li>Transient response analysis under varying wind velocity & grid conditions</li>
              </ul>
            </div>
          </div>
        `
      },
      'grid-renewable': {
        title: 'Grid Integration of Renewable Energy Systems',
        category: 'Renewable Energy / Infrastructure Analysis',
        html: `
          <div style="font-family: var(--font-main);">
            <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
              <span class="tag">Renewable Energy</span>
              <span class="tag">Grid Integration</span>
              <span class="tag">Solar</span>
              <span class="tag">Wind</span>
              <span class="tag">Hydro</span>
            </div>
            <p style="color: #D4D3CC; margin-bottom: 1.25rem; line-height: 1.7;">
              Analyzed real-world Indian renewable energy installations to study large-scale power evacuation, grid synchronization, and renewable power dynamics.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.9rem; color: var(--accent-green-light); margin-bottom: 8px; font-family: var(--font-mono); text-transform: uppercase;">Analyzed Installations</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem; color: #CAC9C3;">
                <div>⚡ Bhadla Solar Park</div>
                <div>⚡ Pavagada Solar Park</div>
                <div>💨 Jaisalmer Wind Park</div>
                <div>💧 Koyna Hydroelectric</div>
                <div>🌊 NTPC Ramagundam Floating Solar</div>
              </div>
            </div>
          </div>
        `
      }
    };

    const project = projectsData[projectId];
    if (project) {
      openModal(project.title, project.html);
    }
  };

  // Certificate Modal Handler
  window.showCertModal = function(certId) {
    const certsData = {
      'cert-1': {
        title: 'Advanced Programming, Control, and Monitoring Systems',
        issuer: 'Packt / Coursera · 2026',
        desc: 'Comprehensive training in advanced automation control logic, SCADA/monitoring fundamentals, and industrial process orchestration.'
      },
      'cert-2': {
        title: 'HMI Design and Intermediate PLC Programming',
        issuer: 'Packt / Coursera · 2026',
        desc: 'Advanced user interface design for industrial automation screens, PLC tag mapping, and interactive supervisory control.'
      },
      'cert-3': {
        title: 'Siemens PLC and TIA Portal Essentials',
        issuer: 'Packt / Coursera · 2026',
        desc: 'Hands-on programming and commissioning of Siemens S7 PLCs using TIA Portal, structured tags, and hardware configuration.'
      },
      'cert-4': {
        title: 'Introduction to Business Intelligence and Analytics (BUS250)',
        issuer: 'Saylor Academy · Grade: 92/100 · 46 hours · Oct 2025',
        desc: 'Rigorous 46-hour course and assessment covering enterprise analytics, data-driven decision making, metrics architecture, and business intelligence.'
      },
      'cert-5': {
        title: 'Ignite India — Certified Practice Venture (Aegis)',
        issuer: 'Wadhwani Foundation · 91.11% Viability Index · Jun 2026',
        desc: '42-hour intensive venture development program. Led market research and marketing strategy for Aegis (camera-free IoT elderly safety system using ESP32, mmWave sensors, and GSM alerts).'
      }
    };

    const cert = certsData[certId];
    if (cert) {
      const html = `
        <div style="font-family: var(--font-main);">
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-green-light); margin-bottom: 1rem;">
            ${cert.issuer}
          </div>
          <p style="color: #D4D3CC; line-height: 1.7; margin-bottom: 1.25rem;">
            ${cert.desc}
          </p>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 12px; border-radius: 6px; font-size: 0.85rem; color: var(--text-muted);">
            Verified academic and professional credential.
          </div>
        </div>
      `;
      openModal(cert.title, html);
    }
  };


  // =========================================================================
  // 10. CONTACT FORM HANDLER (Validation + Clean Feedback)
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all required fields.';
        return;
      }

      // Email regex check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      // Direct mailto link preparation
      const mailtoUrl = `mailto:ahmdmihadh7@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      
      formStatus.className = 'form-status success';
      formStatus.innerHTML = `✓ Thank you, ${name}! Your email client is launching to send this message to <strong>ahmdmihadh7@gmail.com</strong>. You can also email directly anytime.`;
      
      showToast('Launching email client...');
      
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);

      contactForm.reset();
    });
  }
});
