import React from 'react';
import { getConfidenceColor, getConfidenceIcon } from '../utils/responseParser';

const AIResult = ({ result }) => {
  if (!result) return null;

  const { title, description, features, context, confidence, error } = result;

  return (
    <div className="ai-result-container">
      {/* Header with title and confidence */}
      <div className="ai-result-header">
        <h2 className="ai-result-title">{title}</h2>
        <div className={`ai-confidence-badge ${confidence?.toLowerCase() || 'medium'}`}>
          <span className="confidence-icon">{getConfidenceIcon(confidence)}</span>
          <span className="confidence-text">{confidence} Confidence</span>
        </div>
      </div>

      {/* Main content */}
      <div className="ai-result-content">
        {/* Description */}
        {description && (
          <div className="ai-result-section">
            <div className="section-header">
              <span className="section-icon">📝</span>
              <h3 className="section-title">Description</h3>
            </div>
            <div className="section-content">
              <p className="ai-result-description">{description}</p>
            </div>
          </div>
        )}

        {/* Features */}
        {features && features.length > 0 && (
          <div className="ai-result-section">
            <div className="section-header">
              <span className="section-icon">✨</span>
              <h3 className="section-title">Key Features</h3>
            </div>
            <div className="section-content">
              <div className="ai-result-features">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-bullet"></div>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Context */}
        {context && (
          <div className="ai-result-section">
            <div className="section-header">
              <span className="section-icon">🔍</span>
              <h3 className="section-title">Additional Context</h3>
            </div>
            <div className="section-content">
              <p className="ai-result-context">{context}</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="ai-result-error">
            <span className="error-icon">⚠️</span>
            <span>Response may be incomplete or unformatted</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResult; 