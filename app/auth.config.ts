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
  // Adiciona o matcher aqui para definir quais rotas são protegidas.
  // Todas as outras rotas serão públicas por padrão.
  // Ex: /dashboard, /profile, etc.
  // A expressão regular abaixo faz o middleware rodar em todas as rotas, exceto as de arquivos estáticos.
  // Isso garante que a lógica de redirecionamento funcione corretamente para todas as páginas.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  providers: [], // We will add providers like Credentials here later
} satisfies NextAuthConfig;