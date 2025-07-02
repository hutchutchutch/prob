import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeCanvasSubscriptions } from "./stores/canvasStore";

// Don't initialize canvas subscriptions - WorkflowCanvas manages nodes directly
// initializeCanvasSubscriptions();

console.log('[main.tsx] Starting application...');

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('[main.tsx] Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[main.tsx] Unhandled promise rejection:', event.reason);
});

// Simple error boundary
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', backgroundColor: 'white' }}>
          <h1>Something went wrong.</h1>
          <p>Check the console for details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
console.log('[main.tsx] Root element found:', rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
  console.log('[main.tsx] React app rendered');
} else {
  console.error('[main.tsx] Root element not found!');
}
