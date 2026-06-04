# 🧘 After Hot Yoga

> Um joguinho de luta estilo *Street Fighter* em pixel art, ambientado na **sala de espera de um hot yoga**. Calor, tensão e copos Stanley voando.

Escolha seu lutador, equipe um **copo Stanley como arma** e encare a chefe definitiva: **a carioca**.

🎮 **Jogue agora:** **[after-hot-yoga.vercel.app](https://after-hot-yoga.vercel.app)**

---

## 🥊 Como jogar

| Ação | Tecla |
|------|-------|
| Mover | `←` `→` (ou `A` `D`) |
| Pular | `↑` / `W` / `Espaço` |
| Soco | `J` |
| Arma (copo) | `K` |
| Especial | `I` (quando a barra enche) |
| Defesa | `L` |
| Reiniciar luta | `R` |

O fluxo é: **título → escolher personagem → escolher copo → lutar contra a carioca**.

### 📱 No celular

O jogo é **jogável no toque**: em aparelhos móveis aparecem botões na tela (direcionais à
esquerda, ações à direita). Jogue na **horizontal** — em pé, um aviso pede pra girar o aparelho.

---

## 🧍 Personagens (14)

Clopes · W · Sugar · Dindi · Decaum · GC · Mafe · Maaah · Fefito · Pedro Potro · Aída · Eloy · Ligia · brubru

Cada um é desenhado em **pixel art gerada por código** (nada de imagens externas), com cabelo, pele, óculos, boné, barba e acessórios próprios.

A vilã, **a carioca**, é a NPC que todo mundo enfrenta — de leggings, cabelo preso e mãos livres.

## 🥤 Arsenal de copos Stanley

Cada copo tem uma mecânica de combate diferente:

| Copo | Estilo | Diferencial |
|------|--------|-------------|
| **Copão Litrão** | 🔨 Marreta | Lento, dano altíssimo, arremessa pra longe |
| **Copo de Café** | 💣 Granada | Arco que explode em área — pega quem foge |
| **Quencher 1.2** | ⚡ Rápido | Golpes velozes pra pressão contínua |
| **Garrafa Térmica** | 💦 Jato | Vários toques que atordoam e cortam o ataque |
| **IceFlow Flip** | 🪃 Bumerangue | Voa reto, vai e volta (2 acertos à distância) |
| **Caneca Adventure** | 🏃 Investida | Dash que fecha distância e surpreende |
| **IceFlow Cryo** | ❄️ Congelante | Congela a carioca — janela pra emendar combo |

---

## 🛠️ Tecnologia

- **HTML5 Canvas + JavaScript puro** — sem dependências, sem build
- Pixel art **procedural** (desenhada bloco a bloco em tempo real)
- Áudio sintetizado via **Web Audio API**
- Controles de **teclado e toque** (mobile)
- Roda 100% no navegador, em qualquer dispositivo

O código é dividido em scripts simples carregados em ordem (sem bundler):

```
index.html        markup + estilos + telas
js/config.js      personagens, armas, especiais e constantes
js/art.js         desenho pixel art (personagens, cenário, projéteis)
js/sfx.js         efeitos sonoros (Web Audio)
js/engine.js      motor de luta: física, IA, golpes, projéteis
js/input.js       entrada de teclado
js/ui.js          telas, HUD, loop principal e controles de toque
```

## ▶️ Rodar localmente

É só um arquivo estático:

```bash
# abrir direto
open index.html

# ou servir localmente
npx serve .
```

## 🚀 Deploy

Hospedado na **Vercel** como site estático. Cada push na `main` gera um novo deploy automático.

---

Feito com 🧘 + 🥤 + ☕
