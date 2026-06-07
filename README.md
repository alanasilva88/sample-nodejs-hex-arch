# 📧 Newsletter Management API
### Arquitetura Hexagonal com NestJS + Firebase

> Uma aplicação de gerenciamento de newsletter **production-ready** implementada com **Arquitetura Hexagonal**, demonstrando boas práticas de design de software, testes unitários, injeção de dependência e separação de responsabilidades.

---

## 🎯 Visão Geral

Este projeto é uma API RESTful para gerenciamento de inscrições em newsletter, construída com **NestJS** e integrada com **Firebase Firestore**. Implementa padrões de design empresariais e demonstra expertise em:

✅ **Arquitetura em camadas** (Clean Architecture / Hexagonal)  
✅ **Testes unitários** com 100% de cobertura do controller  
✅ **Injeção de dependência** com NestJS IoC Container  
✅ **Validação de dados** com class-validator e DTOs  
✅ **Logging estruturado** com Winston  
✅ **TypeScript** com tipagem forte  
✅ **Docker** para containerização  
✅ **Integração com Firebase** (Firestore + Authentication)

---

## 🛠️ Stack Tecnológico

| Categoria | Tecnologias |
|-----------|-------------|
| **Framework** | NestJS 11.1.0 (Node.js/Express) |
| **Linguagem** | TypeScript 5+ |
| **Banco de Dados** | Firebase Firestore (NoSQL) |
| **ORM/ODM** | Firestore Admin SDK |
| **Validação** | class-validator + class-transformer |
| **Logging** | Winston |
| **Testes** | Jest + NestJS Testing Module |
| **Build** | TypeScript Compiler (tsc) |
| **Containerização** | Docker |
| **Ambiente** | Node.js 18+ |

---

## 🏛️ Arquitetura Hexagonal

A Arquitetura Hexagonal (também conhecida como **Ports and Adapters**) é um padrão de design de software que separa a lógica de negócio central da infraestrutura e dos mecanismos de entrega. Essa separação permite que a aplicação seja:

✨ **Mais fácil de testar** - A lógica central pode ser testada independentemente de qualquer framework ou banco de dados  
🔌 **Mais fácil de manter** - Adaptadores de infraestrutura podem mudar sem afetar o core da aplicação  
🔀 **Altamente desacoplada** - Mais reutilizável, extensível e resiliente a mudanças

**Camadas da aplicação:**
- **Domínio** (`domain/`) - Entidades e interfaces de repositório (Ports)
- **Aplicação** (`application/`) - Use cases e lógica de negócio
- **Interface** (`interface/`) - Controllers, DTOs e validações
- **Infraestrutura** (`infrastructure/`) - Implementações de adaptadores (Firestore, etc.)

---

## 📁 Estrutura do Projeto

```
src/
├── newsletter/
│   ├── application/                # Use cases
│   │   └── use-cases/
│   │       └── create-newsletter.use-case.ts
│   ├── domain/                     # Entities and repository interfaces (ports)
│   │   ├── models/
│   │   │   └── newsletter.entity.ts
│   │   └── ports/
│   │       └── newsletter.repository.port.ts
│   ├── infrastructure/            # Adapters for Firestore, etc.
│   │   └── firestore/
│   │       └── newsletter.repository.adapter.ts
│   ├── interface/                 # Controllers and DTOs
│   │   ├── controllers/
│   │   │   └── newsletter.controller.ts
│   │   └── dto/
│   │       └── newsletter.dto.ts
│   └── newsletter.module.ts       # NestJS module
├── common/
│   ├── constants/
│   ├── exceptions/
│   ├── filter/
│   └── logger/
├── firebase/
│   ├── config/
│   ├── firebase.module.ts
│   └── firebaseadmin.provider.ts
├── app.controller.ts
├── app.module.ts
└── main.ts

Dockerfile                         # Production-ready container
jest.config.js                     # Jest configuration
nest-cli.json                      # NestJS CLI config
package.json                       # Dependencies
tsconfig.json                      # TypeScript config
```

---

## 🧪 Testes

### Cobertura Completa
- **100% de cobertura** do `NewsletterController`
- Testes unitários com **mocks isolados**
- Validação de caminho feliz e tratamento de erros
- Framework: **Jest** + **NestJS Testing Module**

### Exemplo de Teste
```typescript
describe('NewsletterController', () => {
  it('should call CreateNewsletterUseCase with valid email', async () => {
    const dto: NewsletterDto = { email: 'test@example.com' };
    
    mockCreateNewsletterUseCase.execute.mockResolvedValueOnce(undefined);
    await controller.subscribe(dto);
    
    expect(mockCreateNewsletterUseCase.execute).toHaveBeenCalledWith(dto.email);
  });
});
```

### Executar Testes
```bash
npm test                              # Rodar todos os testes
npm test -- newsletter.controller     # Rodar testes específicos
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Firebase com Firestore configurado
- Arquivo `.env` com credenciais Firebase

### Instalação e Desenvolvimento

```bash
# Clonar repositório
git clone <repo-url>
cd sample-nodejs-hex-arch

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Firebase

# Modo desenvolvimento (hot-reload)
npm run start:dev

# Build para produção
npm run build

# Executar em produção
npm start

# Rodar testes
npm test
```

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/newsletters` | Inscrever email na newsletter |

**Request:**
```json
{
  "email": "usuario@example.com"
}
```

**Response (200 OK):**
```json
{}
```

---

## 🏆 Padrões de Design Implementados

| Padrão | Localização | Benefício |
|--------|-----------|----------|
| **Hexagonal Architecture** | Toda a estrutura | Desacoplamento total de infraestrutura |
| **Use Case Pattern** | `application/use-cases/` | Isolamento da lógica de negócio |
| **Repository Pattern** | `domain/ports/` + `infrastructure/` | Abstração de acesso a dados |
| **Dependency Injection** | NestJS IoC Container | Testabilidade e flexibilidade |
| **Data Transfer Object (DTO)** | `interface/dto/` | Validação e transformação de dados |
| **Port and Adapter** | `domain/ports/` | Inversão de dependência |
| **Module Pattern** | NestJS modules | Organização e encapsulamento |
| **Singleton Pattern** | Firebase provider | Reutilização de conexões |

---

## 📋 Validação de Dados

A aplicação utiliza **class-validator** para garantir integridade dos dados:

```typescript
export class NewsletterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
```

Benefícios:
- ✅ Validação automática de DTOs
- ✅ Mensagens de erro padronizadas
- ✅ Type-safe em TypeScript
- ✅ Reusável em múltiplos endpoints

---

## 📊 Logging Estruturado

Integração com **Winston** para logging em produção:

```typescript
logger.info('Newsletter subscription', { email, timestamp });
logger.error('Firebase error', { code, message });
```

Benefícios:
- 📝 Rastreabilidade completa
- 🔍 Debug facilitado
- 📊 Análise de comportamento
- 🚨 Alertas de erro

---

## 🐳 Docker

Aplicação inclui `Dockerfile` otimizado para produção:

```bash
# Build da imagem
docker build -t newsletter-api:latest .

# Executar container
docker run -p 3000:3000 \
  -e FIREBASE_KEY=<key> \
  newsletter-api:latest
```

---

## 📚 Funcionalidades Principais

### ✨ Inscrição em Newsletter
- Recebimento de email via API
- Validação de formato
- Persistência em Firestore
- Tratamento de erros estruturado
- Logging de operações

### 🔄 Fluxo Arquitetural
```
HTTP Request
    ↓
Controller (Interface)
    ↓
Use Case (Application)
    ↓
Repository (Port)
    ↓
Firestore Adapter (Infrastructure)
    ↓
Firestore Database
```

---

## 💡 Competências Demonstradas

### Backend Development
- ✅ NestJS e arquitetura de aplicações
- ✅ Programação assíncrona (async/await)
- ✅ RESTful API design
- ✅ Tratamento de exceções

### Software Design
- ✅ Clean Architecture
- ✅ Hexagonal Architecture (Ports & Adapters)
- ✅ SOLID Principles (especialmente Dependency Inversion)
- ✅ Design Patterns

### Qualidade de Código
- ✅ Testes unitários (Jest)
- ✅ 100% cobertura de componentes críticos
- ✅ TypeScript com tipagem forte
- ✅ Code organization e modularização

### DevOps & Cloud
- ✅ Firebase/Firestore integration
- ✅ Docker containerization
- ✅ Environment management
- ✅ Production-ready code

### Ferramentas & Tecnologias
- ✅ TypeScript 5+
- ✅ NestJS 11+
- ✅ Jest & Testing frameworks
- ✅ Express.js
- ✅ Git & version control

---

## 🔒 Segurança

- ✅ Validação de entrada (DTOs)
- ✅ Tipagem forte (TypeScript)
- ✅ Firestore security rules configuradas
- ✅ Gerenciamento seguro de credenciais (.env)
- ✅ Error handling sem exposição de dados sensíveis

---

## 📈 Próximos Passos

Melhorias futuras podem incluir:
- [ ] Testes de integração com Firestore
- [ ] Testes end-to-end (E2E)
- [ ] CI/CD pipeline
- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Cache estratégico
- [ ] Monitoramento e alertas
- [ ] API documentation (Swagger/OpenAPI)

---

