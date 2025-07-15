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
  { src: "images/foto1.jpg", caption: "Sistema Solar" },
  { src: "images/foto2.jpg", caption: "Sistema Solar artístico" },
  { src: "images/foto3.jpg", caption: "Céu estrelado com Via Láctea" },
  { src: "images/foto4.jpg", caption: "Nebulosa colorida no espaço" },
  { src: "images/foto5.jpg", caption: "Galáxia espiral distante" },
  { src: "images/foto6.jpg", caption: "Nebulosa de Órion" },
  { src: "images/foto7.jpg", caption: "Campo de estrelas" },
  { src: "images/foto8.jpg", caption: "Via Láctea sobre as montanhas" },
  { src: "images/foto9.jpg", caption: "Aglomerado de galáxias" },
  { src: "images/foto10.jpg", caption: "Estrela supernova" },
  { src: "images/foto11.jpg", caption: "Cúmulo globular" },
  { src: "images/foto12.jpg", caption: "Galáxia espiral em forma de borboleta" },
  { src: "images/foto13.jpg", caption: "Galáxia com braços espirais" },
  { src: "images/foto14.jpg", caption: "Sistema de anéis planetários" },
  { src: "images/foto15.jpg", caption: "Buraco negro no centro da galáxia" },
  { src: "images/foto16.jpg", caption: "Nebulosa de Carina" },
  { src: "images/foto17.jpg", caption: "Campo de asteroides" },
  { src: "images/foto18.jpg", caption: "Estrela binária" },
  { src: "images/foto19.jpg", caption: "Cometa em passagem próxima" },
  { src: "images/foto20.jpg", caption: "Galáxia irregular" },
  { src: "images/foto21.jpg", caption: "Zona habitável de uma estrela" },
  { src: "images/foto22.jpg", caption: "Vista telescópica de um exoplaneta" },
  { src: "images/foto23.jpg", caption: "Estrelas de formação recente" },
  { src: "images/foto24.jpg", caption: "Galáxia ativa no centro" },
  { src: "images/foto25.jpg", caption: "Nuvem de gás intergaláctica" },
  { src: "images/foto26.jpg", caption: "Planeta rochoso em órbita" },
  { src: "images/foto27.jpg", caption: "Estrela gigante vermelha" },
  { src: "images/foto28.jpg", caption: "Galáxia distante em radiação X" },
  { src: "images/foto29.jpg", caption: "Supernova em colapso" },
  { src: "images/foto30.jpg", caption: "Cometa de longo período" }
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

// Função para animar as imagens flutuantes
function animateFloating() {
  floatingImages.forEach(imgObj => {
    const nextX = imgObj.x + imgObj.vx;
    const nextY = imgObj.y + imgObj.vy;

    // Verificar colisões com outras imagens
    floatingImages.forEach(otherImgObj => {
      if (imgObj === otherImgObj) return; // Ignorar a própria imagem

      // Calcular a distância entre as imagens
      const distance = Math.sqrt(Math.pow(imgObj.x - otherImgObj.x, 2) + Math.pow(imgObj.y - otherImgObj.y, 2));

      // Se as imagens estiverem muito próximas (distância menor que 160px), afastá-las
      if (distance < 100) { // 160px é o limite de segurança para evitar que elas se toquem
        const angle = Math.atan2(imgObj.y - otherImgObj.y, imgObj.x - otherImgObj.x);
        const speedAdjustment = 0.02; // Ajuste da velocidade ao afastar as imagens

        // Modifica a direção das imagens para se afastarem (ajusta as velocidades)
        imgObj.vx += Math.cos(angle) * speedAdjustment;
        imgObj.vy += Math.sin(angle) * speedAdjustment;

        otherImgObj.vx -= Math.cos(angle) * speedAdjustment;
        otherImgObj.vy -= Math.sin(angle) * speedAdjustment;
      }
    });

    // Atualiza a posição da imagem
    imgObj.x = nextX;
    imgObj.y = nextY;

    // Verifica se a imagem chegou nas bordas da tela e inverte a direção
    if (imgObj.x <= 0 || imgObj.x >= window.innerWidth - 80) imgObj.vx *= -1;
    if (imgObj.y <= 0 || imgObj.y >= window.innerHeight - 80) imgObj.vy *= -1;

    // Atualiza a posição das imagens no estilo
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




// Função para esconder o título e o relógio
function hideTitleAndClock() {
  document.getElementById('space-title').style.display = 'none'; // Esconde o título
  document.getElementById('date-time-container').style.display = 'none'; // Esconde o relógio
}

// Função para mostrar o título e o relógio
function showTitleAndClock() {
  document.getElementById('space-title').style.display = 'block'; // Mostra o título
  document.getElementById('date-time-container').style.display = 'flex'; // Mostra o relógio (flex para manter alinhado)
}

// Modificando enterSelectedMode para esconder o título e o relógio
function enterSelectedMode() {
  mode = 'selected';

  // Esconde o título e o relógio
  hideTitleAndClock();

  // Para animação das imagens flutuantes
  cancelAnimationFrame(animationId);

  // Esconde todas as imagens pequenas
  floatingImages.forEach(imgObj => {
    imgObj.element.style.display = 'none';
  });

  // Mostra a imagem centralizada
  const imgData = images[selectedIndex];
  selectedImage.src = imgData.src;
  selectedCaption.textContent = imgData.caption;
  selectedContainer.classList.remove('hidden');
}

// Modificando exitSelectedMode para mostrar o título e o relógio
function exitSelectedMode() {
  mode = 'floating';

  // Mostra o título e o relógio novamente
  showTitleAndClock();

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

window.onload = function () {
  const popup = document.getElementById('entry-popup');
  const enterButton = document.getElementById('enter-button');

  enterButton.addEventListener('click', () => {
    // Esconde o popup
    popup.style.display = 'none';
  });
};

function checkCollision(imgObj) {
  return floatingImages.some(otherImgObj => {
    if (imgObj === otherImgObj) return false; // Ignora a verificação da própria imagem
    const distance = Math.sqrt(Math.pow(imgObj.x - otherImgObj.x, 2) + Math.pow(imgObj.y - otherImgObj.y, 2));
    return distance < 80; // Ajuste o valor conforme o tamanho da imagem (80px no caso)
  });
}
