// Conteúdo do quiz/missões. O índice em `correct` indica a alternativa segura.
const missions = [
  // Cada missão informa o título, a imagem, as alternativas e a resposta segura.
  {
    title: "Galhos próximos à rede elétrica",
    scenario: "assets/cenario1.png",
    situation:
      "Você percebe que os galhos de uma árvore estão muito próximos dos fios elétricos. O que deve fazer?",
    options: [
      "Subir na árvore para cortar os galhos menores.",
      "Utilizar um objeto para afastar os galhos dos fios.",
      "Não intervir por conta própria e entrar em contato com a Equatorial pelo canal 116 para orientação.",
    ],
    correct: 2,
    feedback:
      "Nunca tente podar ou afastar galhos próximos à rede elétrica. Procure a Equatorial pelo 116 e siga as orientações de segurança.",
  },
  {
    title: "Árvore em área pública",
    scenario: "assets/cenario3.png",
    situation:
      "Uma árvore em uma praça precisa de manutenção, mas não há contato aparente com a rede elétrica. Como proceder?",
    options: [
      "Fazer a poda por conta própria.",
      "Procurar o órgão municipal responsável pela arborização urbana.",
      "Cortar os galhos sem verificar as condições da árvore.",
    ],
    correct: 1,
    feedback:
      "A manutenção da arborização em espaços públicos deve ser encaminhada ao órgão municipal responsável. Se houver proximidade com a rede elétrica, solicite também a orientação da Equatorial.",
  },
  {
    title: "Galhos em terreno particular",
    scenario: "assets/cenario2.png",
    situation:
      "Uma árvore dentro de um terreno particular precisa de poda. Qual é a atitude mais adequada?",
    options: [
      "Contratar um profissional qualificado para avaliar e realizar o serviço com segurança.",
      "Subir na árvore e fazer o corte sem equipamentos.",
      "Utilizar uma ferramenta longa para cortar os galhos próximos aos fios.",
    ],
    correct: 0,
    feedback:
      "A manutenção deve ser realizada por profissional qualificado. Se os galhos estiverem próximos da rede elétrica, não tente intervir e procure a Equatorial pelo 116.",
  },
];

// Pontos determinísticos usados para formar a copa da árvore em SVG.
const foliage = Array.from({ length: 100 }, (_, i) => {
  // Ângulo e raio distribuídos matematicamente evitam uma copa uniforme demais.
  const angle = i * 2.399963;
  const radius = Math.sqrt(i / 100);
  return {
    x: 253 + Math.cos(angle) * radius * 193,
    y: 215 + Math.sin(angle) * radius * 172,
    r: 25 + ((i * 13) % 19),
    tone: i % 5,
  };
});

// Gera a ilustração da árvore para a cena principal e para o quiz.
function tree() {
  // As classes do SVG são estilizadas no CSS e recebem escala durante o scroll.
  return `<svg class="living-tree" viewBox="0 0 520 650" role="img" aria-label="Árvore saudável no bairro"><ellipse class="tree-shadow" cx="260" cy="624" rx="117" ry="17"/><g class="tree-growth"><path class="trunk" d="M224 625 C250 545 223 487 247 404 C255 338 241 267 254 181 L269 176 C262 259 281 325 270 390 C262 476 283 555 297 625Z"/><path class="bark" d="M250 602 Q264 529 255 467 M263 420 Q255 340 264 269 M238 572 L249 526 M281 610 L270 548"/><g class="branches"><path d="M255 439 Q193 379 151 246 M257 394 Q321 322 355 191 M258 327 Q208 268 193 143 M269 336 Q304 238 298 119 M229 390 Q165 352 98 334 M294 306 Q354 282 411 234 M213 308 Q167 302 130 271 M313 277 Q341 213 383 178"/></g><g class="tree-crown">${foliage.map((leaf) => `<circle class="leaf-tone-${leaf.tone}" cx="${leaf.x}" cy="${leaf.y}" r="${leaf.r}"/>`).join("")}</g><path class="branch-front" d="M261 421 Q225 337 216 285 M264 384 Q305 327 332 291 M255 340 L270 258"/></g><g class="grass"><path d="M201 623 l-12 -25 23 18 -3 -33 18 34 11 -27 8 35 M284 624 l12 -28 2 25 19 -16 -6 20"/></g></svg>`;
}

// A cena fixa combina a foto do bairro, a árvore, a rede elétrica e os vaga-lumes.
document.querySelector("#scene").innerHTML =
  `<div class="story-scene" aria-hidden="true"><img class="neighborhood" src="assets/neighborhood.jpg" alt=""><div class="scene-night"></div><div class="sun"></div><div class="scene-tree">${tree()}</div><div class="tree-safety-signs"><strong class="tree-note-116">116</strong><span class="tree-note-distance">Mantenha distância</span><span class="tree-note-touch">Não toque nos fios</span></div><svg class="power-lines" viewBox="-120 0 840 700"><g class="wire"><path d="M-100 208 Q300 330 700 209 M-100 230 Q300 352 700 232 M-100 254 Q300 372 700 256"/></g><g class="pole"><path d="M-40 680 L-40 213 M-95 227 L15 227 M-90 246 L10 246"/><path class="pole-light" d="M-35 680 L-35 214"/></g><g class="pole"><path d="M640 680 L640 213 M585 227 L695 227 M595 246 L689 246"/><path class="pole-light" d="M645 680 L645 214"/></g><g class="insulator"><path d="M-83 225v-19 M-42 225v-19 M2 225v-19 M597 225v-19 M638 225v-19 M685 225v-19"/></g></svg><div class="fireflies">${Array.from({ length: 18 }, (_, i) => `<i class="firefly firefly-${i}"></i>`).join("")}</div>`;

// O quiz é uma pequena máquina de estados: introdução, pergunta, feedback e conclusão.
const quiz = document.querySelector("#quiz");
let quizState = { started: false, step: 0, answer: null, complete: false };

// Redesenha apenas o bloco do quiz sempre que o estado muda.
function renderQuiz() {
  // Primeiro estado: mostra a mensagem de apresentação e o botão de início.
  if (quizState.complete) {
    quiz.innerHTML = `
      <div class="quiz-complete">
        <span class="completion-icon">✓</span>
        <span class="eyebrow">QUIZ CONCLUÍDO</span>
        <h3>Conhecimento que protege.</h3>
        <p>Você concluiu o quiz. Leve estas atitudes para o seu dia a dia:</p>
        <ul>
          <li>✓ Rede elétrica por perto? Não intervenha. Ligue 116.</li>
          <li>✓ Árvore em espaço público? Procure o órgão municipal.</li>
          <li>✓ No terreno particular? Conte com um profissional qualificado.</li>
        </ul>
        <div class="quiz-actions">
          <button class="button outline" data-restart>Refazer o quiz</button>
        </div>
      </div>
    `;
    quiz.querySelector("[data-restart]").onclick = restartQuiz;
    return;
  }
  if (!quizState.started) {
    quiz.innerHTML = `
      <div class="mission-intro">
        <div class="mission-art">
          <img
            class="mission-scenario"
            src="assets/cenario3.png"
            alt="Praça arborizada do bairro"
          />
        </div>
        <div class="mission-intro-copy">
          <span class="eyebrow">DO CONHECIMENTO À ATITUDE</span>
          <h3>Um bairro mais seguro.</h3>
          <p>
            Em situações do dia a dia, saber como agir faz toda a diferença.
            Descubra as atitudes mais seguras.
          </p>
          <div class="mission-tags">
            <span>3 situações reais do cotidiano</span>
            <span>No seu ritmo</span>
          </div>
          <button class="button" data-start>Começar quiz →</button>
        </div>
      </div>
    `;
    quiz.querySelector("[data-start]").onclick = () => {
      quizState.started = true;
      renderQuiz();
    };
    return;
  }

  // Estado ativo: mostra a missão atual, as alternativas e o feedback, quando houver.
  const mission = missions[quizState.step];
  const answered = quizState.answer !== null;
  const correct = quizState.answer === mission.correct;
  const optionsMarkup = mission.options
    .map(
      (option, i) => `
        <button
          class="quiz-option ${
            answered && i === mission.correct ? "is-correct" : ""
          } ${
            answered && i === quizState.answer && !correct ? "is-incorrect" : ""
          }"
          data-answer="${i}"
          ${answered ? "disabled" : ""}
        >
          <span class="option-letter">
            ${
              answered && i === mission.correct
                ? "✓"
                : answered && i === quizState.answer
                  ? "×"
                  : String.fromCharCode(65 + i)
            }
          </span>
          <span>${option}</span>
        </button>
      `,
    )
    .join("");
  const feedbackMarkup = answered
    ? `
        <div
          class="quiz-feedback ${correct ? "feedback-correct" : ""}"
          role="status"
        >
          <strong>
            ${
              correct
                ? "Isso mesmo! Uma atitude segura."
                : "Vamos aprender juntos? A atitude segura é outra."
            }
          </strong>
          <p>${mission.feedback}</p>
        </div>
      `
    : "";
  quiz.innerHTML = `
    <div class="quiz-active">
      <div class="quiz-visual">
        <img
          class="mission-scenario"
          src="${mission.scenario}"
          alt="Cenário do quiz ${quizState.step + 1}"
        />
      </div>
      <div class="quiz-body">
        <div class="quiz-progress">
          <span>Quiz ${quizState.step + 1} de 3</span>
          <div>
            ${missions
              .map(
                (_, i) =>
                  `<i class="${i <= quizState.step ? "is-active" : ""}"></i>`,
              )
              .join("")}
          </div>
        </div>
        <h3>${mission.title}</h3>
        <p class="quiz-question">${mission.situation}</p>
        <div class="quiz-options">${optionsMarkup}</div>
        ${feedbackMarkup}
        <div class="quiz-bottom">
          <span>
            ${
              answered
                ? "Cada atitude segura faz a diferença."
                : "Escolha uma atitude para continuar."
            }
          </span>
          <button class="button" data-next ${answered ? "" : "disabled"}>
            ${quizState.step === 2 ? "Concluir quiz" : "Próxima pergunta"} →
          </button>
        </div>
      </div>
    </div>
  `;
  quiz.querySelectorAll("[data-answer]").forEach(
    (button) =>
      (button.onclick = () => {
        // O índice da alternativa clicada é guardado para comparar com `correct`.
        quizState.answer = Number(button.dataset.answer);
        renderQuiz();
      }),
  );
  quiz.querySelector("[data-next]").onclick = () => {
    // Na última missão, o próximo clique troca o quiz para a tela de conclusão.
    if (quizState.step === 2) quizState.complete = true;
    else {
      // Nas duas primeiras, avança e limpa a resposta anterior.
      quizState.step += 1;
      quizState.answer = null;
    }
    renderQuiz();
  };
}

// Reinicia o quiz e leva o usuário de volta para a seção de missões.
function restartQuiz() {
  quizState = { started: true, step: 0, answer: null, complete: false };
  renderQuiz();
  document.querySelector("#missoes").scrollIntoView({ behavior: "smooth" });
}
renderQuiz();
// Mantém a seção do quiz acima da cena fixa para o fundo não escurecer seu conteúdo.
document.querySelector(".missions-section").style.cssText =
  "position:relative;z-index:8";
document.querySelector("#restart").onclick = restartQuiz;

// Abre e fecha a navegação em telas pequenas.
document.querySelector(".mobile-menu").onclick = (event) => {
  const button = event.currentTarget;
  const nav = document.querySelector(".site-header nav");
  const open = nav.classList.toggle("nav-open");
  button.setAttribute("aria-expanded", open);
  button.textContent = open ? "×" : "☰";
};
document
  .querySelectorAll(".site-header nav a")
  .forEach(
    (link) =>
      (link.onclick = () =>
        document
          .querySelector(".site-header nav")
          .classList.remove("nav-open")),
  );

// Copia somente a URL atual, permitindo que ela seja colada em qualquer canal.
document.querySelector("#share").onclick = async (event) => {
  const button = event.currentTarget;
  // location.pathname mantém o link da aplicação sem o hash de uma seção específica.
  const link = `${location.origin}${location.pathname}`;
  try {
    await navigator.clipboard.writeText(link);
    button.textContent = "Link copiado!";
    document.querySelector(".share-status").textContent =
      "Link copiado. Cole onde quiser para compartilhar a aplicação.";
  } catch {
    document.querySelector(".share-status").textContent =
      "Não foi possível copiar automaticamente. Copie o endereço da página no navegador.";
  }
};

// Atualiza crescimento, iluminação e marcador conforme a pessoa rola a história.
const story = document.querySelector(".story");
const risksSection = document.querySelector(".risks-section");
const dangerSection = document.querySelector(".danger-section");
const preventionSection = document.querySelector(".prevention-section");
let frame = 0;
function updateStory() {
  const rect = story.getBoundingClientRect();
  // Converte a posição do scroll em um número entre 0 e 1.
  const progress = Math.min(
    1,
    Math.max(0, -rect.top / (rect.height - innerHeight)),
  );

  // Esses tokens CSS controlam a escala da árvore e a transição do dia para a noite.
  story.style.setProperty("--growth", String(0.48 + progress * 0.52));
  story.style.setProperty("--crown", String(0.55 + progress * 0.45));
  story.style.setProperty(
    "--night",
    String(Math.min(1, Math.max(0, (progress - 0.4) / 0.4))),
  );
  story.style.setProperty("--sunset", String(Math.sin(progress * Math.PI)));
  // Divide a história em cinco etapas para atualizar os pontos laterais.
  const stage = Math.min(4, Math.floor(progress * 5));
  document
    .querySelectorAll(".track-dot")
    .forEach((dot, i) => dot.classList.toggle("active", i === stage));
  document.querySelector(".track-number").textContent = `0${stage + 1}`;
  const revealPoint = innerHeight * 0.7;
  story.classList.toggle(
    "show-tree-notes",
    risksSection.getBoundingClientRect().top <= revealPoint,
  );
  story.classList.toggle(
    "show-tree-note-distance",
    dangerSection.getBoundingClientRect().top <= revealPoint,
  );
  story.classList.toggle(
    "show-tree-note-touch",
    preventionSection.getBoundingClientRect().top <= revealPoint,
  );
}
function onScroll() {
  // requestAnimationFrame evita recalcular o layout dezenas de vezes por segundo.
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(updateStory);
}
updateStory();
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("revealed");
    }),
  { threshold: 0.12 },
);

// Ativa a animação de entrada somente quando cada bloco aparece na tela.
document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));
