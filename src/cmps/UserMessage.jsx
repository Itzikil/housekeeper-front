import React, { useState, useEffect } from 'react';

export const useMessagePopup = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let timeoutId;

    if (message) {
      timeoutId = setTimeout(() => {
        setMessage(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);

  const showMessage = (text, isSuccess) => {
    setMessage({
      text,
      isSuccess,
    });
  };

  const MessagePopup = () => {
    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          borderRadius: '5px',
          color: '#fff',
          backgroundColor: message?.isSuccess ? '#32CD32' : '#FF4500',
          opacity: message ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {message?.text}
      </div>
    );
  };

  return [showMessage, MessagePopup];
};

// Usage Example
const MyComponent = () => {
  const [showMessage, MessagePopup] = useMessagePopup();

  const handleSuccess = () => {
    showMessage('Success!', true);
  };

  const handleError = () => {
    showMessage('Error occurred!', false);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <MessagePopup />
    </div>
  );
};