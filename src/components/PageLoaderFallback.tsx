import React from 'react';
import { useRouter } from '../context/RouterContext';

export interface PageLoaderFallbackProps {
  variant?: 'auto' | 'dashboard' | 'invitation' | 'editor' | 'guests' | 'projects' | 'create';
}

/**
 * Modern High-Fidelity Skeleton Screen for DynamicEventHeader & HomeScreen Dashboard
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 animate-page-fade">
    {/* Event Hero Banner Skeleton */}
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl text-white">
      {/* Background Ambient Glow Placeholders */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute right-36 -top-16 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Information */}
        <div className="space-y-3 max-w-xl">
          {/* Badge & Mode */}
          <div className="flex items-center space-x-2.5">
            <div className="w-24 h-6 rounded-full skeleton-shimmer skeleton-dark" />
            <div className="w-20 h-6 rounded-full skeleton-shimmer skeleton-dark" />
          </div>

          {/* Event Title Skeleton */}
          <div className="w-72 sm:w-96 h-8 sm:h-10 rounded-xl skeleton-shimmer skeleton-dark" />

          {/* Event Metadata (Date & Venue) */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="w-36 h-5 rounded-lg skeleton-shimmer skeleton-dark" />
            <div className="w-48 h-5 rounded-lg skeleton-shimmer skeleton-dark" />
          </div>
        </div>

        {/* Right Countdown & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center">
          {/* 4 Countdown Boxes */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-14 sm:w-16 h-16 sm:h-18 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2 flex flex-col items-center justify-center space-y-1"
              >
                <div className="w-7 h-5 rounded skeleton-shimmer skeleton-dark" />
                <div className="w-8 h-2.5 rounded skeleton-shimmer skeleton-dark" />
              </div>
            ))}
          </div>

          {/* Action Button Skeleton */}
          <div className="w-32 h-11 rounded-xl skeleton-shimmer skeleton-dark" />
        </div>
      </div>
    </div>

    {/* 3 Metric Cards Grid Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((card) => (
        <div
          key={card}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl skeleton-shimmer" />
              <div className="w-24 h-4 rounded-md skeleton-shimmer" />
            </div>
            <div className="w-14 h-5 rounded-full skeleton-shimmer" />
          </div>

          {/* Big Number */}
          <div className="flex items-baseline space-x-2 pt-1">
            <div className="w-28 h-8 rounded-lg skeleton-shimmer" />
            <div className="w-16 h-4 rounded skeleton-shimmer" />
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full skeleton-shimmer" />

          {/* Sub-pills Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="w-20 h-4 rounded-md skeleton-shimmer" />
            <div className="w-24 h-4 rounded-md skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>

    {/* 6 Feature Module Cards Grid Skeleton */}
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="w-44 h-5 rounded-lg skeleton-shimmer" />
        <div className="w-28 h-4 rounded-md skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl skeleton-shimmer" />
              <div className="w-16 h-5 rounded-full skeleton-shimmer" />
            </div>
            <div className="w-36 h-5 rounded-md skeleton-shimmer" />
            <div className="space-y-1.5">
              <div className="w-full h-3.5 rounded skeleton-shimmer" />
              <div className="w-4/5 h-3.5 rounded skeleton-shimmer" />
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div className="w-20 h-4 rounded skeleton-shimmer" />
              <div className="w-5 h-5 rounded-full skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Modern High-Fidelity Skeleton Screen for Public Invitation View
 */
export const InvitationSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center animate-page-fade">
    <div className="max-w-md w-full mx-auto bg-slate-800/90 rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
      {/* Top Floating Badges */}
      <div className="flex items-center justify-between">
        <div className="w-24 h-7 rounded-full skeleton-shimmer skeleton-dark" />
        <div className="w-10 h-10 rounded-full skeleton-shimmer skeleton-dark" />
      </div>

      {/* Main Cover Image Frame */}
      <div className="relative w-full aspect-[4/3] rounded-2xl skeleton-shimmer skeleton-dark overflow-hidden flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10" />
      </div>

      {/* Couple Titles */}
      <div className="space-y-2 flex flex-col items-center">
        <div className="w-32 h-3.5 rounded-full skeleton-shimmer skeleton-dark" />
        <div className="w-52 h-8 rounded-xl skeleton-shimmer skeleton-dark" />
        <div className="w-40 h-4 rounded-md skeleton-shimmer skeleton-dark" />
      </div>

      {/* Date & Location Card */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
        <div className="w-48 h-4 mx-auto rounded skeleton-shimmer skeleton-dark" />
        <div className="w-36 h-3.5 mx-auto rounded skeleton-shimmer skeleton-dark" />
      </div>

      {/* Countdown Grid */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((box) => (
          <div
            key={box}
            className="h-16 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center space-y-1"
          >
            <div className="w-6 h-5 rounded skeleton-shimmer skeleton-dark" />
            <div className="w-7 h-2.5 rounded skeleton-shimmer skeleton-dark" />
          </div>
        ))}
      </div>

      {/* RSVP Button Skeleton */}
      <div className="w-full h-12 rounded-2xl skeleton-shimmer skeleton-dark" />
    </div>
  </div>
);

/**
 * Modern High-Fidelity Skeleton Screen for Editor Screen
 */
export const EditorSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 animate-page-fade">
    {/* Editor Header Bar */}
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl skeleton-shimmer" />
        <div className="space-y-1.5">
          <div className="w-48 h-5 rounded-md skeleton-shimmer" />
          <div className="w-28 h-3.5 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-28 h-10 rounded-xl skeleton-shimmer" />
        <div className="w-32 h-10 rounded-xl skeleton-shimmer" />
      </div>
    </div>

    {/* Editor Two-Column Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Form Section */}
      <div className="lg:col-span-7 space-y-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-36 h-5 rounded-md skeleton-shimmer mb-2" />
          <div className="space-y-2">
            <div className="w-24 h-4 rounded skeleton-shimmer" />
            <div className="w-full h-11 rounded-xl skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="w-20 h-4 rounded skeleton-shimmer" />
              <div className="w-full h-11 rounded-xl skeleton-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="w-20 h-4 rounded skeleton-shimmer" />
              <div className="w-full h-11 rounded-xl skeleton-shimmer" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-28 h-4 rounded skeleton-shimmer" />
            <div className="w-full h-11 rounded-xl skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="w-24 h-4 rounded skeleton-shimmer" />
            <div className="w-full h-24 rounded-xl skeleton-shimmer" />
          </div>
        </div>

        {/* Media Uploader Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-40 h-5 rounded-md skeleton-shimmer" />
          <div className="w-full h-32 rounded-2xl skeleton-shimmer" />
        </div>
      </div>

      {/* Right Smartphone Live Preview Mockup */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="w-full max-w-sm rounded-[40px] border-4 border-slate-800 bg-slate-900 p-4 shadow-2xl space-y-4">
          <div className="w-28 h-4 mx-auto rounded-full bg-slate-800" />
          <div className="w-full aspect-[9/16] rounded-3xl skeleton-shimmer skeleton-dark p-6 flex flex-col items-center justify-between">
            <div className="w-20 h-5 rounded-full skeleton-shimmer skeleton-dark" />
            <div className="space-y-2 text-center w-full flex flex-col items-center">
              <div className="w-32 h-6 rounded-lg skeleton-shimmer skeleton-dark" />
              <div className="w-24 h-4 rounded skeleton-shimmer skeleton-dark" />
            </div>
            <div className="w-full h-10 rounded-xl skeleton-shimmer skeleton-dark" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Modern High-Fidelity Skeleton Screen for Guest Screen (Buku Tamu & RSVP)
 */
export const GuestsSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 animate-page-fade">
    {/* 4 Stat Metric Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((stat) => (
        <div
          key={stat}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-16 sm:w-20 h-3.5 rounded skeleton-shimmer" />
            <div className="w-6 h-6 rounded-lg skeleton-shimmer" />
          </div>
          <div className="w-14 sm:w-16 h-7 rounded-lg skeleton-shimmer" />
        </div>
      ))}
    </div>

    {/* Toolbar Controls */}
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="w-full md:w-72 h-11 rounded-xl skeleton-shimmer" />
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-24 h-10 rounded-xl skeleton-shimmer" />
        <div className="w-28 h-10 rounded-xl skeleton-shimmer" />
        <div className="w-32 h-10 rounded-xl skeleton-shimmer" />
      </div>
    </div>

    {/* Guest List Tabular Skeleton */}
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map((row) => (
        <div key={row} className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-full skeleton-shimmer shrink-0" />
            <div className="space-y-1.5">
              <div className="w-36 sm:w-48 h-4.5 rounded skeleton-shimmer" />
              <div className="w-24 sm:w-32 h-3.5 rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block w-16 h-6 rounded-full skeleton-shimmer" />
            <div className="w-20 h-6 rounded-full skeleton-shimmer" />
            <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Modern High-Fidelity Skeleton Screen for Projects & Templates Screen
 */
export const ProjectsSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 animate-page-fade">
    {/* Page Title & Action Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="w-48 h-7 rounded-xl skeleton-shimmer" />
        <div className="w-72 h-4 rounded skeleton-shimmer" />
      </div>
      <div className="w-36 h-11 rounded-xl skeleton-shimmer" />
    </div>

    {/* Filter Pills */}
    <div className="flex items-center space-x-2 overflow-hidden py-1">
      {[1, 2, 3, 4, 5].map((pill) => (
        <div key={pill} className="w-20 h-9 rounded-xl skeleton-shimmer shrink-0" />
      ))}
    </div>

    {/* Project Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((card) => (
        <div
          key={card}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5"
        >
          {/* Cover Header */}
          <div className="w-full h-36 rounded-xl skeleton-shimmer" />

          {/* Title & Badge */}
          <div className="flex items-center justify-between">
            <div className="w-32 h-5 rounded-md skeleton-shimmer" />
            <div className="w-16 h-5 rounded-full skeleton-shimmer" />
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <div className="w-44 h-3.5 rounded skeleton-shimmer" />
            <div className="w-36 h-3.5 rounded skeleton-shimmer" />
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="w-24 h-4 rounded skeleton-shimmer" />
            <div className="w-20 h-8 rounded-lg skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Modern High-Fidelity Skeleton Screen for Create Event Wizard
 */
export const CreateEventSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-page-fade">
    {/* Stepper Wizard Skeleton */}
    <div className="flex items-center justify-center space-x-4 sm:space-x-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full skeleton-shimmer" />
          <div className="hidden sm:block w-20 h-4 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>

    {/* Form Card Skeleton */}
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <div className="w-56 h-6 rounded-lg skeleton-shimmer" />
        <div className="w-80 h-4 rounded skeleton-shimmer" />
      </div>

      {/* Category Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((cat) => (
          <div
            key={cat}
            className="p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col items-center justify-center h-28"
          >
            <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
            <div className="w-20 h-3.5 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="space-y-2">
          <div className="w-28 h-4 rounded skeleton-shimmer" />
          <div className="w-full h-11 rounded-xl skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="w-24 h-4 rounded skeleton-shimmer" />
            <div className="w-full h-11 rounded-xl skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="w-24 h-4 rounded skeleton-shimmer" />
            <div className="w-full h-11 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Unified Context-Aware High-Fidelity PageLoaderFallback
 */
export const PageLoaderFallback: React.FC<PageLoaderFallbackProps> = ({ variant = 'auto' }) => {
  const router = useRouter();
  const currentPath = router?.currentPath || '';
  const currentRoute = router?.currentRoute || '';

  // Determine which skeleton layout to render based on variant or active route
  if (variant === 'invitation' || currentRoute === '/invitation/:slug' || currentPath.startsWith('/invitation')) {
    return <InvitationSkeleton />;
  }

  if (variant === 'editor' || currentPath.startsWith('/editor')) {
    return <EditorSkeleton />;
  }

  if (variant === 'guests' || currentPath.startsWith('/guests')) {
    return <GuestsSkeleton />;
  }

  if (variant === 'projects' || currentPath.startsWith('/projects') || currentPath.startsWith('/templates')) {
    return <ProjectsSkeleton />;
  }

  if (variant === 'create' || currentPath.startsWith('/create')) {
    return <CreateEventSkeleton />;
  }

  // Default to Dashboard Skeleton for /dashboard and general workspace modules
  return <DashboardSkeleton />;
};

export default PageLoaderFallback;
