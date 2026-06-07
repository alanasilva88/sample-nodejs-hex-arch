## 🧱 O que é Arquitetura Hexagonal?

A Arquitetura Hexagonal (também conhecida como Ports and Adapters) é um padrão de design de software que separa a lógica de negócio central da infraestrutura e dos mecanismos de entrega. Essa separação permite que a aplicação seja:

- Mais fácil de testar (a lógica central pode ser testada independentemente)
- Mais fácil de manter (adaptadores de infraestrutura podem mudar sem afetar o core)
- Altamente desacoplada (mais reutilizável e extensível)

Mesta estrutura:
- **Domínio** e **Aplicação**  contêm as regras de negócio.
- **Interface** e **Infraestrutura**  atuam como adaptadores.

---

## 📁 Estrutura Hexagonal

```
src/
├── newsletter/
│   ├── application/                # Use cases
│   │   └── use-cases/
│   ├── domain/                     # Entities and repository interfaces (ports)
│   │   ├── models/
│   │   └── ports/
│   ├── infrastructure/            # Adapters for Firestore, etc.
│   │   └── firestore/
│   ├── interface/                 # Controllers and DTOs
│   │   ├── controllers/
│   │   └── dto/
│   └── newsletter.module.ts       # NestJS module
├── common/
├── firebase/
├── main.ts
```
