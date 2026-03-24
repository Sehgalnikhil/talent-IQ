import React from "react";
import { AlertTriangleIcon } from "lucide-react";

/**
 * Premium Error Boundary wrapper preventing subcomponent failures 
 * from crashing entire dashboard pages.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Layout Component Crash Sub-caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card bg-base-100/40 backdrop-blur-md border border-error/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full">
          <AlertTriangleIcon className="size-8 text-error mb-2 animate-pulse" />
          <h4 className="font-bold text-sm text-base-content/90 mb-1">Widget Unavailable</h4>
          <p className="text-xs text-base-content/50">Component failed to load securely.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
