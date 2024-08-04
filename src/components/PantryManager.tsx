import React, { useState } from 'react';
import TestResult from './TestResult';

const PantryManager: React.FC = () => {
  const [showResult, setShowResult] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const handleAddItem = () => {
    // Logic to add item to pantry
    const success = true; // Replace with actual result
    const message = success ? 'Item added to pantry.' : 'Failed to add item.';
    
    setAddSuccess(success);
    setResultMessage(message);
    setShowResult(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <div>
      <button onClick={handleAddItem}>Add Item to Pantry</button>
      {showResult && (
        <TestResult
          success={addSuccess}
          message={resultMessage}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
};

export default PantryManager;
