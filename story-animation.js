(() => {
    const canvas = document.getElementById('mentorship-story');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const host = canvas.closest('.logo-story');
    const captions = host?.querySelectorAll('.story-caption span') || [];
    const mantra = host?.querySelector('.visual-mantra');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = 14000;
    let start = performance.now();
    let width = 600;
    let height = 620;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const mix = (a, b, t) => a + (b - a) * t;
    const ease = t => 1 - Math.pow(1 - clamp(t), 3);
    const smooth = t => {
        t = clamp(t);
        return t * t * (3 - 2 * t);
    };
    const phase = (t, from, to) => smooth((t - from) / (to - from));

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(rect.width * ratio));
        canvas.height = Math.max(1, Math.round(rect.height * ratio));
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        width = rect.width;
        height = rect.height;
    }

    function palette() {
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        return dark ? {
            sky: '#091b13', glow: 'rgba(236,162,83,.25)', sunA: '#f3b36e', sunB: '#c97131',
            bridge: '#78935d', bridgeDark: '#445b38', student: '#dbe4ea', mentor: '#a9c58f',
            peerA: '#e5d1b6', peerB: '#c2d6b0', skin: '#d79c69', line: 'rgba(239,224,201,.24)'
        } : {
            sky: '#f8f4ec', glow: 'rgba(224,137,55,.19)', sunA: '#f0aa5d', sunB: '#cb6d31',
            bridge: '#6f8e50', bridgeDark: '#48643c', student: '#29465f', mentor: '#52723f',
            peerA: '#6a4d3b', peerB: '#315d45', skin: '#b9784c', line: 'rgba(41,70,95,.17)'
        };
    }

    function line(x1, y1, x2, y2, color, size = 8) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    function drawBackdrop(p, t) {
        const emotionalLift = phase(t, .68, .86);
        const sunY = mix(height * .79, height * .39, emotionalLift);
        const radius = width * .1;
        const warmth = ctx.createLinearGradient(0, 0, width, height);
        warmth.addColorStop(0, 'rgba(255,214,145,0)');
        warmth.addColorStop(.55, 'rgba(255,196,93,.18)');
        warmth.addColorStop(1, 'rgba(235,151,61,.08)');
        ctx.fillStyle = warmth;
        ctx.globalAlpha = emotionalLift * .92;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;

        const glow = ctx.createRadialGradient(width / 2, sunY, 0, width / 2, sunY, radius * 3.3);
        glow.addColorStop(0, p.glow);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = emotionalLift * .88;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;

        const deckY = height * .715;
        const sunGradient = ctx.createRadialGradient(width / 2 - radius * .3, sunY - radius * .35, radius * .08, width / 2, sunY, radius);
        sunGradient.addColorStop(0, '#ffd59a');
        sunGradient.addColorStop(.45, p.sunA);
        sunGradient.addColorStop(1, p.sunB);
        ctx.save();
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 34 + emotionalLift * 30;
        ctx.translate(width / 2, sunY);
        ctx.rotate(t * Math.PI * .5);
        ctx.globalAlpha = emotionalLift * .65;
        for (let i = 0; i < 14; i++) {
            ctx.rotate(Math.PI * 2 / 14);
            const rayLength = radius * (1.7 + (i % 2) * .25);
            line(0, -radius * 1.25, 0, -rayLength, p.sunA, i % 2 ? 2 : 3);
        }
        ctx.restore();

        ctx.save();
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 34 + emotionalLift * 30;
        ctx.beginPath();
        ctx.arc(width / 2, sunY, radius, 0, Math.PI * 2);
        ctx.fillStyle = sunGradient;
        ctx.globalAlpha = emotionalLift;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(width * .08, deckY + 7);
        ctx.quadraticCurveTo(width / 2, height * .54, width * .92, deckY + 7);
        ctx.strokeStyle = p.bridgeDark;
        ctx.lineWidth = Math.max(27, width * .055);
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(0,0,0,.28)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 12;
        ctx.stroke();
        ctx.shadowColor = 'transparent';
        ctx.beginPath();
        ctx.moveTo(width * .08, deckY);
        ctx.quadraticCurveTo(width / 2, height * .54, width * .92, deckY);
        ctx.strokeStyle = p.bridge;
        ctx.lineWidth = Math.max(20, width * .044);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width * .1, deckY - 4);
        ctx.quadraticCurveTo(width / 2, height * .545, width * .9, deckY - 4);
        ctx.strokeStyle = 'rgba(233,247,199,.45)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        const sweep = (t * 1.35) % 1;
        const sweepX = mix(width * .13, width * .87, sweep);
        const sweepGlow = ctx.createRadialGradient(sweepX, deckY, 0, sweepX, deckY, 35);
        sweepGlow.addColorStop(0, 'rgba(238,206,133,.72)');
        sweepGlow.addColorStop(1, 'rgba(238,206,133,0)');
        ctx.fillStyle = sweepGlow;
        ctx.globalAlpha = .35 + emotionalLift * .5;
        ctx.fillRect(sweepX - 38, deckY - 30, 76, 60);
        ctx.globalAlpha = 1;
    }

    function drawPerson({ x, y, scale = 1, color, skin, lean = 0, facing = 1, walk = 0, kneel = 0, reach = 0, shoulder = 0, lookUp = 0, backpack = false, alpha = 1 }) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.scale(facing * scale, scale);
        ctx.rotate(lean);
        ctx.shadowColor = 'rgba(0,0,0,.2)';
        ctx.shadowBlur = 9;
        ctx.shadowOffsetY = 5;

        ctx.save();
        ctx.scale(facing, 1);
        ctx.beginPath();
        ctx.ellipse(0, 4, 29, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,.16)';
        ctx.fill();
        ctx.restore();

        const hip = { x: 0, y: -42 };
        const shoulderPt = { x: 0, y: -91 };
        const head = { x: lookUp * 3, y: -121 - lookUp * 5 };
        const step = Math.sin(walk * Math.PI * 2) * 15 * (1 - kneel);

        if (backpack) {
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha * .46;
            ctx.beginPath();
            ctx.roundRect(-22, -96, 23, 47, 8);
            ctx.fill();
            ctx.globalAlpha = alpha;
        }

        line(hip.x, hip.y, shoulderPt.x, shoulderPt.y, color, 17);
        ctx.beginPath();
        ctx.roundRect(-9, -90, 18, 42, 7);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * .95;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = alpha;
        line(-6, -83, 0, -49, 'rgba(255,255,255,.22)', 2);
        line(hip.x - 2, hip.y, -14 + step, -2 + kneel * 18, color, 10);
        line(hip.x + 2, hip.y, 14 - step, -2 + kneel * 18, color, 10);

        const restingHandX = 27;
        const restingHandY = -48;
        const offeredHandX = mix(restingHandX, 53, reach);
        const offeredHandY = mix(restingHandY, -71, reach);
        const reachingX = mix(offeredHandX, 61, shoulder);
        const reachingY = mix(offeredHandY, -93, shoulder);
        line(-5, -85, -29, -53, color, 9);
        line(5, -85, reachingX, reachingY, color, 9);

        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(-29, -53, 5, 0, Math.PI * 2);
        ctx.arc(reachingX, reachingY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(head.x - 2, head.y - 5, 16, Math.PI, Math.PI * 2);
        ctx.lineTo(head.x + 14, head.y - 1);
        ctx.quadraticCurveTo(head.x + 3, head.y - 17, head.x - 14, head.y - 4);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(5 + lookUp * 2, head.y + 1 - lookUp * 2, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#33261f';
        ctx.fill();

        ctx.restore();
    }

    function drawStory(t) {
        const p = palette();
        ctx.clearRect(0, 0, width, height);
        drawBackdrop(p, t);
        const ground = height * .715;

        const walkIn = ease(phase(t, .01, .2));
        const stumble = phase(t, .2, .29);
        const help = phase(t, .31, .48);
        const stand = phase(t, .44, .59);
        const peers = ease(phase(t, .58, .76));
        const lookToSun = phase(t, .7, .84);

        const studentX = mix(-45, width * .4, walkIn);
        const studentLean = mix(0, .42, stumble) * (1 - stand);
        const studentKneel = stumble * (1 - stand);
        drawPerson({
            x: studentX,
            y: ground,
            scale: .96,
            color: p.student,
            skin: p.skin,
            lean: studentLean,
            walk: t * 16,
            kneel: studentKneel,
            reach: help,
            lookUp: lookToSun,
            backpack: true
        });

        const mentorIn = ease(phase(t, .23, .38));
        const mentorX = mix(width + 45, width * .57, mentorIn);
        drawPerson({
            x: mentorX,
            y: ground,
            scale: 1.02,
            color: p.mentor,
            skin: p.skin,
            facing: -1,
            walk: t * 13,
            reach: help,
            shoulder: phase(t, .5, .62),
            lookUp: lookToSun
        });

        drawPerson({
            x: mix(-45, width * .24, peers), y: ground, scale: .86, color: p.peerA, skin: p.skin,
            walk: t * 15, alpha: phase(t, .58, .66), lookUp: lookToSun, backpack: true
        });
        drawPerson({
            x: mix(width + 45, width * .73, peers), y: ground, scale: .88, color: p.peerB, skin: p.skin,
            facing: -1, walk: t * 14, alpha: phase(t, .58, .66), lookUp: lookToSun, backpack: true
        });

        if (help > 0 && help < .85) {
            const sparkX = mix(studentX + 35, width * .49, help);
            const sparkY = ground - mix(54, 83, help);
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 5 + Math.sin(help * Math.PI) * 7, 0, Math.PI * 2);
            ctx.fillStyle = p.sunA;
            ctx.globalAlpha = Math.sin(help * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        captions.forEach((caption, index) => {
            const show = phase(t, .71 + index * .035, .77 + index * .035) * (1 - phase(t, .95, 1));
            caption.style.opacity = show.toFixed(3);
            caption.style.transform = `translateY(${(1 - show) * 8}px)`;
        });
        if (mantra) {
            const show = phase(t, .81, .87) * (1 - phase(t, .96, 1));
            mantra.style.opacity = show.toFixed(3);
            mantra.style.transform = `translateY(${(1 - show) * 7}px)`;
        }
    }

    function frame(now) {
        const t = reduceMotion ? .88 : ((now - start) % duration) / duration;
        drawStory(t);
        if (!reduceMotion) requestAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    requestAnimationFrame(frame);
})();
