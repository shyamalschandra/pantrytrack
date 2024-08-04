import React from 'react';

export interface TestResultProps {
  success: boolean;
  message: string;
  onRunAnotherTest: () => void;
}

const TestResult: React.FC<TestResultProps> = ({ success, message, onRunAnotherTest }) => {
  return (
    <div>
      <h2>{success ? 'Test Passed' : 'Test Failed'}</h2>
      <p>{message}</p>
      <button onClick={onRunAnotherTest}>Run Another Test</button>
    </div>
  );
};

export default TestResult;