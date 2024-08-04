import { useState } from 'react';
import { testFirebaseStorage } from '../utils/firebaseConfig';

export default function TestStoragePage() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Run Test button clicked');
    try {
      const result = await testFirebaseStorage();
      console.log('Test result:', result);
      setTestResult(result);
    } catch (error) {
      console.error('Error running test:', error);
      setError(`Error running test: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Test Firebase Storage</h1>
      <button onClick={runTest} disabled={isLoading}>
        {isLoading ? 'Running Test...' : 'Run Test'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {testResult && (
        <div>
          <p>{testResult.success ? 'Test passed' : 'Test failed'}</p>
          <p>{testResult.message}</p>
        </div>
      )}
    </div>
  );
}