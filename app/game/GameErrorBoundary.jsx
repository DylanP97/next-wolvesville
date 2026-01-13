'use client';

import React from 'react';

class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Game Error Boundary caught an error:', error, errorInfo);

    // Store error details in state
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // TODO: You can also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReturnHome = () => {
    window.location.href = '/';
  };

  handleReconnect = () => {
    // Clear error state and attempt to remount
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Force a page reload to reconnect
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#101010',
            color: '#fff',
            padding: '2rem',
            textAlign: 'center',
            gap: '1.5rem'
          }}
        >
          <div style={{ fontSize: '4rem' }}>⚠️</div>

          <h1 style={{ fontSize: '2rem', margin: 0 }}>Game Error</h1>

          <p style={{ fontSize: '1.1rem', maxWidth: '500px', margin: 0 }}>
            Something went wrong during the game. You can try reconnecting or return to the homepage.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={this.handleReconnect}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#52525B',
                color: '#fff',
                fontWeight: 'bold',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.opacity = '0.8')}
              onMouseOut={(e) => (e.target.style.opacity = '1')}
            >
              🔄 Try Reconnecting
            </button>

            <button
              onClick={this.handleReturnHome}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#e50403',
                color: '#fff',
                fontWeight: 'bold',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.opacity = '0.8')}
              onMouseOut={(e) => (e.target.style.opacity = '1')}
            >
              🏠 Return Home
            </button>
          </div>

          {isDev && this.state.error && (
            <details
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#1a1a1a',
                borderRadius: '6px',
                maxWidth: '800px',
                textAlign: 'left',
                fontSize: '0.9rem',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Error Details (Dev Mode)
              </summary>
              <div style={{ marginTop: '1rem' }}>
                <strong>Error:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', color: '#ff6b6b' }}>
                  {this.state.error.toString()}
                </pre>
              </div>
              {this.state.errorInfo && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Component Stack:</strong>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', color: '#ffd93d' }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default GameErrorBoundary;
