
// Mobile menu toggle
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));



//---------------------------------------------BUTTON
const buttons = document.querySelectorAll('.work-card');
const buttons2 = document.querySelectorAll('.work-card-y');
const backdrop = document.getElementById('backdrop');
let activeButton = null;

function toggleExpand(button) {
    const isExpanded = button.classList.contains('expanded');

    // Close any open button first
    if (activeButton && activeButton !== button) {
    activeButton.classList.remove('expanded');
    }

    button.classList.toggle('expanded', !isExpanded);
    backdrop.classList.toggle('visible', !isExpanded);

    if (!isExpanded) {
    activeButton = button;
    document.body.style.overflow = 'hidden'; // Prevent page scroll
    } else {
    activeButton.scrollTo({top:0,behavior:'instant'});
    activeButton = null;
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    
    }
}

// Click on button to expand (if not clicking close)
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
    if (!button.classList.contains('expanded') && !e.target.classList.contains('close-btn')) {
        toggleExpand(button);
    }
    });

    // Close button inside each expanded overlay
    button.querySelector('.close-btn').addEventListener('click', () => {
    toggleExpand(button);
    });
});

buttons2.forEach(button => {
    button.addEventListener('click', (e) => {
    if (!button.classList.contains('expanded') && !e.target.classList.contains('close-btn')) {
        toggleExpand(button);
    }
    });

    // Close button inside each expanded overlay
    button.querySelector('.close-btn').addEventListener('click', () => {
    toggleExpand(button);
    });
});

// Click backdrop to close
backdrop.addEventListener('click', () => {
    if (activeButton) {
    toggleExpand(activeButton);
    }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeButton) {
    toggleExpand(activeButton);
    }
});

//hover-marquee
document.querySelectorAll('.image-switch').forEach(link => {
  const defaultImg = link.querySelector('img');
  const hoverSrc = link.dataset.hover;

  link.addEventListener('mouseenter', () => {
    defaultImg.src = hoverSrc;
  });

  link.addEventListener('mouseleave', () => {
    defaultImg.src = defaultImg.dataset.default || defaultImg.src; // optional reset
  });
});



const iframe = document.getElementById('work-player');
const wrapper = iframe.parentElement;

iframe.addEventListener('load', () => {
  // Ask the iframe for its size (only works if the embedded player listens)
  iframe.contentWindow.postMessage({ type: 'getVideoSize' }, '*');
});

window.addEventListener('message', (event) => {
  if (event.source !== iframe.contentWindow) return;

  if (event.data.type === 'videoSize') {
    const { width, height } = event.data;
    const ratio = width / height;
    wrapper.style.aspectRatio = `${width} / ${height}`;
    console.log(`Dynamic ratio set: ${ratio.toFixed(2)}`);
  }
});



// Run once on load + every resize
function updateVideoDisplay() {
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    document.querySelectorAll('.work-container').forEach(block => {
        const video = block.querySelector('.work-player');
        const info  = block.querySelector('.info');

        if (!video || !info) return;

        let text = `Window: ${ww} × ${wh}px`;

        // Only proceed if video metadata is available
        if (video.readyState >= 1 && video.videoWidth > 0) {
            const origW = video.videoWidth;
            const origH = video.videoHeight;
            const clientW = video.clientWidth;
            const clientH = video.clientHeight;
            const aspect = origW / origH;

            let displayW, displayH;

            if (origW > origH) {
                // Landscape or square → width-limited
                displayW = ww * 0.65;
                displayH = displayW / aspect;   // preserve original aspect
            } else {
                // Portrait → height-limited
                if (wh*0.75*aspect > ww) {
                    displayW = ww * 0.9;
                    displayH = displayW / aspect;   // preserve original aspect
                }
                else{
                    displayH = wh * 0.75;
                    displayW = displayH * aspect;
                }
            }

            text += `  •  Video: ${origW} × ${origH}  (aspect: ${aspect.toFixed(3)})`;
            text += `  •  Display: ${Math.round(displayW)} × ${Math.round(displayH)} px`;

            // Set CSS variables
            block.style.setProperty('--video-w',      `${Math.round(displayW)}px`);
            block.style.setProperty('--video-h',      `${Math.round(displayH)}px`);
            block.style.setProperty('--video-aspect', `${origW}/${origH}`);      // ← original aspect, usually what you want
            block.style.setProperty('--is-landscape', origW >= origH ? '1' : '0');

        } else {
            text += "  •  Video metadata not loaded yet";
        }

        info.textContent = text;
    });
}

// ────────────────────────────────────────────────
// Attach listeners
window.addEventListener('resize', updateVideoDisplay);
window.addEventListener('load',   updateVideoDisplay);

// Also update when each video actually loads metadata (important!)
document.querySelectorAll('.fullscreen-wrapper').forEach(block => {
    const video = block.querySelector('.work-player');
    if (video) {
        video.addEventListener('loadedmetadata', updateVideoDisplay);
        video.addEventListener('canplay',        updateVideoDisplay); // sometimes helps
    }
});


