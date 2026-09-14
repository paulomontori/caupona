# Caupona

Site pessoal (uso restrito a um grupo de amigos) pra listar restaurantes que queremos ir ou já fomos: mapa, endereço, estilo de comida, motivo de ter entrado na lista, e a impressão/nota de cada um.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Auth.js (NextAuth v5) com login Google, restrito por allowlist
- Supabase (Postgres)
- Google Maps + Places Autocomplete

## Setup

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL editor, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
3. Adicione os e-mails que podem logar:
   ```sql
   insert into allowed_users (email) values ('seu-email@gmail.com');
   ```
4. Em Project Settings > API, copie a `Project URL` e a `service_role` key.

### 2. Google Cloud

1. Crie um projeto em [Google Cloud Console](https://console.cloud.google.com).
2. Em **APIs & Services > Credentials**, crie um **OAuth 2.0 Client ID** (tipo Web application).
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (e depois a URL de produção).
3. Ative **Maps JavaScript API** e **Places API**, e crie uma API key restrita por referrer (seu domínio + `localhost`).

### 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os valores acima. Gere o `AUTH_SECRET` com:

```bash
npx auth secret
```

### 4. Rodar local

```bash
npm install
npm run dev
```

### 5. Deploy

Conecte o repo na [Vercel](https://vercel.com/new) e configure as mesmas variáveis de ambiente do `.env.local` (ajustando `AUTH_URL` pra URL de produção e o redirect URI no Google Cloud).
