import React, { useState } from 'react';
import { testFirebaseStorage } from '../utils/firebaseConfig';
import TestResult from '../components/TestResult';

export default function TestStoragePage() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    console.log('Run Test button clicked');
    const result = await testFirebaseStorage();
    console.log('Test result:', result);
    setTestResult(result);
    setIsLoading(false);
  };

  const handleRunAnotherTest = () => {
    setTestResult(null);
  };

  return (
    <div>
      <h1>Test Firebase Storage</h1>
      {!testResult && (
        <button onClick={runTest} disabled={isLoading}>
          {isLoading ? 'Running Test...' : 'Run Test'}
        </button>
      )}
      {testResult && (
        <TestResult 
          result={testResult.message} 
          onRunAnotherTest={handleRunAnotherTest} 
        />
      )}
    </div>
  );
}