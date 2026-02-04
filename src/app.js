import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {

    // --- Initial Animations ---
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Initial Navbar & Line
    tl.from("#firstPart", { y: -50, opacity: 0, duration: 0.8 })
        .to(".nav-btn", { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.2")
        .to("#nav-line", { scaleX: 1, duration: 0.8, ease: "expo.out" }, "-=0.4");

    // 2. HERO: Modern Text Animation
    const textNode = document.querySelector("#hero-text");
    if (textNode) {
        tl.fromTo(textNode,
            {
                opacity: 0,
                scale: 0.8,
                y: 20
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            }, "-=0.2")
            .to("#hero-slogan", {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, "-=0.6");
    }

    // 3. HERO: Floating Cards Pop Out + Floating Loop
    const cards = document.querySelectorAll('.hero-card');
    cards.forEach((card, i) => {
        const xVal = card.getAttribute('style').match(/--x:\s*([^;]+)/)[1];
        const yVal = card.getAttribute('style').match(/--y:\s*([^;]+)/)[1];
        const rotVal = card.getAttribute('style').match(/--rot:\s*([^;]+)/)[1];

        tl.to(card, {
            scale: 1,
            x: xVal,
            y: yVal,
            rotation: rotVal,
            duration: 1.4,
            ease: "elastic.out(1, 0.75)",
            onComplete: () => {
                gsap.to(card, {
                    y: `+=${5 + Math.random() * 5}`,
                    rotation: `${parseFloat(rotVal) + (Math.random() < 0.5 ? -1 : 1)}`,
                    duration: 3 + Math.random(),
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: Math.random()
                });
            }
        }, "-=1.0");
    });


    // --- MARQUEE ANIMATION ---
    const marqueeContainer = document.getElementById("marquee-container");
    const marquee = document.getElementById("marquee-text");

    if (marquee && marqueeContainer) {
        gsap.to(marquee, { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
        gsap.to(marqueeContainer, {
            scrollTrigger: {
                trigger: "#home",
                start: "bottom 90%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            duration: 1
        });
    }

    // --- INTERACTIVE NOTE DEMO ---
    const noteContainer = document.getElementById("note-demo-container");
    const noteCursor = document.getElementById("note-cursor");
    const addBtn = document.getElementById("add-note-btn");
    const spawnArea = document.getElementById("spawn-area");

    if (noteContainer && noteCursor && addBtn) {
        // Custom Cursor Logic
        noteContainer.addEventListener("mousemove", (e) => {
            gsap.to(noteCursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                top: 0,
                left: 0
            });
        });

        noteContainer.addEventListener("mouseenter", () => {
            gsap.to(noteCursor, { opacity: 1, scale: 1, duration: 0.2 });
        });

        noteContainer.addEventListener("mouseleave", () => {
            gsap.to(noteCursor, { opacity: 0, scale: 0.8, duration: 0.2 });
        });

        // Spawn Logic
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent triggering container click

            gsap.to(addBtn, {
                scale: 0.8, opacity: 0, duration: 0.3, ease: "back.in(1.7)", onComplete: () => {
                    addBtn.style.display = 'none';
                }
            });

            const words = ["Hey", "Welcome", "To", "Exalyn"];
            const positions = [
                { left: 20, top: 15, rotate: -6 },
                { left: 65, top: 20, rotate: 4 },
                { left: 35, top: 45, rotate: -3 },
                { left: 60, top: 65, rotate: 6 }
            ];

            words.forEach((word, i) => {
                const block = document.createElement("div");
                block.className = "absolute px-6 py-3 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl text-white font-bold text-xl whitespace-nowrap cursor-default select-none z-20";
                block.innerText = word;

                block.style.left = `${positions[i].left}%`;
                block.style.top = `${positions[i].top}%`;

                gsap.set(block, { scale: 0, rotation: positions[i].rotate * 2, autoAlpha: 0 });
                spawnArea.appendChild(block);

                gsap.to(block, {
                    scale: 1,
                    rotation: positions[i].rotate,
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    delay: i * 0.15,
                    onComplete: () => {
                        // After last block spawns, enable navigation
                        if (i === words.length - 1) {
                            canNavigate = true;
                            // Change cursor text to "DIVE IN"
                            const cursorText = noteCursor.querySelector('span');
                            if (cursorText) {
                                cursorText.innerText = "DIVE IN";
                            }
                            // Add pointer cursor to container
                            noteContainer.style.cursor = 'pointer';
                        }
                    }
                });
            });
        });

        // BLOCK CLICK -> Initially disabled, enabled after spawn
        let canNavigate = false;

        noteContainer.addEventListener("click", () => {
            if (canNavigate) {
                // Navigate to separate notes.html page
                window.location.href = '/notes.html';
            }
        });

        // Staggered Text Animation
        gsap.from(".feature-text-anim", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: "#notes-feature",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // --- WHITEBOARD HANDWRITTEN ANIMATION ---
    const whiteboardText = document.querySelector("#whiteboard-text");
    if (whiteboardText) {
        // Set up stroke animation
        const length = whiteboardText.getComputedTextLength();
        const dashLength = length + 50;

        gsap.set(whiteboardText, {
            strokeDasharray: dashLength,
            strokeDashoffset: dashLength,
            opacity: 0
        });

        // Trigger on scroll
        gsap.timeline({
            scrollTrigger: {
                trigger: "#whiteboard-feature",
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        })
            .to(whiteboardText, {
                opacity: 1,
                duration: 0.3
            })
            .to(whiteboardText, {
                strokeDashoffset: 0,
                duration: 3,
                ease: "power1.inOut"
            })
            .to(whiteboardText, {
                fill: "#ffffff",
                duration: 1,
                ease: "power2.out"
            }, "-=0.5");

        // Staggered Text Animation for whiteboard
        gsap.from(".whiteboard-text-anim", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: "#whiteboard-feature",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // --- WHITEBOARD CURSOR & NAVIGATION ---
    const whiteboardContainer = document.getElementById("whiteboard-demo-container");
    const whiteboardCursor = document.getElementById("whiteboard-cursor");

    if (whiteboardContainer && whiteboardCursor) {
        // Custom Cursor Logic
        whiteboardContainer.addEventListener("mousemove", (e) => {
            gsap.to(whiteboardCursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                top: 0,
                left: 0
            });
        });

        whiteboardContainer.addEventListener("mouseenter", () => {
            gsap.to(whiteboardCursor, { opacity: 1, scale: 1, duration: 0.2 });
        });

        whiteboardContainer.addEventListener("mouseleave", () => {
            gsap.to(whiteboardCursor, { opacity: 0, scale: 0.8, duration: 0.2 });
        });

        // Click to navigate to whiteboard.html
        whiteboardContainer.addEventListener("click", () => {
            window.location.href = '/whiteboard.html';
        });
    }




    // --- NAVIGATION LOGIC ---
    const navBtns = document.querySelectorAll('.nav-btn');

    function switchToView(viewId) {
        // Update navbar
        navBtns.forEach(b => {
            if (b.getAttribute('data-target') === viewId) {
                b.classList.add('text-white');
                b.classList.remove('text-slate-300');
            } else {
                b.classList.remove('text-white');
                b.classList.add('text-slate-300');
            }
        });

        const targetSection = document.getElementById(viewId);
        const currentSection = document.querySelector('.view-section:not(.hidden)');

        if (currentSection && currentSection !== targetSection) {
            gsap.to(currentSection, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                onComplete: () => {
                    currentSection.classList.add('hidden');
                    if (targetSection) {
                        targetSection.classList.remove('hidden');
                        gsap.fromTo(targetSection,
                            { opacity: 0, y: 10 },
                            { opacity: 1, y: 0, duration: 0.3 }
                        );
                    }
                }
            });
        }
    }

    // NAV BUTTON CLICKS
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (!targetId) return;

            // Special handling for "notes" button - scroll to feature section
            if (targetId === 'notes') {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: "#notes-feature", offsetY: 80 },
                    ease: "power2.inOut"
                });
                return;
            }

            // Special handling for "whiteboard" button - scroll to feature section
            if (targetId === 'whiteboard') {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: "#whiteboard-feature", offsetY: 80 },
                    ease: "power2.inOut"
                });
                return;
            }

            // For other buttons, switch views normally
            switchToView(targetId);
        });
    });
});