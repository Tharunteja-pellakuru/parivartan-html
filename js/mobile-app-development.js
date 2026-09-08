/**
 * Mobile App Development Page Scripts - eParivartan
 * Smooth anchor scrolling, interactive UI hooks, canvas ecosystem, and page initialization
 */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth Anchor Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Mobile Tech Constellation Canvas (if canvas exists)
  const canvas = document.getElementById('tech-ecosystem');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = Math.max(parent.clientHeight, 400);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const nodes = [
      { name: 'Swift / iOS', x: 0.25, y: 0.35, vx: 0.3, vy: -0.2, r: 6, color: '#75BF46' },
      { name: 'Kotlin / Android', x: 0.45, y: 0.25, vx: -0.2, vy: 0.3, r: 6, color: '#599632' },
      { name: 'Flutter', x: 0.75, y: 0.3, vx: 0.2, vy: 0.2, r: 6, color: '#75BF46' },
      { name: 'React Native', x: 0.3, y: 0.7, vx: 0.25, vy: -0.15, r: 6, color: '#75BF46' },
      { name: 'Firebase', x: 0.65, y: 0.6, vx: -0.3, vy: -0.2, r: 5, color: '#599632' },
      { name: 'GraphQL / REST', x: 0.82, y: 0.68, vx: -0.2, vy: 0.15, r: 5, color: '#75BF46' },
      { name: 'SQLite / Realm', x: 0.15, y: 0.55, vx: 0.15, vy: 0.25, r: 5, color: '#599632' },
      { name: 'Fastlane CI/CD', x: 0.5, y: 0.8, vx: 0.2, vy: -0.25, r: 5, color: '#75BF46' }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * w;
          const dy = (nodes[i].y - nodes[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const opacity = 1 - dist / 220;
            ctx.strokeStyle = `rgba(117, 191, 70, ${opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        node.x += (node.vx * 0.001);
        node.y += (node.vy * 0.001);

        if (node.x <= 0.08 || node.x >= 0.92) node.vx *= -1;
        if (node.y <= 0.08 || node.y >= 0.92) node.vy *= -1;

        const nx = node.x * w;
        const ny = node.y * h;

        // Outer glow
        ctx.beginPath();
        ctx.arc(nx, ny, node.r + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(117, 191, 70, 0.15)';
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(nx, ny, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Label
        ctx.fillStyle = '#111827';
        ctx.font = '600 13px Satoshi, -apple-system, sans-serif';
        ctx.fillText(node.name, nx + 10, ny + 4);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }
});
