// --- Fundo galáxia (igual anterior) ---

const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let width, height, cx, cy;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  cx = width / 2;
  cy = height / 2;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

class Star {
  constructor(angle, radius, size, speed, color) {
    this.angle = angle;
    this.radius = radius;
    this.size = size;
    this.speed = speed;
    this.color = color;
  }

  update() {
    this.angle += this.speed;
    this.radius *= 1.0005;
  }

  draw(ctx) {
    const x = cx + this.radius * Math.cos(this.angle);
    const y = cy + this.radius * Math.sin(this.angle);

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size * 4);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const stars = [];
const starCount = 200;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < starCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.pow(Math.random(), 2) * 300;
  const size = randomBetween(0.5, 1.5);
  const speed = 0.0005 + radius * 0.000002;
  const color = `rgba(180, 220, 255, ${randomBetween(0.2, 0.8)})`;
  stars.push(new Star(angle, radius, size, speed, color));
}

function animateGalaxy() {
  ctx.clearRect(0, 0, width, height);

  const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
  coreGradient.addColorStop(0, 'rgba(200, 230, 255, 0.3)');
  coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.fill();

  stars.forEach(star => {
    star.update();
    star.draw(ctx);
  });

  requestAnimationFrame(animateGalaxy);
}

animateGalaxy();

// --- Imagens flutuantes e interação ---

const images = [
  {
    src: "https://cdn.pixabay.com/photo/2012/03/01/00/18/galaxy-19715_1280.jpg",
    caption: "Galáxia espiral distante"
  },
  {
    src: "https://cdn.pixabay.com/photo/2013/07/18/20/26/space-164471_1280.jpg",
    caption: "Nebulosa colorida no espaço"
  },
  {
    src: "https://cdn.pixabay.com/photo/2015/12/01/20/28/starry-night-1075783_1280.jpg",
    caption: "Céu estrelado com Via Láctea"
  },
  {
    src: "https://cdn.pixabay.com/photo/2015/03/26/09/54/solar-system-690157_1280.jpg",
    caption: "Sistema Solar artístico"
  },
  {
    src: "images/foto1.jpg",
    caption: "A parte do caption (o texto que aparece ao lado da imagem) deve ser adicionada dentro do array images que você já tem. Cada objeto dentro do array de imagens pode ter tanto o caminho da imagem (src) quanto o texto de referência (caption)."
  }
];

const floatingContainer = document.getElementById('floating-images-container');
const selectedContainer = document.getElementById('selected-image-container');
const selectedImage = document.getElementById('selected-image');
const selectedCaption = document.getElementById('selected-caption');

let floatingImages = [];
let animationId;
let mode = 'floating'; // 'floating' ou 'selected'
let selectedIndex = null;

// Cria imagens flutuantes pequenas
images.forEach((imgData, index) => {
  const img = document.createElement('img');
  img.src = imgData.src;
  img.classList.add('floating-image');
  img.style.top = `${Math.random() * (window.innerHeight - 80)}px`;
  img.style.left = `${Math.random() * (window.innerWidth - 80)}px`;
  img.dataset.index = index;
  floatingContainer.appendChild(img);

  floatingImages.push({
    element: img,
    x: parseFloat(img.style.left),
    y: parseFloat(img.style.top),
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  });

  img.addEventListener('click', (e) => {
    e.stopPropagation(); // evita que o clique propague para o body
    if (mode === 'floating') {
      selectedIndex = index;
      enterSelectedMode();
    }
  });
});

function animateFloating() {
  floatingImages.forEach(imgObj => {
    imgObj.x += imgObj.vx;
    imgObj.y += imgObj.vy;

    if (imgObj.x <= 0 || imgObj.x >= window.innerWidth - 80) imgObj.vx *= -1;
    if (imgObj.y <= 0 || imgObj.y >= window.innerHeight - 80) imgObj.vy *= -1;

    imgObj.element.style.left = imgObj.x + 'px';
    imgObj.element.style.top = imgObj.y + 'px';
  });

  animationId = requestAnimationFrame(animateFloating);
}

function enterSelectedMode() {
  mode = 'selected';

  // Para animação das imagens flutuantes
  cancelAnimationFrame(animationId);

  // Esconde todas as imagens pequenas
  floatingImages.forEach(imgObj => {
    imgObj.element.style.display = 'none';
  });

  // Mostra imagem centralizada
  const imgData = images[selectedIndex];
  selectedImage.src = imgData.src;
  selectedCaption.textContent = imgData.caption;
  selectedContainer.classList.remove('hidden');
}

function exitSelectedMode() {
  mode = 'floating';

  // Esconde imagem centralizada
  selectedContainer.classList.add('hidden'); // Torna o container invisível
  selectedImage.src = ''; // Limpa a imagem selecionada
  selectedCaption.textContent = ''; // Limpa o texto de legenda

  // Mostra as imagens flutuantes novamente
  floatingImages.forEach(imgObj => {
    imgObj.element.style.display = 'block';

    // Reposiciona aleatoriamente para variação
    imgObj.x = Math.random() * (window.innerWidth - 80);
    imgObj.y = Math.random() * (window.innerHeight - 80);
    imgObj.vx = (Math.random() - 0.5) * 0.4;
    imgObj.vy = (Math.random() - 0.5) * 0.4;
    imgObj.element.style.left = imgObj.x + 'px';
    imgObj.element.style.top = imgObj.y + 'px';
  });

  animateFloating();
}

// Clique em qualquer lugar da tela (incluindo na imagem ou legenda) fecha a imagem fixada
document.body.addEventListener('click', () => {
  if (mode === 'selected') {
    exitSelectedMode(); // Chama a função para sair do modo de seleção
  }
});


// Começa com animação flutuante
animateFloating();

// --- Relógio contando a partir de 29/03/2025 21:00 ---

const clockElement = document.getElementById('date-time-clock');
const startDate = new Date('2025-03-29T21:00:00');

function updateClock() {
  const now = new Date();
  let diff = now - startDate; // diferença em ms

  if (diff < 0) {
    // se a data atual for antes da data inicial, mostrar 0
    diff = 0;
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Formatar com zeros à esquerda
  const formattedTime = `${days}d ${hours.toString().padStart(2,'0')}h:${minutes.toString().padStart(2,'0')}m:${seconds.toString().padStart(2,'0')}s`;

  clockElement.textContent = formattedTime;
}

setInterval(updateClock, 1000);
updateClock();

function enterSelectedMode() {
  mode = 'selected';

  // Para animação das imagens flutuantes
  cancelAnimationFrame(animationId);

  // Esconde todas as imagens pequenas
  floatingImages.forEach(imgObj => {
    imgObj.element.style.display = 'none';
  });

  // Mostra imagem à direita com o texto à esquerda
  const imgData = images[selectedIndex];
  selectedImage.src = imgData.src;
  selectedCaption.textContent = imgData.caption;

  // Garante que o container seja mostrado e o conteúdo esteja correto
  selectedContainer.classList.remove('hidden');
}
