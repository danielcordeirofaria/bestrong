import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as 'buyer' | 'seller';
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');

      // 1. Proteger as rotas do dashboard e profile
      if (isOnDashboard || isOnProfile) {
        if (isLoggedIn) return true;
        return false; // Redireciona usuários não autenticados para a página de login
      } 
      // 2. Redirecionar usuários logados para o dashboard se tentarem acessar login/registro
      else if (isLoggedIn && (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register'))) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // 3. Permitir acesso a todas as outras páginas (home, etc.) para todos os usuários
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;