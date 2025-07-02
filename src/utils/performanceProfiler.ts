// Performance profiling utilities for React components and functions

interface ProfilerData {
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<any>;
}

interface FunctionProfile {
  name: string;
  calls: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  lastCalled: number;
}

class PerformanceProfiler {
  private componentProfiles: Map<string, ProfilerData[]> = new Map();
  private functionProfiles: Map<string, FunctionProfile> = new Map();
  private marks: Map<string, number> = new Map();
  private isEnabled: boolean = false;

  constructor() {
    // Enable in development only
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  // React Profiler callback
  onRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<any>
  ) => {
    if (!this.isEnabled) return;

    const data: ProfilerData = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions,
    };

    if (!this.componentProfiles.has(id)) {
      this.componentProfiles.set(id, []);
    }
    
    const profiles = this.componentProfiles.get(id)!;
    profiles.push(data);
    
    // Keep only last 100 profiles per component
    if (profiles.length > 100) {
      profiles.shift();
    }

    // Log slow renders
    if (actualDuration > 16.67) { // More than one frame (60fps)
      console.warn(`Slow render detected in ${id}:`, {
        phase,
        duration: actualDuration.toFixed(2) + 'ms',
        baseline: baseDuration.toFixed(2) + 'ms',
      });
    }
  };

  // Mark performance start
  mark(name: string) {
    if (!this.isEnabled) return;
    this.marks.set(name, performance.now());
  }

  // Measure performance between marks
  measure(name: string, startMark: string, endMark?: string): number | null {
    if (!this.isEnabled) return null;

    const startTime = this.marks.get(startMark);
    if (!startTime) {
      console.warn(`Mark "${startMark}" not found`);
      return null;
    }

    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    if (!endTime) {
      console.warn(`Mark "${endMark}" not found`);
      return null;
    }

    const duration = endTime - startTime;

    // Clean up marks
    this.marks.delete(startMark);
    if (endMark) {
      this.marks.delete(endMark);
    }

    // Store in Performance API
    if ('measure' in performance) {
      try {
        performance.measure(name, {
          start: startTime,
          end: endTime,
        });
      } catch (e) {
        // Fallback for older browsers
      }
    }

    return duration;
  }

  // Profile a function
  profileFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T {
    if (!this.isEnabled) return fn;

    return ((...args: Parameters<T>) => {
      const start = performance.now();
      
      try {
        const result = fn(...args);
        
        // Handle async functions
        if (result instanceof Promise) {
          return result.finally(() => {
            this.recordFunctionProfile(name, performance.now() - start);
          });
        }
        
        this.recordFunctionProfile(name, performance.now() - start);
        return result;
      } catch (error) {
        this.recordFunctionProfile(name, performance.now() - start);
        throw error;
      }
    }) as T;
  }

  // Record function profile data
  private recordFunctionProfile(name: string, duration: number) {
    const existing = this.functionProfiles.get(name);
    
    if (existing) {
      existing.calls++;
      existing.totalTime += duration;
      existing.avgTime = existing.totalTime / existing.calls;
      existing.minTime = Math.min(existing.minTime, duration);
      existing.maxTime = Math.max(existing.maxTime, duration);
      existing.lastCalled = Date.now();
    } else {
      this.functionProfiles.set(name, {
        name,
        calls: 1,
        totalTime: duration,
        avgTime: duration,
        minTime: duration,
        maxTime: duration,
        lastCalled: Date.now(),
      });
    }

    // Log slow function calls
    if (duration > 50) {
      console.warn(`Slow function call "${name}": ${duration.toFixed(2)}ms`);
    }
  }

  // Get component stats
  getComponentStats(id: string) {
    const profiles = this.componentProfiles.get(id);
    if (!profiles || profiles.length === 0) return null;

    const durations = profiles.map(p => p.actualDuration);
    const total = durations.reduce((a, b) => a + b, 0);
    
    return {
      id,
      renderCount: profiles.length,
      totalTime: total,
      avgTime: total / profiles.length,
      minTime: Math.min(...durations),
      maxTime: Math.max(...durations),
      mountCount: profiles.filter(p => p.phase === 'mount').length,
      updateCount: profiles.filter(p => p.phase === 'update').length,
    };
  }

  // Get all component stats
  getAllComponentStats() {
    const stats: ReturnType<typeof this.getComponentStats>[] = [];
    
    this.componentProfiles.forEach((_, id) => {
      const stat = this.getComponentStats(id);
      if (stat) stats.push(stat);
    });

    // Sort by total time descending
    return stats.sort((a, b) => b!.totalTime - a!.totalTime);
  }

  // Get function stats
  getFunctionStats(name?: string) {
    if (name) {
      return this.functionProfiles.get(name);
    }
    
    // Return all function stats sorted by total time
    return Array.from(this.functionProfiles.values())
      .sort((a, b) => b.totalTime - a.totalTime);
  }

  // Clear all profiles
  clear() {
    this.componentProfiles.clear();
    this.functionProfiles.clear();
    this.marks.clear();
  }

  // Export profile data
  exportData() {
    return {
      timestamp: Date.now(),
      components: this.getAllComponentStats(),
      functions: this.getFunctionStats(),
    };
  }

  // Create a performance report
  generateReport() {
    const componentStats = this.getAllComponentStats();
    const functionStats = this.getFunctionStats();

    console.group('🎯 Performance Report');
    
    console.group('📊 Component Render Performance');
    console.table(componentStats.slice(0, 10).map(stat => ({
      Component: stat!.id,
      'Renders': stat!.renderCount,
      'Avg Time (ms)': stat!.avgTime.toFixed(2),
      'Total Time (ms)': stat!.totalTime.toFixed(2),
      'Max Time (ms)': stat!.maxTime.toFixed(2),
    })));
    console.groupEnd();

    console.group('⚡ Function Performance');
    console.table((functionStats as FunctionProfile[]).slice(0, 10).map(stat => ({
      Function: stat.name,
      Calls: stat.calls,
      'Avg Time (ms)': stat.avgTime.toFixed(2),
      'Total Time (ms)': stat.totalTime.toFixed(2),
      'Max Time (ms)': stat.maxTime.toFixed(2),
    })));
    console.groupEnd();

    console.groupEnd();
  }
}

// Singleton instance
export const profiler = new PerformanceProfiler();

// HOC for profiling React components
export function withProfiler<P extends object>(
  Component: React.ComponentType<P>,
  id?: string
): React.ComponentType<P> {
  const displayName = id || Component.displayName || Component.name || 'Component';
  
  const ProfiledComponent = React.forwardRef<any, P>((props, ref) => {
    return (
      <React.Profiler id={displayName} onRender={profiler.onRenderCallback}>
        <Component {...props} ref={ref} />
      </React.Profiler>
    );
  });

  ProfiledComponent.displayName = `withProfiler(${displayName})`;
  
  return ProfiledComponent;
}

// Decorator for profiling class methods
export function profileMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const className = target.constructor.name;
  const methodName = `${className}.${propertyKey}`;

  descriptor.value = profiler.profileFunction(methodName, originalMethod);
  
  return descriptor;
}

// Utility to profile async operations
export async function profileAsync<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  profiler.mark(`${name}-start`);
  
  try {
    const result = await operation();
    const duration = profiler.measure(name, `${name}-start`);
    
    if (duration && duration > 100) {
      console.warn(`Slow async operation "${name}": ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    profiler.measure(name, `${name}-start`);
    throw error;
  }
}

// React Hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    
    return () => {
      const lifetime = performance.now() - mountTime.current;
      console.debug(`${componentName} unmounted after ${renderCount.current} renders and ${lifetime.toFixed(2)}ms`);
    };
  }, [componentName]);

  useEffect(() => {
    profiler.mark(`${componentName}-render-start`);
    
    return () => {
      const duration = profiler.measure(
        `${componentName}-render`,
        `${componentName}-render-start`
      );
      
      if (duration && duration > 16.67) {
        console.warn(`Slow render in ${componentName}: ${duration.toFixed(2)}ms`);
      }
    };
  });
}