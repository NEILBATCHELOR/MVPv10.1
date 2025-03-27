import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  error?: Error | string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "An error occurred",
  message,
  onRetry,
  error,
}) => {
  const errorMessage = typeof error === "string" ? error : error?.message;
  const displayMessage =
    message || errorMessage || "Something went wrong. Please try again.";

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">{displayMessage}</div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onRetry}
          >
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
