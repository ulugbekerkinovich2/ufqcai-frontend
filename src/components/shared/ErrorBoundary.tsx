import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface State {
  err: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", err, info);
  }

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="card p-8 border border-risk-high-bg">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-risk-high-bg text-risk-high-fg grid place-items-center">
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-lg mb-1.5">Sahifada xato yuz berdi</h2>
            <p className="text-sm text-ink-muted mb-3">{this.state.err.message}</p>
            <button
              onClick={() => this.setState({ err: null })}
              className="btn-secondary"
            >Qayta yuklash</button>
          </div>
        </div>
      </div>
    );
  }
}
