<p align="center">
  <img src="https://raw.githubusercontent.com/rafa-coelho/rmq-simulator/main/public/og-image.png" alt="Simulador RabbitMQ" width="600">
</p>

<h1 align="center">Simulador RabbitMQ</h1>

<p align="center">
  <strong>Um simulador visual interativo para aprender conceitos do RabbitMQ</strong>
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#demonstração">Demonstração</a> •
  <a href="#começando">Começando</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#contribuindo">Contribuindo</a> •
  <a href="#licença">Licença</a>
</p>

<p align="center">
  <a href="./README.md">🇺🇸 Read in English</a>
</p>

---

## Sobre

O Simulador RabbitMQ é uma ferramenta educacional gratuita e open-source que ajuda desenvolvedores a entender conceitos de filas de mensagens através de uma interface visual interativa. Construa fluxos de mensagens arrastando e soltando componentes, conecte-os com bindings e veja as mensagens fluindo pelo sistema em tempo real.

Seja você iniciante em message brokers ou queira prototipar uma arquitetura RabbitMQ, este simulador oferece uma experiência de aprendizado prática sem a necessidade de configurar um servidor RabbitMQ real.

## Funcionalidades

### Canvas Interativo
- **Interface Drag & Drop**: Crie producers, exchanges, queues e consumers com controles intuitivos de arrastar e soltar
- **Conexões Visuais**: Desenhe bindings entre componentes com routing keys e padrões
- **Animação em Tempo Real**: Veja as mensagens fluindo pela sua arquitetura com animações suaves
- **Pan & Zoom**: Navegue por arquiteturas grandes com controles do mouse/trackpad

### Simulação Completa do RabbitMQ
- **Todos os Tipos de Exchange**: Direct, Fanout, Topic e Headers com comportamento de roteamento preciso
- **Propriedades de Mensagem**: Configure routing keys, headers, persistência e TTL
- **Configurações de Consumer**: Ajuste prefetch count e modos de acknowledgment
- **Recursos de Queue**: Queues duráveis, auto-delete e contadores de mensagens

### Recursos de Aprendizado
- **Documentação Completa**: Guias detalhados cobrindo todos os conceitos do RabbitMQ
- **Exemplos Incluídos**: Cenários pré-configurados demonstrando padrões comuns:
  - Fila Simples
  - Work Queues (consumers competidores)
  - Publish/Subscribe (fanout)
  - Routing (exchange direct)
  - Topics (correspondência de padrões)
- **Glossário**: Referência rápida para terminologia de mensageria

### Suporte Multi-idioma
- English (Inglês)
- Português (Português Brasileiro)
- Español (Espanhol)

### Experiência do Desenvolvedor
- **Atalhos de Teclado**: Acelere seu fluxo de trabalho com hotkeys
- **Exportar/Importar**: Salve e compartilhe seus diagramas como JSON
- **Design Responsivo**: Funciona em navegadores desktop (mobile mostra a documentação)
- **Tema Escuro**: Confortável para os olhos em sessões de estudo prolongadas

## Demonstração

**Demo ao Vivo**: [https://rmq.racoelho.com.br](https://rmq.racoelho.com.br)

## Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/rafa-coelho/rmq-simulator.git
cd rmq-simulator
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

### Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão no diretório `dist`, prontos para deploy.

## Tecnologias

- **Framework**: [React 19](https://react.dev/) com TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Gerenciamento de Estado**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Roteamento**: [React Router](https://reactrouter.com/)
- **Internacionalização**: [i18next](https://www.i18next.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

## Estrutura do Projeto

```
src/
├── components/
│   ├── canvas/          # Canvas e renderização de nós
│   ├── content/         # Conteúdo da seção de aprendizado
│   ├── nodes/           # Componentes Producer, Exchange, Queue, Consumer
│   ├── panels/          # Toolbar, Properties, Message panels
│   └── ui/              # Componentes UI reutilizáveis
├── hooks/               # Custom React hooks
├── i18n/                # Arquivos de internacionalização
│   └── locales/         # Arquivos JSON de tradução (en, pt, es)
├── pages/               # Páginas de rotas
├── services/            # Analytics e utilitários
├── store/               # Gerenciamento de estado Zustand
└── types/               # Definições de tipos TypeScript
```

## Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `P` | Adicionar Producer |
| `E` | Adicionar Exchange |
| `Q` | Adicionar Queue |
| `C` | Adicionar Consumer |
| `Delete` / `Backspace` | Excluir selecionado |
| `Ctrl/Cmd + D` | Duplicar selecionado |
| `Ctrl/Cmd + A` | Selecionar tudo |
| `Ctrl/Cmd + Z` | Desfazer |
| `Ctrl/Cmd + Shift + Z` | Refazer |
| `Escape` | Limpar seleção |
| `Scroll` | Zoom in/out |
| `Botão do Meio` | Mover canvas |

## Contribuindo

Contribuições são bem-vindas! Veja como você pode ajudar:

1. **Fork** o repositório
2. **Crie** uma branch de feature (`git checkout -b feature/funcionalidade-incrivel`)
3. **Commit** suas alterações (`git commit -m 'Adiciona funcionalidade incrível'`)
4. **Push** para a branch (`git push origin feature/funcionalidade-incrivel`)
5. **Abra** um Pull Request

### Diretrizes de Desenvolvimento

- Siga o estilo de código existente
- Escreva mensagens de commit significativas
- Adicione testes para novas funcionalidades quando aplicável
- Atualize a documentação conforme necessário

### Contribuições de Tradução

Quer adicionar um novo idioma?

1. Copie `src/i18n/locales/en.json` para um novo arquivo (ex: `fr.json`)
2. Traduza todas as strings
3. Adicione o idioma ao seletor em `src/components/ui/Header.tsx`
4. Envie um PR!

## Roadmap

- [ ] Visualização de Dead Letter Exchange (DLX)
- [ ] Simulação de Message TTL
- [ ] Visualização de Cluster
- [ ] Mais exemplos de tipos de exchange
- [ ] URLs de diagrama compartilháveis
- [ ] Suporte PWA offline

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

<p align="center">
  <strong>Rafael Coelho</strong>
</p>

<p align="center">
  <a href="https://github.com/rafa-coelho">GitHub</a> •
  <a href="https://racoelho.com.br">Website</a> •
  <a href="https://linkedin.com/in/rafa-coelho">LinkedIn</a>
</p>

## Agradecimentos

- A equipe do [RabbitMQ](https://www.rabbitmq.com/) pela excelente documentação
- A comunidade open-source pelas incríveis ferramentas que tornaram este projeto possível

---

<p align="center">
  Feito com ❤️ por <a href="https://racoelho.com.br">Rafael Coelho</a>
</p>

<p align="center">
  <a href="https://github.com/rafa-coelho/rmq-simulator/stargazers">⭐ Dê uma estrela se você achou útil!</a>
</p>
