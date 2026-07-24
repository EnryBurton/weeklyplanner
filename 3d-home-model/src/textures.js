// Procedural canvas textures — keeps the whole project self-contained (no external image assets).

function canvasTex(THREE, size, draw, repeat) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  if (repeat) tex.repeat.set(repeat[0], repeat[1]);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function brickTexture(THREE) {
  return canvasTex(THREE, 256, (ctx, s) => {
    ctx.fillStyle = '#8f3b2a';
    ctx.fillRect(0, 0, s, s);
    const rowH = s / 8;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 8; r++) {
      const y = r * rowH;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke();
      const offset = (r % 2) * (s / 8);
      for (let c = -1; c < 8; c++) {
        const x = c * (s / 4) + offset;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + rowH); ctx.stroke();
      }
    }
    // subtle colour variation
    for (let i = 0; i < 220; i++) {
      ctx.fillStyle = `rgba(${100 + Math.random() * 60},${40 + Math.random() * 30},${25 + Math.random() * 20},0.25)`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 6, 3);
    }
  }, [3, 1.2]);
}

export function terracottaRoofTexture(THREE) {
  return canvasTex(THREE, 128, (ctx, s) => {
    ctx.fillStyle = '#8a3a24';
    ctx.fillRect(0, 0, s, s);
    const w = s / 8;
    for (let c = 0; c < 8; c++) {
      const grd = ctx.createLinearGradient(c * w, 0, c * w + w, 0);
      grd.addColorStop(0, 'rgba(0,0,0,0.35)');
      grd.addColorStop(0.5, 'rgba(255,255,255,0.12)');
      grd.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = grd;
      ctx.fillRect(c * w, 0, w, s);
    }
  }, [1, 3]);
}

export function corrugatedTexture(THREE, color = '#8a8f94') {
  return canvasTex(THREE, 64, (ctx, s) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, s, s);
    const w = s / 16;
    for (let c = 0; c < 16; c++) {
      const grd = ctx.createLinearGradient(c * w, 0, c * w + w, 0);
      grd.addColorStop(0, 'rgba(255,255,255,0.25)');
      grd.addColorStop(0.5, 'rgba(0,0,0,0.25)');
      grd.addColorStop(1, 'rgba(255,255,255,0.1)');
      ctx.fillStyle = grd;
      ctx.fillRect(c * w, 0, w, s);
    }
  }, [4, 1]);
}

export function timberDeckTexture(THREE) {
  return canvasTex(THREE, 128, (ctx, s) => {
    ctx.fillStyle = '#a9793f';
    ctx.fillRect(0, 0, s, s);
    const rowH = s / 8;
    for (let r = 0; r < 8; r++) {
      ctx.fillStyle = `rgba(${90 + Math.random() * 40},${60 + Math.random() * 25},${25 + Math.random() * 15},1)`;
      ctx.fillRect(0, r * rowH, s, rowH - 2);
    }
  }, [1, 6]);
}

export function grassTexture(THREE) {
  return canvasTex(THREE, 128, (ctx, s) => {
    ctx.fillStyle = '#4c7a3a';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(${60 + Math.random() * 40},${110 + Math.random() * 50},${40 + Math.random() * 30},0.5)`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 6);
    }
  }, [10, 26]);
}

export function paversTexture(THREE) {
  return canvasTex(THREE, 128, (ctx, s) => {
    ctx.fillStyle = '#c9c2b6';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 3;
    const n = 4;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * s / n); ctx.lineTo(s, i * s / n); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i * s / n, 0); ctx.lineTo(i * s / n, s); ctx.stroke();
    }
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 10, 10);
    }
  }, [8, 20]);
}

export function gravelTexture(THREE) {
  return canvasTex(THREE, 128, (ctx, s) => {
    ctx.fillStyle = '#a9a29a';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = `rgba(${120 + Math.random() * 60},${115 + Math.random() * 60},${105 + Math.random() * 60},0.7)`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
  }, [4, 10]);
}

export function hallwayFloorTexture(THREE) {
  return canvasTex(THREE, 128, (ctx, s) => {
    ctx.fillStyle = '#c99a5b';
    ctx.fillRect(0, 0, s, s);
    const colW = s / 10;
    for (let c = 0; c < 10; c++) {
      ctx.fillStyle = `rgba(${170 + Math.random() * 40},${120 + Math.random() * 30},${60 + Math.random() * 20},1)`;
      ctx.fillRect(c * colW, 0, colW - 1, s);
    }
  }, [10, 30]);
}
