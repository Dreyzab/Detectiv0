import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        if (import.meta.env.DEV) {

            console.error('[ErrorBoundary]', error, info);
        }
        this.props.onError?.(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div className="min-h-screen bg-stone-950 text-stone-300 flex items-center justify-center p-6">
                        <div className="max-w-md text-center space-y-3">
                            <h1 className="text-xl font-bold text-amber-500">Something went wrong</h1>
                            <p className="text-sm text-stone-400">
                                Try refreshing the page. If the problem persists, contact support.
                            </p>
                        </div>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
