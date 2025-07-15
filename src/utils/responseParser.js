// Parse structured AI response into organized data
export const parseAIResponse = (response) => {
  if (!response || typeof response !== 'string') {
    return {
      title: 'Unknown Object',
      description: 'Unable to identify this object.',
      features: [],
      context: 'Please try again with a clearer image.',
      confidence: 'Low',
      error: true
    };
  }

  try {
    // Initialize default values
    const parsed = {
      title: 'Unknown Object',
      description: '',
      features: [],
      context: '',
      confidence: 'Low',
      error: false
    };

    // Split response into lines and process each section
    const lines = response.trim().split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('TITLE:')) {
        parsed.title = trimmedLine.replace('TITLE:', '').trim();
      } else if (trimmedLine.startsWith('DESCRIPTION:')) {
        parsed.description = trimmedLine.replace('DESCRIPTION:', '').trim();
      } else if (trimmedLine.startsWith('FEATURES:')) {
        const featuresText = trimmedLine.replace('FEATURES:', '').trim();
        parsed.features = featuresText.split('•').map(feature => feature.trim()).filter(feature => feature.length > 0);
      } else if (trimmedLine.startsWith('CONTEXT:')) {
        parsed.context = trimmedLine.replace('CONTEXT:', '').trim();
      } else if (trimmedLine.startsWith('CONFIDENCE:')) {
        const confidence = trimmedLine.replace('CONFIDENCE:', '').trim();
        parsed.confidence = ['High', 'Medium', 'Low'].includes(confidence) ? confidence : 'Low';
      }
    }

    // Validate that we have minimum required data
    if (!parsed.title || parsed.title === 'Unknown Object') {
      // Try to extract title from description if available
      if (parsed.description) {
        const words = parsed.description.split(' ').slice(0, 4);
        parsed.title = words.join(' ');
      }
    }

    // Ensure we have at least some content
    if (!parsed.description && !parsed.features.length && !parsed.context) {
      parsed.description = response; // Fallback to original response
      parsed.error = true;
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      title: 'Parsing Error',
      description: response, // Show original response as fallback
      features: [],
      context: 'There was an error parsing the AI response.',
      confidence: 'Low',
      error: true
    };
  }
};

// Get confidence color based on confidence level
export const getConfidenceColor = (confidence) => {
  switch (confidence.toLowerCase()) {
    case 'high':
      return 'var(--success-color)';
    case 'medium':
      return 'var(--warning-color)';
    case 'low':
      return 'var(--error-color)';
    default:
      return 'var(--text-secondary)';
  }
};

// Get confidence icon based on confidence level
export const getConfidenceIcon = (confidence) => {
  switch (confidence.toLowerCase()) {
    case 'high':
      return '🎯';
    case 'medium':
      return '⚡';
    case 'low':
      return '❓';
    default:
      return '🔍';
  }
}; 