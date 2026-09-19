import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from '@/features/layout/components/Layout';
import { Skeleton } from '@/components/Skeleton/Skeleton';

const LazyDashboardView = lazy(() =>
  import('@/features/dashboard/components/DashboardView').then((m) => ({
    default: m.DashboardView
  }))
);

const LazyDebatersListView = lazy(() =>
  import('@/features/debaters/components/DebatersListView').then((m) => ({
    default: m.DebatersListView
  }))
);

const LazyRankingView = lazy(() =>
  import('@/features/ranking/components/RankingView').then((m) => ({
    default: m.RankingView
  }))
);

const LazyDebateDetailView = lazy(() =>
  import('@/features/debates/components/DebateDetailView').then((m) => ({
    default: m.DebateDetailView
  }))
);

const RouteLoadingFallback = () => (
  <div className="space-y-6 p-4">
    <Skeleton className="h-24 w-full rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <LazyDashboardView />
          </Suspense>
        )
      },
      {
        path: 'debaters',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <LazyDebatersListView />
          </Suspense>
        )
      },
      {
        path: 'ranking',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <LazyRankingView />
          </Suspense>
        )
      },
      {
        path: 'debates/:id',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <LazyDebateDetailView />
          </Suspense>
        )
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
