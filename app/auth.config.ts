import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');

      // Proteger rotas que exigem autenticação
      if (isOnDashboard || isOnProfile) {
        if (isLoggedIn) return true; // Permite acesso se estiver logado
        return false; // Redireciona para a página de login se não estiver logado
      } else if (isLoggedIn) {
        // Se o usuário já estiver logado e tentar acessar páginas como /login, redireciona para o dashboard
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true; // Permite acesso a todas as outras páginas (ex: /, /login, /register)
    },
  },
  providers: [], // We will add providers like Credentials here later
} satisfies NextAuthConfig;