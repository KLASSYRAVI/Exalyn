import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);

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

    // --- LIVE TRANSFORMATION DEMO ("The Thinking Machine") ---
    const rawNotepad = document.getElementById("raw-notepad");
    const structuredView = document.getElementById("structured-view");

    if (rawNotepad && structuredView) {
        const liveTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 2,
            scrollTrigger: {
                trigger: "#notes-feature",
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });

        // Elements
        const line1 = document.getElementById("type-line-1");
        const line2 = document.getElementById("type-line-2");
        const line3 = document.getElementById("type-line-3");
        const blocks = ["#block-1", "#block-2", "#block-3"];

        // Manual Typewriter Function (No Plugin Needed)
        const typeWriter = (id, text, speed) => {
            const el = document.getElementById(id);
            // Return a tween that simulates typing
            return gsap.to(el, {
                duration: text.length * speed,
                ease: "none",
                onUpdate: function () {
                    const progress = this.progress();
                    const len = Math.floor(progress * text.length);
                    el.textContent = text.substring(0, len);
                }
            });
        };

        // 1. Typing Phase (Expression)
        liveTimeline
            .add(() => {
                line1.textContent = "";
                line2.textContent = "";
                line3.textContent = "";
                gsap.set(["#line-wrapper-2", "#line-wrapper-3"], { opacity: 0 });
            })
            .add(typeWriter("type-line-1", "Meeting with design team...", 0.05))
            .to("#line-wrapper-2", { opacity: 1, duration: 0 }, ">0.2")
            .add(typeWriter("type-line-2", "Action: Fix navbar bug", 0.05), ">")
            .to("#line-wrapper-3", { opacity: 1, duration: 0 }, ">0.2")
            .add(typeWriter("type-line-3", "Idea: Dark mode default?", 0.05), ">")

            // 2. Scan/Transform Phase
            .to("#raw-notepad", { opacity: 0, scale: 0.95, filter: "blur(4px)", duration: 0.6, ease: "power2.inOut" }, "+=0.5")
            .to("#structured-view", { opacity: 1, duration: 0.1 }, "<0.3") // Switch visibility

            // 3. Structure Phase (Blocks Pop In)
            .fromTo(blocks,
                { opacity: 0, scale: 0.8, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" },
                "<"
            )

            // 4. Hold & Reset
            .to({}, { duration: 3 }) // Hold
            .to("#structured-view", { opacity: 0, duration: 0.5 })
            .to("#raw-notepad", { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5 });

        // Click Navigation
        const container = document.getElementById("live-notepad-container");
        if (container) {
            container.addEventListener("click", () => window.location.href = '/notes.html');
            container.style.cursor = "pointer";
        }

        // Staggered Text Animation (kept from original)
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

    // --- PROGRESS ORBIT GOAL TRACKER ANIMATION ---
    const goalsContainer = document.getElementById("goals-demo-container");
    const goalsCursor = document.getElementById("goals-cursor");
    const progressRing = document.getElementById("progress-ring");
    const progressPercentage = document.getElementById("progress-percentage");
    const milestones = document.querySelectorAll(".milestone");

    if (goalsContainer && progressRing) {
        // Custom Cursor Logic
        if (goalsCursor) {
            goalsContainer.addEventListener("mousemove", (e) => {
                gsap.to(goalsCursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    top: 0,
                    left: 0
                });
            });

            goalsContainer.addEventListener("mouseenter", () => {
                gsap.to(goalsCursor, { opacity: 1, scale: 1, duration: 0.2 });
            });

            goalsContainer.addEventListener("mouseleave", () => {
                gsap.to(goalsCursor, { opacity: 0, scale: 0.8, duration: 0.2 });
            });
        }

        // Main Animation Timeline (ScrollTrigger)
        const goalsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#goals-feature",
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });

        // Phase 1: Ring Entrance & Progress Fill
        const targetProgress = 72; // 72%
        const circumference = 534; // 2 * PI * 85
        const offset = circumference - (targetProgress / 100) * circumference;

        goalsTimeline
            // Ring scales in
            .fromTo("#goals-demo-container .relative.w-64",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
            )
            // Progress ring fills
            .to(progressRing, {
                strokeDashoffset: offset,
                duration: 2,
                ease: "power2.out"
            }, "-=0.3")
            // Counter counts up
            .to({ value: 0 }, {
                value: targetProgress,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                    if (progressPercentage) {
                        progressPercentage.textContent = Math.round(this.targets()[0].value) + "%";
                    }
                }
            }, "-=2");

        // Phase 2: Milestones Pop In with Pulses
        milestones.forEach((milestone, index) => {
            const status = milestone.getAttribute('data-status');
            const circle = milestone.querySelector('div');

            goalsTimeline.to(milestone, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
                onStart: () => {
                    // Change color based on status
                    if (status === 'complete') {
                        circle.classList.remove('border-slate-600', 'bg-slate-800');
                        circle.classList.add('border-emerald-500', 'bg-emerald-900/50');

                        // Pulse effect to center
                        const pulse = document.createElement('div');
                        pulse.className = 'absolute w-2 h-2 bg-emerald-400 rounded-full';
                        pulse.style.left = '50%';
                        pulse.style.top = '50%';
                        milestone.appendChild(pulse);

                        gsap.to(pulse, {
                            scale: 0,
                            opacity: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            onComplete: () => pulse.remove()
                        });
                    } else if (status === 'progress') {
                        circle.classList.remove('border-slate-600', 'bg-slate-800');
                        circle.classList.add('border-emerald-400', 'bg-emerald-900/30');
                    }
                }
            }, `-=${index === 0 ? 0.3 : 0.1}`);
        });

        // Phase 3: Idle Floating Animation
        goalsTimeline.add(() => {
            milestones.forEach((milestone, i) => {
                gsap.to(milestone, {
                    y: "+=8",
                    duration: 2 + Math.random(),
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: i * 0.2
                });
            });
        });

        // Text Stagger Animation
        gsap.from(".goals-text-anim", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: "#goals-feature",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Click Navigation
        goalsContainer.addEventListener("click", () => {
            window.location.href = '/goals.html';
        });
    }

    // --- SMART TASK FLOW ANIMATION ---
    const tasksContainer = document.getElementById("tasks-demo-container");
    const tasksCursor = document.getElementById("tasks-cursor");
    const heroTask = document.getElementById("hero-task");
    const colTodo = document.getElementById("col-todo");
    const colProgress = document.getElementById("col-progress");
    const colDone = document.getElementById("col-done");

    if (tasksContainer && heroTask) {
        // Custom Cursor Logic
        if (tasksCursor) {
            tasksContainer.addEventListener("mousemove", (e) => {
                gsap.to(tasksCursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    top: 0,
                    left: 0
                });
            });
            tasksContainer.addEventListener("mouseenter", () => {
                gsap.to(tasksCursor, { opacity: 1, scale: 1, duration: 0.2 });
            });
            tasksContainer.addEventListener("mouseleave", () => {
                gsap.to(tasksCursor, { opacity: 0, scale: 0.8, duration: 0.2 });
            });
        }

        // --- THE JOURNEY TIMELINE ---
        const taskTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 2,
            scrollTrigger: {
                trigger: "#tasks-feature",
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });

        // 1. Creation (Pop in Todo)
        taskTimeline.set(heroTask, {
            opacity: 0, scale: 0.8, x: 0, y: 0,
            borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgb(51, 65, 85)' // Slate 700
        })
            .set("#hero-status-dot", { backgroundColor: '#64748b' }) // Slate 500
            .set("#hero-progress-bar", { opacity: 0 })
            .to(heroTask, {
                opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)",
                onStart: () => {
                    colTodo.querySelector('.col-header').classList.add('text-white');
                }
            })
            .to(heroTask, { rotation: -2, duration: 0.1, yoyo: true, repeat: 1 }) // Wobble
            .to({}, { duration: 1 }) // Wait

            // 2. Move to In Progress
            .to(heroTask, {
                y: -10, scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', zIndex: 50, duration: 0.3
            })
            .to(heroTask, {
                x: "105%", // Move to next column (approx)
                duration: 0.6,
                ease: "power2.inOut",
                onStart: () => {
                    colTodo.querySelector('.col-header').classList.remove('text-white');
                    colProgress.querySelector('.col-header').classList.add('text-amber-400');
                }
            }, "-=0.1")
            .to(heroTask, {
                y: 0, scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderColor: 'rgba(245, 158, 11, 0.3)', // Amber border
                onComplete: () => {
                    const dot = document.getElementById("hero-status-dot");
                    if (dot) dot.style.backgroundColor = '#f59e0b'; // Amber 500
                }
            })
            // Progress Fill
            .to("#hero-progress-bar", { opacity: 1, duration: 0.2 })
            .to("#hero-progress-fill", { width: "70%", duration: 1.5, ease: "power1.inOut" })
            .to({}, { duration: 0.5 }) // Wait

            // 3. Move to Done
            .to(heroTask, {
                y: -10, scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', duration: 0.3
            })
            .to(heroTask, {
                x: "210%", // Move to last column
                duration: 0.6,
                ease: "power2.inOut",
                onStart: () => {
                    colProgress.querySelector('.col-header').classList.remove('text-amber-400');
                    colDone.querySelector('.col-header').classList.add('text-emerald-400');
                }
            }, "-=0.1")
            .to(heroTask, {
                y: 0, scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)', // Emerald border
                backgroundColor: 'rgba(6, 78, 59, 0.4)', // Emerald 900/40
                onComplete: () => {
                    const dot = document.getElementById("hero-status-dot");
                    if (dot) {
                        dot.style.backgroundColor = '#10b981'; // Emerald 500
                        dot.style.boxShadow = '0 0 10px #10b981'; // Glow
                    }
                }
            })
            .to("#hero-progress-bar", { opacity: 0, duration: 0.2 }) // Hide progress bar
            .to({}, { duration: 0.2 })

            // Celebration Pulse
            .to(heroTask, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 })
            .to({}, {
                duration: 2, onComplete: () => {
                    colDone.querySelector('.col-header').classList.remove('text-emerald-400');
                }
            }); // Show off completed state

        // Text Stagger Animation
        gsap.from(".tasks-text-anim", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: "#tasks-feature",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Click Navigation
        tasksContainer.addEventListener("click", () => {
            window.location.href = '/tasks.html';
        });
    }

    // --- COMMAND CENTER PRE-FOOTER ANIMATION ---
    const ccSection = document.getElementById("command-center");

    if (ccSection) {

        // Setup Lines Function (Optimized)
        function updateLines() {
            const center = document.getElementById("center-text-group").getBoundingClientRect();
            const sectionRect = ccSection.getBoundingClientRect();

            // Calculate center relative to section
            const centerX = (center.left - sectionRect.left) + center.width / 2;
            const centerY = (center.top - sectionRect.top) + center.height / 2;

            const nodes = ['notes', 'whiteboard', 'goals', 'tasks'];

            nodes.forEach(node => {
                const el = document.getElementById(`node-${node}`);
                const line = document.getElementById(`line-${node}`);

                if (el && line) {
                    const rect = el.getBoundingClientRect();

                    // Determine start point relative to section
                    let startX, startY;

                    if (node === 'notes') { startX = rect.right; startY = rect.bottom; }
                    else if (node === 'whiteboard') { startX = rect.left; startY = rect.bottom; }
                    else if (node === 'goals') { startX = rect.left; startY = rect.top; }
                    else if (node === 'tasks') { startX = rect.right; startY = rect.top; }

                    const x1 = startX - sectionRect.left;
                    const y1 = startY - sectionRect.top;

                    line.setAttribute('d', `M${x1},${y1} L${centerX},${centerY}`);
                }
            });
        }

        // PERFORMANCE FIX: Run update ONLY on resize and initial load
        // REMOVED scroll listener completely
        window.addEventListener('resize', () => { setTimeout(updateLines, 50) });

        // Initial call
        setTimeout(updateLines, 100);

        // MAIN TIMELINE
        const ccTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#command-center",
                start: "top 60%",
                toggleActions: "play none none none"
                // Performance Fix: Do not reverse heavy animations on scroll up
            }
        });


        // 1. Text Reveal
        ccTimeline.from("#cc-line-1", { y: 100, opacity: 0, duration: 0.8, ease: "power3.out" })
            .from("#cc-line-2", { y: 100, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")

            // 2. Nodes Converge
            .from(".cc-node", {
                scale: 0,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "elastic.out(1, 0.75)"
            }, "-=0.4")

            // 3. Lines Draw & Text Reveal
            .from(["#line-notes", "#line-whiteboard", "#line-goals", "#line-tasks"], {
                strokeDasharray: 500,
                strokeDashoffset: 500,
                duration: 1.5,
                ease: "power2.out"
            }, "-=0.8")
            .to("#cc-tagline", { opacity: 1, duration: 1 }, "-=1")

            // 4. Pulse Animation Loop
            .add(() => {
                const nodes = ['notes', 'whiteboard', 'goals', 'tasks'];
                nodes.forEach(node => {
                    const pulse = document.getElementById(`pulse-${node}`);
                    const line = document.getElementById(`line-${node}`);

                    if (pulse && line) {
                        gsap.to(pulse, {
                            motionPath: {
                                path: line,
                                align: line,
                                alignOrigin: [0.5, 0.5]
                            },
                            duration: 2,
                            repeat: -1,
                            ease: "power1.inOut",
                            opacity: 1
                        });
                    }
                });

                // Floating Nodes
                gsap.to("#node-notes", { y: -15, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
                gsap.to("#node-whiteboard", { y: 15, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.5 });
                gsap.to("#node-goals", { y: -10, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });
                gsap.to("#node-tasks", { y: 10, duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.5 });
            });
    }

    // --- LIVING CTA ANIMATION (SUPERCHARGED) ---

    // 1. Dual Liquid Gradients (Opposite drifts for complex interference)
    gsap.to(".cta-bg", {
        backgroundPosition: "100% 100%",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to(".cta-bg-2", {
        backgroundPosition: "0% 0%",
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 2. Particle System (Digital Embers)
    const particleContainer = document.getElementById('cta-particles');
    if (particleContainer) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('absolute', 'rounded-full', 'bg-blue-400');
            // Random size 2-4px
            const size = Math.random() * 3 + 1;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            // Random opacity
            p.style.opacity = Math.random() * 0.3 + 0.1;
            // Random start pos
            p.style.left = `${Math.random() * 100}%`;
            p.style.bottom = `-${Math.random() * 20}%`; // Start below

            particleContainer.appendChild(p);

            // Animate each particle
            gsap.to(p, {
                y: -window.innerHeight * 0.8, // Float up 80% of screen height
                x: `+=${Math.random() * 100 - 50}`, // Drift L/R
                opacity: 0,
                duration: Math.random() * 10 + 10, // Slow float 10-20s
                repeat: -1,
                ease: "none",
                delay: Math.random() * 10 // Randomize start times
            });
        }
    }

    // 3. Breathing Text (More pronounced)
    gsap.to(".cta-title", {
        y: -10,
        scale: 1.02,
        textShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 4. Pulsing Button (Action Signal)
    gsap.to(".cta-button", {
        boxShadow: "0 0 50px rgba(255,255,255,0.4), 0 0 100px rgba(59, 130, 246, 0.2)",
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 5. Footer Entrance (Smooth Fade & Ambient Drift)
    gsap.to(".footer", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.5,
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });
    // Set initial state for footer
    gsap.set(".footer", { y: 40, opacity: 0, filter: "blur(8px)" });

    // Footer Ambient Drift
    gsap.to(".footer .font-mono", {
        x: 20,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    // 6. CTA Scroll-to-Home Logic (The Elite Fix)
    const ctaBtn = document.querySelector(".cta-button");
    if (ctaBtn) {
        ctaBtn.addEventListener("click", () => {
            // Kill momentum + prevent fights from ScrollTriggers
            ScrollTrigger.disable();

            gsap.to(window, {
                scrollTo: { y: "#home", autoKill: true },
                duration: 1.6,
                ease: "power4.inOut",
                overwrite: "auto",
                onComplete: () => {
                    // Re-enable everything AFTER scroll completes
                    ScrollTrigger.enable();
                    ScrollTrigger.refresh();
                }
            });
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

            // Special handling for "home" button - scroll to top
            if (targetId === 'home') {
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: { y: "#home" },
                    ease: "power3.inOut"
                });
                return;
            }

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

            // Special handling for "goals" button - scroll to feature section
            if (targetId === 'goals') {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: "#goals-feature", offsetY: 80 },
                    ease: "power2.inOut"
                });
                return;
            }

            // Special handling for "tasks" button - scroll to feature section
            if (targetId === 'tasks') {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: "#tasks-feature", offsetY: 80 },
                    ease: "power2.inOut"
                });
                return;
            }

            // For other buttons, switch views normally
            switchToView(targetId);
        });
    });

    // Wire up brand logo click
    const brandLogo = document.getElementById("firstPart");
    if (brandLogo) {
        brandLogo.addEventListener("click", () => {
            gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power3.inOut' });
        });
    }
});