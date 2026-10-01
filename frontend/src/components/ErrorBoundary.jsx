import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "./ui/Button";

/**
 * App-level ErrorBoundary that catches unhandled React runtime errors.
 * Displays a friendly user-facing fallback without leaking internal stack traces.
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
    // Log to console for debugging without rendering stack traces to UI
    console.error("App Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  handleHome = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrapper" role="alert">
          <div className="error-boundary-card">
            <div className="error-boundary-icon-wrapper">
              <AlertTriangle size={36} className="error-boundary-icon" />
            </div>

            <div className="error-boundary-badge">Application Notice</div>

            <h1 className="error-boundary-title">Something went wrong</h1>

            <p className="error-boundary-desc">
              We encountered an unexpected problem loading this section.
              Don&apos;t worry — your data and saved progress remain safe. Please
              refresh the page or return to the main dashboard.
            </p>

            <div className="error-boundary-actions">
              <Button
                variant="primary"
                onClick={this.handleReset}
                leftIcon={<RefreshCw size={16} />}
              >
                Refresh Page
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleHome}
                leftIcon={<Home size={16} />}
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
