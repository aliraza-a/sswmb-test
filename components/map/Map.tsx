'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import type MapEngineType from './MapEngine';

// Dynamically import the MapEngine with ssr: false
const DynamicMapEngine = dynamic(() => import('./MapEngine'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 animate-pulse">
      <p className="text-slate-500 font-medium">Initializing GIS Data...</p>
    </div>
  )
});

export default function Map(props: ComponentProps<typeof MapEngineType>) {
  return <DynamicMapEngine {...props} />;
}
