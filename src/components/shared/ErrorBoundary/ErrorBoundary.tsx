// This file is kept as a placeholder to prevent import errors
// The ErrorBoundary functionality has been removed

import { ReactNode } from "react";

export interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary = ({ children }: Props) => {
  return children;
};

export default ErrorBoundary;
