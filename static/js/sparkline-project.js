/**
 * SparklineData Project Interactive Enhancements
 * Advanced animations and interactions using Anime.js and modern JavaScript
 */

class SparklineProjectEnhancer {
    constructor() {
        this.init();
    }

    async init() {
        await this.waitForDOMReady();
        this.setupScrollAnimations();
        this.setupInteractiveMetrics();
        this.setupTimelineInteractions();
        this.setupSVGInteractions();
        this.setupProgressNavigation();
        this.setupCodeSnippets();
        this.setupParticleEffects();
        this.setupArchitectureExplorer();
    }

    waitForDOMReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    setupScrollAnimations() {
        // Create intersection observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('.project-content h2, .project-content h3, .project-content p, .result-card, .achievements-list li, .tech-pill');
        animatableElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    animateElement(element) {
        anime({
            targets: element,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: Math.random() * 200
        });
    }

    setupInteractiveMetrics() {
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach((card, index) => {
            // Add hover animations
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: [1, 1.05],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: [1.05, 1],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

        });
    }

    setupTimelineInteractions() {
        // Create interactive timeline for implementation phases
        this.createInteractiveTimeline();
    }

    createInteractiveTimeline() {
        const timelineData = [
            {
                phase: "Performance Analysis & Architecture",
                period: "Months 1-3",
                description: "Comprehensive performance profiling and architecture design",
                details: [
                    "Performance profiling of existing Spark deployments",
                    "Bottleneck identification in analytical workloads",
                    "Enhancement architecture design"
                ]
            },
            {
                phase: "Core Engine Development", 
                period: "Months 4-7",
                description: "Building proprietary optimization systems",
                details: [
                    "In-memory data format and caching system",
                    "Advanced query optimizer development",
                    "Metadata management framework"
                ]
            },
            {
                phase: "Integration & Compatibility",
                period: "Months 8-10", 
                description: "Seamless integration with existing systems",
                details: [
                    "Hadoop and Spark distribution integration",
                    "Comprehensive API development",
                    "Monitoring and management tools"
                ]
            },
            {
                phase: "Performance Optimization & Testing",
                period: "Months 11-12",
                description: "Real-world validation and fine-tuning",
                details: [
                    "Performance validation testing",
                    "Algorithm optimization",
                    "Enterprise volume testing"
                ]
            }
        ];

        const implementationSection = document.querySelector('#implementation-journey');
        if (implementationSection) {
            this.insertTimelineAfterSection(implementationSection, timelineData);
        }
    }

    insertTimelineAfterSection(section, timelineData) {
        const timelineHTML = `
            <div class="interactive-timeline">
                <div class="timeline-container">
                    ${timelineData.map((phase, index) => `
                        <div class="timeline-item" data-phase="${index}">
                            <div class="timeline-marker">
                                <span class="phase-number">${index + 1}</span>
                            </div>
                            <div class="timeline-content">
                                <h4 class="timeline-title">${phase.phase}</h4>
                                <span class="timeline-period">${phase.period}</span>
                                <p class="timeline-description">${phase.description}</p>
                                <div class="timeline-details">
                                    <ul>
                                        ${phase.details.map(detail => `<li>${detail}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        section.insertAdjacentHTML('afterend', timelineHTML);
        this.setupTimelineAnimations();
    }

    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const details = item.querySelector('.timeline-details');
                const isExpanded = details.style.maxHeight && details.style.maxHeight !== '0px';
                
                // Collapse all other items
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherDetails = otherItem.querySelector('.timeline-details');
                        anime({
                            targets: otherDetails,
                            maxHeight: 0,
                            opacity: 0,
                            duration: 300
                        });
                    }
                });

                // Toggle current item
                if (isExpanded) {
                    anime({
                        targets: details,
                        maxHeight: 0,
                        opacity: 0,
                        duration: 300
                    });
                } else {
                    anime({
                        targets: details,
                        maxHeight: [0, details.scrollHeight + 'px'],
                        opacity: [0, 1],
                        duration: 500,
                        easing: 'easeOutExpo'
                    });
                }
            });
        });
    }

    setupSVGInteractions() {
        const svg = document.querySelector('.hero-svg svg');
        if (!svg) return;

        // Add interactive hover effects to SVG elements
        const interactiveElements = svg.querySelectorAll('rect, circle, polygon, line');
        
        interactiveElements.forEach(element => {
            element.style.cursor = 'pointer';
            
            element.addEventListener('mouseenter', () => {
                anime({
                    targets: element,
                    scale: [1, 1.1],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });

            element.addEventListener('mouseleave', () => {
                anime({
                    targets: element,
                    scale: [1.1, 1],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });

        // Add click interactions for data flow visualization
        const dataFlowElements = svg.querySelectorAll('[fill*="spark-gradient"]');
        dataFlowElements.forEach((element, index) => {
            element.addEventListener('click', () => {
                this.highlightDataFlow(element, index);
            });
        });
    }

    highlightDataFlow(element, index) {
        // Create ripple effect
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'svg-ripple';
        ripple.style.left = rect.left + rect.width / 2 + 'px';
        ripple.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(ripple);
        
        anime({
            targets: ripple,
            scale: [0, 4],
            opacity: [0.5, 0],
            duration: 600,
            easing: 'easeOutExpo',
            complete: () => ripple.remove()
        });

        // Show flow information
        this.showFlowInfo(index);
    }



    setupProgressNavigation() {
        this.createProgressNavigation();
    }

    createProgressNavigation() {
        const progressNav = document.createElement('div');
        progressNav.className = 'progress-navigation';
        progressNav.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="section-dots">
                <div class="dot active" data-section="overview"></div>
                <div class="dot" data-section="challenge"></div>
                <div class="dot" data-section="solution"></div>
                <div class="dot" data-section="implementation"></div>
                <div class="dot" data-section="impact"></div>
            </div>
        `;

        document.body.appendChild(progressNav);
        this.setupProgressTracking();
    }

    setupProgressTracking() {
        const sections = document.querySelectorAll('.project-content h2');
        const progressFill = document.querySelector('.progress-fill');
        const dots = document.querySelectorAll('.section-dots .dot');

        window.addEventListener('scroll', () => {
            const scrollProgress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressFill.style.width = scrollProgress + '%';

            // Update active dot based on scroll position
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    if (dots[index]) {
                        dots[index].classList.add('active');
                    }
                }
            });
        });

        // Smooth scroll to sections when dots are clicked
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (sections[index]) {
                    sections[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }


    showTooltip(element, content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'metric-tooltip';
        tooltip.innerHTML = `
            <h4>${content.title}</h4>
            <p>${content.description}</p>
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        anime({
            targets: tooltip,
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 200,
            easing: 'easeOutQuad'
        });

        // Remove tooltip after delay
        setTimeout(() => {
            anime({
                targets: tooltip,
                opacity: 0,
                scale: 0.8,
                duration: 200,
                complete: () => tooltip.remove()
            });
        }, 3000);
    }

    showFlowInfo(index) {
        const flowInfo = [
            "Data Ingestion: Raw data enters SNAP processing pipeline",
            "Query Optimization: AI analyzes and rewrites queries for optimal execution",
            "Cache Layer: Intelligent caching system stores frequently accessed data",
            "Results Output: Optimized results delivered in real-time"
        ];

        if (flowInfo[index]) {
            console.log('Flow Info:', flowInfo[index]);
            // Could show this in a toast notification or info panel
        }
    }
    
    setupCodeSnippets() {
        this.createInteractiveCodeDemo();
    }
    
    createInteractiveCodeDemo() {
        // Find the technical innovations section to insert code demos
        const techSection = document.querySelector('#technical-innovations');
        if (!techSection) return;
        
        const codeDemoHTML = `
            <div class="code-demo-section">
                <h4>Interactive Technical Demonstrations</h4>
                
                <div class="demo-tabs">
                    <button class="demo-tab active" data-demo="optimization">Query Optimization</button>
                    <button class="demo-tab" data-demo="caching">Intelligent Caching</button>
                    <button class="demo-tab" data-demo="metadata">Metadata Management</button>
                </div>
                
                <div class="demo-content">
                    <div class="demo-panel active" data-demo="optimization">
                        <div class="code-comparison">
                            <div class="code-block before">
                                <h5>Traditional Spark Query</h5>
                                <pre><code id="traditional-code"></code></pre>
                                <div class="execution-time">Before optimization</div>
                            </div>
                            <div class="code-block after">
                                <h5>SNAP Optimized Query</h5>
                                <pre><code id="optimized-code"></code></pre>
                                <div class="execution-time">After optimization</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="demo-panel" data-demo="caching">
                        <div class="cache-visualization">
                            <div class="cache-layers">
                                <div class="cache-layer" data-layer="l1">
                                    <div class="layer-label">L1 Cache</div>
                                    <div class="layer-stats">Hit Rate: <span class="hit-rate" data-rate="96">0</span>%</div>
                                    <div class="layer-bar"><div class="layer-fill" data-width="96"></div></div>
                                </div>
                                <div class="cache-layer" data-layer="l2">
                                    <div class="layer-label">L2 Cache</div>
                                    <div class="layer-stats">Hit Rate: <span class="hit-rate" data-rate="88">0</span>%</div>
                                    <div class="layer-bar"><div class="layer-fill" data-width="88"></div></div>
                                </div>
                                <div class="cache-layer" data-layer="memory">
                                    <div class="layer-label">Memory</div>
                                    <div class="layer-stats">Hit Rate: <span class="hit-rate" data-rate="75">0</span>%</div>
                                    <div class="layer-bar"><div class="layer-fill" data-width="75"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="demo-panel" data-demo="metadata">
                        <div class="metadata-flow">
                            <div class="flow-node" data-node="ingest">
                                <div class="node-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
                                        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                </div>
                                <div class="node-label">Data Ingestion</div>
                                <div class="node-throughput">1.2TB/h</div>
                            </div>
                            <div class="flow-arrow">→</div>
                            <div class="flow-node" data-node="catalog">
                                <div class="node-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                </div>
                                <div class="node-label">Metadata Catalog</div>
                                <div class="node-throughput">Real-time</div>
                            </div>
                            <div class="flow-arrow">→</div>
                            <div class="flow-node" data-node="query">
                                <div class="node-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                                        <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                </div>
                                <div class="node-label">Query Engine</div>
                                <div class="node-throughput">Optimized</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        techSection.insertAdjacentHTML('afterend', codeDemoHTML);
        this.setupCodeDemoInteractions();
        this.animateCode();
    }
    
    setupCodeDemoInteractions() {
        const tabs = document.querySelectorAll('.demo-tab');
        const panels = document.querySelectorAll('.demo-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetDemo = tab.getAttribute('data-demo');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active panel
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.getAttribute('data-demo') === targetDemo) {
                        panel.classList.add('active');
                        this.animatePanel(panel);
                    }
                });
            });
        });
    }
    
    animateCode() {
        const traditionalCode = `
// Traditional Spark Query
val df = spark.read.parquet("data.parquet")
df.filter($"timestamp" > "2024-01-01")
  .groupBy($"category")
  .agg(sum($"amount"))
  .orderBy($"category")
  .collect()
        `.trim();
        
        const optimizedCode = `
// SNAP Optimized Query
val df = snap.readCached("data.parquet")
df.filterOptimized($"timestamp" > "2024-01-01")
  .groupByIndex($"category") // Index-based grouping
  .aggregateParallel(sum($"amount"))
  .collectStreaming() // Streaming results
        `.trim();
        
        this.typewriterEffect('traditional-code', traditionalCode, 50);
        setTimeout(() => {
            this.typewriterEffect('optimized-code', optimizedCode, 50);
        }, 1000);
    }
    
    typewriterEffect(elementId, text, speed) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    animatePanel(panel) {
        if (panel.getAttribute('data-demo') === 'caching') {
            this.animateCacheVisualization();
        } else if (panel.getAttribute('data-demo') === 'metadata') {
            this.animateMetadataFlow();
        }
    }
    
    animateCacheVisualization() {
        const hitRates = document.querySelectorAll('.hit-rate');
        const layerFills = document.querySelectorAll('.layer-fill');
        
        hitRates.forEach((rate, index) => {
            const target = parseInt(rate.getAttribute('data-rate'));
            const counter = { value: 0 };
            
            anime({
                targets: counter,
                value: target,
                duration: 1500,
                delay: index * 200,
                easing: 'easeOutExpo',
                update: () => {
                    rate.textContent = Math.round(counter.value);
                }
            });
        });
        
        layerFills.forEach((fill, index) => {
            const width = parseInt(fill.getAttribute('data-width'));
            
            anime({
                targets: fill,
                width: width + '%',
                duration: 1500,
                delay: index * 200,
                easing: 'easeOutExpo'
            });
        });
    }
    
    animateMetadataFlow() {
        const nodes = document.querySelectorAll('.flow-node');
        const arrows = document.querySelectorAll('.flow-arrow');
        
        nodes.forEach((node, index) => {
            anime({
                targets: node,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 600,
                delay: index * 300,
                easing: 'easeOutBack'
            });
        });
        
        arrows.forEach((arrow, index) => {
            anime({
                targets: arrow,
                translateX: [-20, 0],
                opacity: [0, 1],
                duration: 400,
                delay: (index + 1) * 300,
                easing: 'easeOutExpo'
            });
        });
    }
    
    setupParticleEffects() {
        this.createDataFlowParticles();
        this.setupMouseInteraction();
    }
    
    createDataFlowParticles() {
        // Create particle canvas
        const particleCanvas = document.createElement('canvas');
        particleCanvas.id = 'particle-canvas';
        particleCanvas.style.position = 'fixed';
        particleCanvas.style.top = '0';
        particleCanvas.style.left = '0';
        particleCanvas.style.width = '100%';
        particleCanvas.style.height = '100%';
        particleCanvas.style.pointerEvents = 'none';
        particleCanvas.style.zIndex = '1';
        particleCanvas.style.opacity = '0.6';
        
        document.body.appendChild(particleCanvas);
        
        const ctx = particleCanvas.getContext('2d');
        let animationId;
        
        // Resize canvas
        const resizeCanvas = () => {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle system
        const particles = [];
        const particleCount = 50;
        
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * particleCanvas.height;
                this.life = Math.random() * 100;
            }
            
            reset() {
                this.x = -10;
                this.y = Math.random() * particleCanvas.height;
                this.speed = Math.random() * 2 + 0.5;
                this.size = Math.random() * 3 + 1;
                this.life = 100;
                this.decay = Math.random() * 0.5 + 0.5;
                
                // Color gradient
                const colors = [
                    { r: 168, g: 145, b: 209 }, // Purple
                    { r: 120, g: 119, b: 198 }, // Blue-purple
                    { r: 16, g: 185, b: 129 }   // Green
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.speed;
                this.y += Math.sin(this.x * 0.01) * 0.5;
                this.life -= this.decay;
                
                if (this.x > particleCanvas.width + 10 || this.life <= 0) {
                    this.reset();
                }
            }
            
            draw() {
                const alpha = Math.max(0, this.life / 100);
                ctx.save();
                ctx.globalAlpha = alpha * 0.8;
                
                // Create gradient
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            this.drawConnections(ctx, particles);
            
            animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) cancelAnimationFrame(animationId);
        });
    }
    
    drawConnections(ctx, particles) {
        const maxDistance = 100;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const alpha = (1 - distance / maxDistance) * 0.3;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = 'rgba(168, 145, 209, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }
    
    setupMouseInteraction() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Create ripple effect on interactive elements
            this.createMouseRipple(mouseX, mouseY);
        });
    }
    
    createMouseRipple(x, y) {
        const element = document.elementFromPoint(x, y);
        if (!element) return;
        
        // Check if element is interactive
        const interactiveElements = [
            '.result-card', '.demo-tab', '.timeline-item', 
            '.throughput-bar', '.metric-gauge', '.flow-node'
        ];
        
        const isInteractive = interactiveElements.some(selector => {
            return element.closest(selector);
        });
        
        if (isInteractive && Math.random() > 0.95) { // Occasional ripple
            const ripple = document.createElement('div');
            ripple.className = 'mouse-ripple';
            ripple.style.left = (x - 15) + 'px';
            ripple.style.top = (y - 15) + 'px';
            
            document.body.appendChild(ripple);
            
            anime({
                targets: ripple,
                scale: [0, 3],
                opacity: [0.6, 0],
                duration: 800,
                easing: 'easeOutExpo',
                complete: () => ripple.remove()
            });
        }
    }
    
    
    setupArchitectureExplorer() {
        this.createArchitectureExplorer();
    }
    
    createArchitectureExplorer() {
        // Find the technical architecture section
        const techArchSection = document.querySelector('#technical-architecture');
        if (!techArchSection) return;
        
        const architectureHTML = `
            <div class="architecture-explorer">
                <h4>Interactive Architecture Explorer</h4>
                <p class="architecture-subtitle">Click on any component to explore its functionality</p>
                
                <div class="architecture-diagram">
                    <svg viewBox="0 0 1000 600" class="architecture-svg">
                        <!-- Client Applications Layer -->
                        <g class="architecture-layer" data-layer="clients">
                            <rect x="50" y="50" width="200" height="80" rx="10" class="layer-bg clients"/>
                            <text x="150" y="95" class="layer-title">Client Applications</text>
                            
                            <!-- Client Components -->
                            <g class="component-group" data-component="web-app">
                                <rect x="70" y="110" width="60" height="40" rx="5" class="component web-app"/>
                                <text x="100" y="135" class="component-label">Web</text>
                            </g>
                            <g class="component-group" data-component="mobile-app">
                                <rect x="140" y="110" width="60" height="40" rx="5" class="component mobile-app"/>
                                <text x="170" y="135" class="component-label">Mobile</text>
                            </g>
                            <g class="component-group" data-component="api">
                                <rect x="210" y="110" width="60" height="40" rx="5" class="component api"/>
                                <text x="240" y="135" class="component-label">API</text>
                            </g>
                        </g>
                        
                        <!-- Gateway Layer -->
                        <g class="architecture-layer" data-layer="gateway">
                            <rect x="350" y="50" width="300" height="80" rx="10" class="layer-bg gateway"/>
                            <text x="500" y="95" class="layer-title">SNAP Gateway</text>
                            
                            <!-- Gateway Components -->
                            <g class="component-group" data-component="load-balancer">
                                <rect x="370" y="110" width="80" height="40" rx="5" class="component load-balancer"/>
                                <text x="410" y="135" class="component-label">Load Balancer</text>
                            </g>
                            <g class="component-group" data-component="auth">
                                <rect x="460" y="110" width="80" height="40" rx="5" class="component auth"/>
                                <text x="500" y="135" class="component-label">Auth</text>
                            </g>
                            <g class="component-group" data-component="rate-limiter">
                                <rect x="550" y="110" width="80" height="40" rx="5" class="component rate-limiter"/>
                                <text x="590" y="135" class="component-label">Rate Limiter</text>
                            </g>
                        </g>
                        
                        <!-- Processing Engine Layer -->
                        <g class="architecture-layer" data-layer="engine">
                            <rect x="50" y="200" width="600" height="150" rx="10" class="layer-bg engine"/>
                            <text x="350" y="230" class="layer-title">SNAP Processing Engine</text>
                            
                            <!-- Engine Components -->
                            <g class="component-group" data-component="query-optimizer">
                                <rect x="80" y="250" width="120" height="60" rx="5" class="component query-optimizer"/>
                                <text x="140" y="285" class="component-label">Query Optimizer</text>
                            </g>
                            <g class="component-group" data-component="cache-manager">
                                <rect x="220" y="250" width="120" height="60" rx="5" class="component cache-manager"/>
                                <text x="280" y="285" class="component-label">Cache Manager</text>
                            </g>
                            <g class="component-group" data-component="execution-engine">
                                <rect x="360" y="250" width="120" height="60" rx="5" class="component execution-engine"/>
                                <text x="420" y="285" class="component-label">Execution Engine</text>
                            </g>
                            <g class="component-group" data-component="metadata-catalog">
                                <rect x="500" y="250" width="120" height="60" rx="5" class="component metadata-catalog"/>
                                <text x="560" y="285" class="component-label">Metadata Catalog</text>
                            </g>
                        </g>
                        
                        <!-- Storage Layer -->
                        <g class="architecture-layer" data-layer="storage">
                            <rect x="50" y="400" width="600" height="150" rx="10" class="layer-bg storage"/>
                            <text x="350" y="430" class="layer-title">Storage & Data Layer</text>
                            
                            <!-- Storage Components -->
                            <g class="component-group" data-component="hdfs">
                                <rect x="80" y="450" width="120" height="60" rx="5" class="component hdfs"/>
                                <text x="140" y="485" class="component-label">HDFS</text>
                            </g>
                            <g class="component-group" data-component="s3">
                                <rect x="220" y="450" width="120" height="60" rx="5" class="component s3"/>
                                <text x="280" y="485" class="component-label">S3</text>
                            </g>
                            <g class="component-group" data-component="database">
                                <rect x="360" y="450" width="120" height="60" rx="5" class="component database"/>
                                <text x="420" y="485" class="component-label">Database</text>
                            </g>
                            <g class="component-group" data-component="streaming">
                                <rect x="500" y="450" width="120" height="60" rx="5" class="component streaming"/>
                                <text x="560" y="485" class="component-label">Streaming</text>
                            </g>
                        </g>
                        
                        <!-- Monitoring Layer -->
                        <g class="architecture-layer" data-layer="monitoring">
                            <rect x="700" y="200" width="250" height="350" rx="10" class="layer-bg monitoring"/>
                            <text x="825" y="230" class="layer-title">Monitoring & Ops</text>
                            
                            <!-- Monitoring Components -->
                            <g class="component-group" data-component="metrics">
                                <rect x="720" y="250" width="100" height="50" rx="5" class="component metrics"/>
                                <text x="770" y="280" class="component-label">Metrics</text>
                            </g>
                            <g class="component-group" data-component="logging">
                                <rect x="830" y="250" width="100" height="50" rx="5" class="component logging"/>
                                <text x="880" y="280" class="component-label">Logging</text>
                            </g>
                            <g class="component-group" data-component="alerting">
                                <rect x="720" y="320" width="100" height="50" rx="5" class="component alerting"/>
                                <text x="770" y="350" class="component-label">Alerting</text>
                            </g>
                            <g class="component-group" data-component="dashboard">
                                <rect x="830" y="320" width="100" height="50" rx="5" class="component dashboard"/>
                                <text x="880" y="350" class="component-label">Dashboard</text>
                            </g>
                            <g class="component-group" data-component="health-check">
                                <rect x="775" y="390" width="100" height="50" rx="5" class="component health-check"/>
                                <text x="825" y="420" class="component-label">Health Check</text>
                            </g>
                            <g class="component-group" data-component="auto-scaling">
                                <rect x="775" y="460" width="100" height="50" rx="5" class="component auto-scaling"/>
                                <text x="825" y="490" class="component-label">Auto Scaling</text>
                            </g>
                        </g>
                        
                        <!-- Connection Lines -->
                        <g class="connections" stroke="#a891d1" stroke-width="2" fill="none" opacity="0.6">
                            <!-- Clients to Gateway -->
                            <path d="M250 90 L350 90" class="connection-line"/>
                            <!-- Gateway to Engine -->
                            <path d="M500 130 L500 200" class="connection-line"/>
                            <!-- Engine to Storage -->
                            <path d="M350 350 L350 400" class="connection-line"/>
                            <!-- Engine to Monitoring -->
                            <path d="M650 275 L700 275" class="connection-line"/>
                            <!-- Storage to Monitoring -->
                            <path d="M650 475 L700 475" class="connection-line"/>
                        </g>
                    </svg>
                    
                    <!-- Component Details Panel -->
                    <div class="component-details" id="component-details">
                        <div class="details-header">
                            <h5 id="component-title">Select a component</h5>
                            <button class="close-details" id="close-details">×</button>
                        </div>
                        <div class="details-content" id="component-description">
                            Click on any component in the architecture diagram to learn more about its role and functionality.
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        techArchSection.insertAdjacentHTML('afterend', architectureHTML);
        this.setupArchitectureInteractions();
    }
    
    setupArchitectureInteractions() {
        const componentDetails = {
            'web-app': {
                title: 'Web Application',
                description: 'React-based web interface providing interactive dashboards, query builders, and real-time analytics visualization for business users and analysts.'
            },
            'mobile-app': {
                title: 'Mobile Application',
                description: 'Native mobile apps for iOS and Android enabling on-the-go data access, alerts, and basic analytics capabilities for field workers and executives.'
            },
            'api': {
                title: 'REST API',
                description: 'Comprehensive RESTful API enabling third-party integrations, custom applications, and programmatic access to SNAP processing capabilities.'
            },
            'load-balancer': {
                title: 'Load Balancer',
                description: 'Intelligent request distribution across multiple SNAP nodes with health checking, failover, and adaptive routing based on system load and performance.'
            },
            'auth': {
                title: 'Authentication Service',
                description: 'Enterprise-grade authentication and authorization with LDAP/AD integration, JWT tokens, role-based access control, and audit logging.'
            },
            'rate-limiter': {
                title: 'Rate Limiter',
                description: 'Advanced throttling system preventing abuse, managing resource allocation per user/tenant, and ensuring fair usage across concurrent workloads.'
            },
            'query-optimizer': {
                title: 'Query Optimizer',
                description: 'AI-powered query optimization engine that rewrites SQL queries, selects optimal execution plans, and leverages cached results for significant performance improvements.'
            },
            'cache-manager': {
                title: 'Intelligent Cache Manager',
                description: 'Multi-tier caching system with L1/L2 memory caches, predictive preloading, cache invalidation strategies, and 96% hit rates for frequently accessed data.'
            },
            'execution-engine': {
                title: 'Execution Engine',
                description: 'High-performance query execution engine with vectorized processing, columnar storage optimization, and parallel execution across distributed clusters.'
            },
            'metadata-catalog': {
                title: 'Metadata Catalog',
                description: 'Centralized metadata repository tracking data lineage, schema evolution, table statistics, and optimization hints for intelligent query planning.'
            },
            'hdfs': {
                title: 'Hadoop Distributed File System',
                description: 'Scalable distributed storage for large datasets with automatic replication, fault tolerance, and seamless integration with Spark processing framework.'
            },
            's3': {
                title: 'Amazon S3 Storage',
                description: 'Cloud-native object storage integration providing unlimited scalability, cost-effective archival, and global data replication capabilities.'
            },
            'database': {
                title: 'Database Systems',
                description: 'Multi-database connectivity supporting PostgreSQL, MySQL, Oracle, SQL Server with optimized connectors and parallel data loading capabilities.'
            },
            'streaming': {
                title: 'Streaming Data',
                description: 'Real-time data ingestion from Kafka, Kinesis, and other streaming platforms with exactly-once processing guarantees and low-latency analytics.'
            },
            'metrics': {
                title: 'Performance Metrics',
                description: 'Comprehensive performance monitoring tracking query execution times, resource utilization, throughput, and custom business metrics with historical trending.'
            },
            'logging': {
                title: 'Centralized Logging',
                description: 'Structured logging system aggregating application logs, audit trails, error traces with advanced search, filtering, and retention policies.'
            },
            'alerting': {
                title: 'Intelligent Alerting',
                description: 'Proactive alerting system with anomaly detection, predictive warnings, escalation policies, and integration with PagerDuty, Slack, and email.'
            },
            'dashboard': {
                title: 'Operations Dashboard',
                description: 'Real-time operational dashboard providing system health overview, performance KPIs, active queries, and infrastructure status monitoring.'
            },
            'health-check': {
                title: 'Health Monitoring',
                description: 'Continuous health checks across all system components with automated failure detection, root cause analysis, and self-healing capabilities.'
            },
            'auto-scaling': {
                title: 'Auto-Scaling Engine',
                description: 'Dynamic resource scaling based on workload patterns, predictive analytics, and cost optimization with seamless cluster expansion/contraction.'
            }
        };
        
        // Add click handlers for components
        document.querySelectorAll('.component-group').forEach(group => {
            group.addEventListener('click', (e) => {
                e.stopPropagation();
                const componentId = group.getAttribute('data-component');
                const details = componentDetails[componentId];
                
                if (details) {
                    this.showComponentDetails(details);
                    this.highlightComponent(group);
                }
            });
            
            // Add hover effects
            group.addEventListener('mouseenter', () => {
                const component = group.querySelector('.component');
                const bbox = component.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;
                
                // Set transform origin to center of the element
                component.style.transformOrigin = `${centerX}px ${centerY}px`;
                
                anime({
                    targets: component,
                    scale: [1, 1.1],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            
            group.addEventListener('mouseleave', () => {
                const component = group.querySelector('.component');
                anime({
                    targets: component,
                    scale: [1.1, 1],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
        
        // Close details panel
        document.getElementById('close-details').addEventListener('click', () => {
            this.hideComponentDetails();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.architecture-explorer')) {
                this.hideComponentDetails();
            }
        });
    }
    
    showComponentDetails(details) {
        const panel = document.getElementById('component-details');
        const title = document.getElementById('component-title');
        const description = document.getElementById('component-description');
        
        title.textContent = details.title;
        description.textContent = details.description;
        
        panel.classList.add('active');
        
        anime({
            targets: panel,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
    }
    
    hideComponentDetails() {
        const panel = document.getElementById('component-details');
        panel.classList.remove('active');
        
        // Remove highlights
        document.querySelectorAll('.component.highlighted').forEach(component => {
            component.classList.remove('highlighted');
        });
    }
    
    highlightComponent(group) {
        // Remove previous highlights
        document.querySelectorAll('.component.highlighted').forEach(component => {
            component.classList.remove('highlighted');
        });
        
        // Add new highlight
        const component = group.querySelector('.component');
        component.classList.add('highlighted');
        
        // Pulse effect
        anime({
            targets: component,
            scale: [1, 1.2, 1],
            duration: 600,
            easing: 'easeInOutQuad'
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SparklineProjectEnhancer();
});