# 🚀 Guia de Deploy - Apex Fit

Este guia contém as instruções exatas para colocar seu projeto no ar.

## 1. Banco de Dados (Neon)
Você já está configurando isso. Lembre-se de pegar a **Connection String** e as credenciais.

---

## 2. Frontend (Vercel)
Ideal para hospedar o React.

1.  **Import Project:** Selecione seu repositório `Apex-Fit`.
2.  **Root Directory:** Clique em "Edit" e selecione a pasta `frontend`. **Isso é crucial!**
3.  **Build Settings:** (A Vercel geralmente detecta Vite automaticamente, mas confira):
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
    *   **Install Command:** `npm install`
4.  **Environment Variables:**
    *   Por agora, não precisa de nenhuma.
    *   *Futuro:* Quando o Backend estiver online, adicionaremos `VITE_API_URL`.

---

## 3. Backend (Render / Railway)
O Vercel não roda Java nativamente. O **Render** é a melhor opção gratuita/barata.

1.  Crie uma conta no [render.com](https://render.com).
2.  Clique em **New +** -> **Web Service**.
3.  Conecte seu GitHub e selecione `Apex-Fit`.
4.  **Configurações:**
    *   **Runtime:** Docker
    *   **Root Directory:** `backend` (Importante!)
    *   **Name:** `apex-fit-backend` (ou o que preferir)
    *   **Region:** Escolha a mais perto de você (ex: Ohio ou Frankfurt).
5.  **Environment Variables (Add Environment Variable):**
    *   Aqui você conecta o Neon!
    *   `DB_URL`: `jdbc:postgresql://<SEU_HOST_NEON>/<SEU_DB_NAME>?sslmode=require`
    *   `DB_USERNAME`: Seu usuário do Neon.
    *   `DB_PASSWORD`: Sua senha do Neon.
6.  **Deploy:** Clique em Create Web Service.

---

## 🧹 Boas Práticas Git (Cleanup)
Após o Merge do Pull Request:
1.  **Delete a branch no GitHub** (geralmente tem um botão "Delete branch" após o merge).
2.  **Delete localmente:**
    ```bash
    git checkout main
    git pull
    git branch -d feat/landing-page
    ```
Isso mantém seu repositório limpo e profissional.
