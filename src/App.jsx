import React, { useState } from 'react';
import Camera from './components/Camera';
import AIResult from './components/AIResult';
import { identifyObject } from './services/groqApi';
import { usePWAInstall } from './hooks/usePWAInstall';
import './styles/App.css';

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [additionalText, setAdditionalText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();

  const handleImageCapture = (imageFile) => {
    setCapturedImage(imageFile);
    setResult('');
    setError('');
  };

  const handleIdentifyObject = async () => {
    if (!capturedImage) {
      setError('Please capture or upload an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const identification = await identifyObject(capturedImage, additionalText);
      setResult(identification);
    } catch (err) {
      console.error('Error identifying object:', err);
      setError(err.message || 'Failed to identify object. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAdditionalText('');
    setResult('');
    setError('');
    setResetKey(prev => prev + 1); // Force Camera component to reset
  };

  return (
    <div className="app">
      <div className="neural-bg"></div>
      <div className="main-container">
        {/* PWA Install Button */}
        <div className={`pwa-install-container ${isInstallable && !isInstalled ? 'show' : ''}`}>
          <button
            className="glass-button pwa-install-button"
            onClick={installPWA}
          >
            Install App
          </button>
        </div>

        <Camera
          key={resetKey}
          onCapture={handleImageCapture}
          disabled={isLoading}
        />

        {capturedImage && (
          <div className="input-section">
            <input
              type="text"
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              placeholder="Optional: Add context or ask a specific question..."
              className="text-input"
              disabled={isLoading}
            />

            <div className="action-buttons">
              <button
                className="glass-button primary"
                onClick={handleIdentifyObject}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>Identify Object</>
                )}
              </button>

              <button
                className="glass-button secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <AIResult result={result} />
        )}

        {/* API Key reminder */}
        {!import.meta.env.VITE_GROQ_API_KEY && (
          <div className="error-message">
            <strong>Setup Required:</strong> Please create a .env file with your Groq API key.
            <br />
            <code>VITE_GROQ_API_KEY=your_api_key_here</code>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 