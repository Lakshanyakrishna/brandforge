import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

const Scene = lazy(() => import('./HeroScene3D'));

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img src="/logo-icon.png" alt="" className="w-28 h-28 object-contain opacity-90 animate-pulse" />
    </div>
  );
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('3D hero scene failed to render, showing static fallback', error);
  }

  render() {
    if (this.state.hasError) return <SceneFallback />;
    return this.props.children;
  }
}

export default function HeroScene() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="w-full h-full">
      <SceneErrorBoundary>
        <Suspense fallback={<SceneFallback />}>
          <Scene reducedMotion={reducedMotion} />
        </Suspense>
      </SceneErrorBoundary>
    </div>
  );
}
