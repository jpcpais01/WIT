import React, { useState, useRef, useEffect } from 'react';

const Camera = ({ onCapture, disabled }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      setError('');
      setIsLoading(true);
      
            // Try different camera constraints for better compatibility
      let mediaStream;
      
      // Try with specific constraints first
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      };

      try {
        // Try environment camera first (back camera)
        constraints.video.facingMode = 'environment';
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Got environment camera stream');
      } catch (envError) {
        try {
          // Fallback to front camera
          constraints.video.facingMode = 'user';
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('Got user camera stream');
        } catch (userError) {
          // Final fallback - basic video request
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('Got basic camera stream');
        }
      }
      
      if (mediaStream) {
        console.log('Stream tracks:', mediaStream.getTracks());
        setStream(mediaStream);
      }
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions or try uploading a photo instead.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setVideoReady(false);
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        stopCamera();
        
        // Create file object from blob
        const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.8);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      stopCamera();
      onCapture(file);
    } else {
      setError('Please select a valid image file.');
    }
  };

  // Reset camera
  const resetCamera = () => {
    setCapturedImage(null);
    setError('');
    setVideoReady(false);
    if (stream) {
      stopCamera();
    }
  };

  // Handle stream changes - connect stream to video element
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      
      // Ensure video plays
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, []);

  return (
    <div className="camera-container">
      <div className="camera-preview">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" />
        ) : stream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                console.log('Video metadata loaded');
                setVideoReady(true);
              }}
              onCanPlay={() => {
                console.log('Video can play');
              }}
              onError={(e) => {
                console.error('Video error:', e);
                setError('Error playing video stream');
              }}
            />
            {!videoReady && (
              <div className="camera-placeholder">
                <span className="loading-spinner"></span>
                <div>Loading camera feed...</div>
              </div>
            )}
          </>
        ) : (
          <div className="camera-placeholder">
            <div className="camera-icon">📸</div>
            <div>Take a photo or upload an image</div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="file-input"
        disabled={disabled}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="camera-controls">
        {capturedImage ? (
          <>
            <button
              className="glass-button"
              onClick={resetCamera}
              disabled={disabled}
            >
              📷 Take Another
            </button>
            <button
              className="glass-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              📁 Upload New
            </button>
          </>
        ) : stream ? (
          <>
            <button
              className="glass-button"
              onClick={stopCamera}
              disabled={disabled}
            >
              ❌ Stop Camera
            </button>
            <button
              className="glass-button primary"
              onClick={capturePhoto}
              disabled={disabled}
            >
              📸 Capture Photo
            </button>
          </>
        ) : (
          <>
            <button
              className="glass-button"
              onClick={startCamera}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Starting Camera...
                </>
              ) : (
                <>📹 Start Camera</>
              )}
            </button>
            <button
              className="glass-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              📁 Upload Photo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Camera; 