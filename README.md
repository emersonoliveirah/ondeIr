# Onde Ir - Descubra lugares com IA ✨

Uma aplicação Next.js moderna que utiliza inteligência artificial para ajudar usuários a encontrar os melhores lugares baseado em suas necessidades e localização.

## 🚀 Funcionalidades

- **Busca Inteligente**: Digite o que você está procurando em linguagem natural e deixe a IA interpretar sua intenção
- **Localização Precisa**: Use sua localização atual ou defina uma localização manual para encontrar lugares próximos
- **Resultados Detalhados**: Visualize informações completas sobre cada lugar, incluindo endereço, avaliações e contatos
- **Interface Moderna**: Design responsivo e intuitivo com Tailwind CSS

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **OpenStreetMap API** - Busca de lugares
- **Hugging Face API** - Interpretação de intenções com IA

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
onde-ir/
├── app/                    # Páginas e rotas da aplicação
│   ├── api/               # Rotas da API
│   ├── results/           # Página de resultados
│   └── page.tsx           # Página inicial
├── components/            # Componentes React reutilizáveis
│   ├── LocationSelector.tsx
│   ├── PlaceCard.tsx
│   └── SearchBar.tsx
├── hooks/                 # Custom hooks
│   └── useLocation.ts
├── lib/                   # Utilitários e lógica de negócio
│   ├── ai.ts             # Interpretação de intenções
│   └── places.ts         # Busca de lugares
└── types/                 # Definições de tipos TypeScript
    └── index.ts
```

## ✨ Melhorias Implementadas

### Código e Arquitetura
- ✅ Removida dependência `node-fetch` (usando fetch nativo do Next.js)
- ✅ Criados tipos TypeScript compartilhados para evitar duplicação
- ✅ Melhor tratamento de erros e validações nas APIs
- ✅ Código mais limpo e organizado

### Interface e UX
- ✅ Página inicial redesenhada com design moderno e informativo
- ✅ Componente `SearchBar` reutilizado na página inicial
- ✅ `PlaceCard` melhorado com mais informações (telefone, site, distância)
- ✅ Substituição de `alert()` por componentes de UI apropriados
- ✅ Melhor feedback visual com estados de loading e erro

### Acessibilidade e SEO
- ✅ Metadata apropriada para SEO
- ✅ Atributos ARIA para melhor acessibilidade
- ✅ Idioma configurado para português brasileiro

### Performance
- ✅ Suporte a debounce na busca (opcional)
- ✅ Transições suaves e animações otimizadas

## 🔧 Próximas Melhorias Sugeridas

- [ ] Adicionar cache para resultados de busca
- [ ] Implementar histórico de buscas
- [ ] Adicionar favoritos
- [ ] Integração com Google Maps para visualização
- [ ] Filtros avançados (preço, horário, etc.)
- [ ] Testes unitários e de integração
- [ ] PWA (Progressive Web App)

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
