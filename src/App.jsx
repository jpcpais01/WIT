import React, { useState } from 'react';
import Camera from './components/Camera';
import AIResult from './components/AIResult';
import { identifyObject } from './services/groqApi';
import './styles/App.css';

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [additionalText, setAdditionalText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
  };

  return (
    <div className="app">
      <div className="neural-bg"></div>
      <div className="main-container">
        <header className="header">
          <h1 className="app-title" data-text="What is This?">What is This?</h1>
          <p className="app-subtitle">
            Next-level AI object identification using your camera
          </p>
        </header>

        <Camera
          onCapture={handleImageCapture}
          disabled={isLoading}
        />

        <div className="input-section">
          <input
            type="text"
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)}
            placeholder="Optional: Add context or ask a specific question about the image..."
            className="text-input"
            disabled={isLoading}
          />

          <div className="action-buttons">
            <button
              className="glass-button primary"
              onClick={handleIdentifyObject}
              disabled={!capturedImage || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>🔍 Identify Object</>
              )}
            </button>

            {(capturedImage || result) && (
              <button
                className="glass-button"
                onClick={handleReset}
                disabled={isLoading}
              >
                🔄 Start Over
              </button>
            )}
          </div>
        </div>

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