import { Component, ErrorInfo, ReactNode } from "react";
import ErrorState from "../ErrorState";

export interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // You can log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <ErrorState
            title="Something went wrong"
            message={
              this.state.error?.message || "An unexpected error occurred"
            }
            onRetry={() => this.setState({ hasError: false, error: undefined })}
          />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
