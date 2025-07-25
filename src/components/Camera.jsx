import React, { useState, useRef, useEffect } from 'react';

const Camera = ({ onCapture, disabled }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [error, setError] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState(16/9);
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
      setError('Camera access denied. Please allow camera permissions and refresh the page, or upload a photo instead.');
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

  // Reset camera (used internally when component resets)
  const resetCamera = () => {
    setCapturedImage(null);
    setError('');
    setVideoReady(false);
    setVideoAspectRatio(16/9); // Reset to modern default aspect ratio
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

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
  }, []);

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
      <div 
        className="camera-preview"
        style={{
          aspectRatio: videoAspectRatio,
        }}
      >
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" />
        ) : stream ? (
          <>
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                console.log('Video metadata loaded');
                if (videoRef.current) {
                  const { videoWidth, videoHeight } = videoRef.current;
                  if (videoWidth && videoHeight) {
                    const aspectRatio = videoWidth / videoHeight;
                    // Ensure aspect ratio is reasonable (between 0.5 and 3.0)
                    if (aspectRatio > 0.5 && aspectRatio < 3.0) {
                      setVideoAspectRatio(aspectRatio);
                      console.log(`Video aspect ratio: ${aspectRatio.toFixed(2)} (${videoWidth}x${videoHeight})`);
                    } else {
                      console.log(`Invalid aspect ratio ${aspectRatio}, keeping default 16:9`);
                    }
                  }
                }
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
            <div>
              {isLoading ? 'Starting camera...' : 'Camera starting...'}
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="file-upload-input"
        disabled={disabled}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!capturedImage && (
        <div className="camera-controls">
          <button
            className="camera-button primary"
            onClick={capturePhoto}
            disabled={disabled || !stream || !videoReady}
          >
            Take Photo
          </button>
          <button
            className="camera-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            Upload Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera; 