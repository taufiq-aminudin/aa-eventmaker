import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | '/'
  | '/templates'
  | '/features'
  | '/guest-pass'
  | '/pricing'
  | '/payment'
  | '/about'
  | '/contact'
  | '/help'
  | '/privacy'
  | '/terms'
  | '/login'
  | '/signup'
  | '/forgot-password'
  | '/reset-password'
  | '/dashboard'
  | '/projects'
  | '/create'
  | '/editor'
  | '/guests'
  | '/settings'
  | '/superadmin'
  | '/admin'
  | '/admin/login'
  | '/admin/dashboard'
  | '/admin/payments'
  | '/admin/payment-verification'
  | '/admin/transactions'
  | '/admin/customers'
  | '/admin/invitations'
  | '/admin/packages'
  | '/admin/templates'
  | '/admin/categories'
  | '/admin/revenue'
  | '/admin/reports'
  | '/admin/settings'
  | '/invitation/:slug';

interface RouteMatch {
  path: string;
  route: AppRoute;
  params: Record<string, string>;
  queryParams: Record<string, string>;
}

interface RouterContextType {
  currentPath: string;
  currentRoute: AppRoute;
  params: Record<string, string>;
  queryParams: Record<string, string>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  isPublicRoute: boolean;
  isAdminRoute: boolean;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function matchRoute(rawPath: string): RouteMatch {
  let path = rawPath.trim();

  // Extract query parameters before stripping
  const queryParams: Record<string, string> = {};
  const queryPart = path.includes('?') ? path.split('?')[1] : (typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '');
  if (queryPart) {
    const sp = new URLSearchParams(queryPart.split('#')[0]);
    sp.forEach((val, key) => {
      queryParams[key] = val;
    });
  }

  // Strip hash prefix if hash routing is used (e.g. #/templates or #invitation/...)
  if (path.startsWith('#/')) {
    path = path.slice(1);
  } else if (path.startsWith('#invitation/')) {
    path = '/' + path.slice(1);
  }

  // Remove query string and trailing slashes
  path = path.split('?')[0].split('#')[0];
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  // Normalize legacy or direct html extensions
  if (path === '/login.html' || path === '/web/login.html') path = '/login';
  if (path === '/signup.html' || path === '/web/signup.html') path = '/signup';
  if (path === '/dashboard.html' || path === '/web/dashboard.html') path = '/dashboard';
  if (path === '/templates.html' || path === '/web/templates.html') path = '/templates';

  // Check invitation route pattern: /invitation/:slug
  const invitationMatch = path.match(/^\/invitation\/([a-zA-Z0-9_-]+)/);
  if (invitationMatch) {
    return {
      path,
      route: '/invitation/:slug',
      params: { slug: invitationMatch[1] },
      queryParams,
    };
  }

  const staticRoutes: AppRoute[] = [
    '/',
    '/templates',
    '/features',
    '/guest-pass',
    '/pricing',
    '/payment',
    '/about',
    '/contact',
    '/help',
    '/privacy',
    '/terms',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/dashboard',
    '/projects',
    '/create',
    '/editor',
    '/guests',
    '/settings',
    '/superadmin',
    '/admin',
    '/admin/login',
    '/admin/dashboard',
    '/admin/payments',
    '/admin/payment-verification',
    '/admin/transactions',
    '/admin/customers',
    '/admin/invitations',
    '/admin/packages',
    '/admin/templates',
    '/admin/categories',
    '/admin/revenue',
    '/admin/reports',
    '/admin/settings',
  ];

  if (staticRoutes.includes(path as AppRoute)) {
    return {
      path,
      route: path as AppRoute,
      params: {},
      queryParams,
    };
  }

  // Fallback for unknown path
  return {
    path,
    route: '/',
    params: {},
    queryParams,
  };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPath = (): string => {
    // Check hash first (for #invitation/... or #/path)
    if (window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    if (window.location.hash.startsWith('#invitation/')) {
      return '/' + window.location.hash.slice(1);
    }
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handleLocationChange = () => {
      let next = window.location.pathname || '/';
      if (window.location.hash.startsWith('#/')) {
        next = window.location.hash.slice(1);
      } else if (window.location.hash.startsWith('#invitation/')) {
        next = '/' + window.location.hash.slice(1);
      }
      setCurrentPath(next);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    let clean = to.trim();
    if (!clean.startsWith('/')) clean = '/' + clean;

    if (options?.replace) {
      window.history.replaceState({}, '', clean);
    } else {
      window.history.pushState({}, '', clean);
    }
    setCurrentPath(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const match = matchRoute(currentPath);

  const publicRoutes: AppRoute[] = [
    '/',
    '/templates',
    '/features',
    '/guest-pass',
    '/pricing',
    '/payment',
    '/about',
    '/contact',
    '/help',
    '/privacy',
    '/terms',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/invitation/:slug',
  ];

  const isPublicRoute = publicRoutes.includes(match.route);
  const isAdminRoute =
    match.path === '/admin' ||
    match.path.startsWith('/admin/') ||
    match.path === '/superadmin' ||
    match.path.startsWith('/superadmin/');

  return (
    <RouterContext.Provider
      value={{
        currentPath: match.path,
        currentRoute: match.route,
        params: match.params,
        queryParams: match.queryParams,
        navigate,
        isPublicRoute,
        isAdminRoute,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
