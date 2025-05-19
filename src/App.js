import { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import './styles.css';

function App() {
  const [code, setCode] = useState(`# Welcome to Python Playground!
print("Hello World!")`);

  const [output, setOutput] = useState('Loading Python runtime...');
  const [isPyodideLoaded, setIsPyodideLoaded] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if Pyodide is already loaded
    if (window.loadPyodide) {
      loadPyodideRuntime();
    } else {
      // If not, set up an event listener for when it loads
      window.addEventListener('pyodide-loaded', loadPyodideRuntime);
      return () => window.removeEventListener('pyodide-loaded', loadPyodideRuntime);
    }
  }, []);

  async function loadPyodideRuntime() {
    try {
      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
      });
      setPyodide(pyodide);
      setIsPyodideLoaded(true);
      setOutput('Python runtime loaded! Ready to execute code.\n');
    } catch (err) {
      setOutput(`Failed to load Python: ${err.message}`);
    }
  }

  const runCode = async () => {
  if (!isPyodideLoaded) {
    setOutput('Python runtime still loading... please wait\n');
    return;
  }

  try {
    setOutput(''); // Clear previous output
    let outputBuffer = [];
    
    pyodide.setStdout({ batched: (text) => {
      // Ensure each print statement ends with newline
      outputBuffer.push(text + (text.endsWith('\n') ? '' : '\n'));
      setOutput(outputBuffer.join(''));
    }});
    
    // Handle input
    const originalPrompt = window.prompt;
    window.prompt = (msg) => {
      const userInput = originalPrompt(msg);
      return userInput;
    };

    await pyodide.runPythonAsync(code);
    window.prompt = originalPrompt;
    
  } catch (err) {
    setOutput(prev => prev + `\nError: ${err.message}\n`);
  }
};

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Python Playground</h1>
        <div className="controls">
          <button onClick={runCode} disabled={!isPyodideLoaded}>
            {isPyodideLoaded ? 'Run Code' : 'Loading Python...'}
          </button>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </header>
      <div className="container">
        <Editor code={code} onChange={setCode} theme={theme} />
        <Terminal output={output} theme={theme} />
      </div>
    </div>
  );
}

export default App;