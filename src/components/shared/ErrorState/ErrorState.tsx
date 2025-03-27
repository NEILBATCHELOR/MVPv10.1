// This file is kept as a placeholder to prevent import errors
// The ErrorState functionality has been removed

import React from "react";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  error?: Error | string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ children }) => {
  return <>{children}</>;
};

export default ErrorState;
