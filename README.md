# Poda Consciente

> **Cuidar das árvores também é cuidar da sua segurança.**

O **Poda Consciente** é uma experiência educativa e interativa sobre os cuidados com árvores próximas à rede elétrica. A aplicação apresenta uma jornada visual, orienta sobre atitudes preventivas e utiliza um quiz para ensinar como agir em situações do dia a dia.

Esta é uma proposta complementar, conectada conceitualmente ao movimento **Você + Seguro**, da Equatorial Energia, desenvolvida para incentivar uma comunidade mais informada e segura.

## Funcionalidades

- **Jornada visual por rolagem:** a árvore cresce e a ambientação muda conforme a pessoa percorre as etapas da história.
- **Orientações de segurança:** apresenta riscos relacionados à vegetação próxima à rede elétrica, como interrupções, choques e quedas de galhos.
- **Quiz educativo:** três situações cotidianas, com alternativas, feedback imediato e opção para refazer o quiz.
- **Compartilhamento com a comunidade:** copia o endereço da aplicação para a área de transferência.
- **Acesso rápido ao canal 116:** reforça que não se deve realizar poda ou afastar galhos próximos à rede elétrica por conta própria.
- **Layout responsivo:** navegação adaptada para computadores e dispositivos móveis.
- **Animações e acessibilidade:** estados do quiz, mensagens de status, textos alternativos nas imagens e navegação por âncoras.

## Tecnologias

O projeto é uma aplicação web estática construída com:

- HTML5;
- CSS3;
- JavaScript, sem frameworks ou bibliotecas externas;
- SVG para a ilustração dinâmica da árvore;
- Google Fonts: [DM Sans](https://fonts.google.com/specimen/DM+Sans) e [Outfit](https://fonts.google.com/specimen/Outfit).

## Como executar

Como não há processo de compilação nem dependências para instalar, basta abrir o arquivo `index.html` em um navegador.

Para uma experiência mais próxima de um ambiente publicado, execute um servidor local na pasta do projeto. Por exemplo, com Python:

```bash
python -m http.server 8000
```

Depois, acesse <http://localhost:8000>.

Também é possível publicar os arquivos diretamente em serviços de hospedagem de sites estáticos, como GitHub Pages, Netlify ou Vercel.

## Estrutura do projeto

```text
.
├── index.html                 # Estrutura e conteúdo da página
├── script.js                  # Jornada visual, quiz e interações
├── style.css                  # Estilos, responsividade e animações
├── assets/
│   ├── bairro.jpg
│   ├── cenario1.png
│   ├── cenario2.png
│   ├── cenario3.png
│   ├── equatorial-logo.png
│   ├── iconarvore.png
│   ├── logo_eqt.png
│   └── neighborhood.jpg
└── LICENSE                    # Licença MIT
```

## Conteúdo da experiência

A jornada é dividida em quatro momentos:

1. **A vida floresce:** a importância das árvores e do planejamento do seu crescimento.
2. **O cuidado cresce junto:** os riscos da vegetação quando se aproxima da rede elétrica.
3. **Reconheça os sinais:** identificação de galhos próximos ou encostando nos fios.
4. **A prevenção ilumina:** orientação para manter distância e buscar ajuda adequada.

No quiz, a pessoa aprende que deve:

- entrar em contato com a Equatorial pelo **116** quando houver vegetação próxima à rede elétrica;
- procurar o órgão municipal responsável quando a árvore estiver em uma área pública;
- contratar um profissional qualificado para realizar poda em terreno particular;
- nunca tocar nos fios, afastar galhos ou tentar fazer a poda por conta própria.

## Desenvolvimento

O quiz é configurado no início de `script.js`, no array `missions`. Para adicionar ou alterar uma situação, atualize:

- `title`: título da situação;
- `scenario`: caminho da imagem utilizada;
- `situation`: pergunta apresentada;
- `options`: alternativas;
- `correct`: índice da alternativa correta;
- `feedback`: explicação exibida após a resposta.

As imagens e demais recursos visuais devem ser mantidos na pasta `assets/`, com os caminhos correspondentes referenciados no HTML ou no JavaScript.

## Observação de segurança

O conteúdo tem finalidade educativa e não substitui a avaliação de profissionais ou os procedimentos oficiais da concessionária e dos órgãos públicos. Em caso de vegetação próxima à rede elétrica, mantenha distância, não intervenha e procure orientação pelo canal adequado.

## Licença

Este projeto está disponível sob a [Licença MIT](./LICENSE).
