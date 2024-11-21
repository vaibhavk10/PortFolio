document.addEventListener('DOMContentLoaded', () => {
    // Debug log to verify script is running
    console.log('Script loaded');

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    // Debug log to verify elements are found
    console.log('Hamburger:', hamburger);
    console.log('Nav:', nav);

    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Hamburger clicked'); // Debug log
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        console.log('Menu state:', nav.classList.contains('active')); // Debug log
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Add email copy functionality
    const copyBtn = document.querySelector('.copy-btn');
    const emailElement = document.querySelector('.email');

    copyBtn.addEventListener('click', async () => {
        const email = emailElement.textContent;
        
        try {
            await navigator.clipboard.writeText(email);
            
            // Change button text temporarily to show success
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            
            // Revert button text after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy email:', err);
            
            // Show error state
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-times"></i><span>Failed to copy</span>';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
        }
    });

    // Initialize the animation when the document is loaded
    new NetworkAnimation();
});

class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.activeNode = null;
        
        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createNodes();
        this.createConnections();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createNodes();
    }

    createNodes() {
        this.nodes = [];
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 40000);
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                originalRadius: Math.random() * 2 + 2,
                color: `rgba(100, 181, 246, ${Math.random() * 0.5 + 0.5})`,
                glowIntensity: 0
            });
        }
    }

    createConnections() {
        this.connections = [];
        const maxDistance = 150;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    this.connections.push({
                        start: this.nodes[i],
                        end: this.nodes[j],
                        opacity: 1 - (distance / maxDistance)
                    });
                }
            }
        }
    }

    drawNode(node) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color;
        this.ctx.fill();

        // Add glow effect
        if (node.glowIntensity > 0) {
            this.ctx.shadowBlur = 15 * node.glowIntensity;
            this.ctx.shadowColor = 'rgba(100, 181, 246, 0.8)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }

    drawConnection(conn) {
        const gradient = this.ctx.createLinearGradient(
            conn.start.x, conn.start.y,
            conn.end.x, conn.end.y
        );
        
        gradient.addColorStop(0, `rgba(100, 181, 246, ${conn.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(123, 31, 162, ${conn.opacity * 0.5})`);

        this.ctx.beginPath();
        this.ctx.moveTo(conn.start.x, conn.start.y);
        this.ctx.lineTo(conn.end.x, conn.end.y);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Update glow based on mouse proximity
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxGlowDistance = 150;

            if (distance < maxGlowDistance) {
                node.glowIntensity = 1 - (distance / maxGlowDistance);
                node.radius = node.originalRadius * (1 + node.glowIntensity);
            } else {
                node.glowIntensity = 0;
                node.radius = node.originalRadius;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateNodes();
        this.createConnections();
        
        this.connections.forEach(conn => this.drawConnection(conn));
        this.nodes.forEach(node => this.drawNode(node));
        
        requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    async transitionOut() {
        const duration = 1000;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                this.nodes.forEach(node => {
                    node.vx *= 1.05;
                    node.vy *= 1.05;
                    node.opacity = 1 - progress;
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }

    async transitionIn() {
        this.createNodes();
        const duration = 1000;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                this.nodes.forEach(node => {
                    node.opacity = progress;
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }
}