import React from 'react';

export interface TestResultProps {
  success: boolean;
  message: string;
  onClose: () => void;
}

const TestResult: React.FC<TestResultProps> = ({ success, message, onClose }) => {
  return (
    <div className="dialog">
      <h2>{success ? 'Item Added Successfully' : 'Failed to Add Item'}</h2>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TestResult;