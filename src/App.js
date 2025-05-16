import { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import './styles.css';

function App() {
  const [code, setCode] = useState(`# Welcome to Python Playground!
# Try writing some code and click Run

name = input("What's your name? ")
print(f"Hello, {name}! Let's learn Python!")

# Calculate factorial
def factorial(n):
  if n == 0:
    return 1
  else:
    return n * factorial(n-1)

print(f"Factorial of 5 is {factorial(5)}")`);

  const [output, setOutput] = useState('');
  const [isPyodideLoaded, setIsPyodideLoaded] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load Pyodide
    async function loadPyodide() {
      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
      });
      await pyodide.loadPackage("micropip");
      setPyodide(pyodide);
      setIsPyodideLoaded(true);
      setOutput('Python runtime loaded! Ready to execute code.\n');
    }
    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!isPyodideLoaded) {
      setOutput('Python runtime still loading... please wait');
      return;
    }

    try {
      setOutput('Running...\n');
      // Capture console.log output
      const stdout = [];
      pyodide.setStdout({ batched: (text) => stdout.push(text) });
      
      // Add input() function support
      let inputQueue = [];
      const originalInput = window.prompt;
      window.prompt = (msg) => {
        const userInput = originalInput(msg);
        inputQueue.push(userInput);
        return userInput;
      };

      await pyodide.runPythonAsync(code);
      
      // Restore original prompt
      window.prompt = originalInput;
      
      setOutput(stdout.join(''));
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const handleTerminalInput = (input) => {
    // This would handle terminal input if we implement interactive mode
    console.log('Terminal input:', input);
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
        <Terminal 
          output={output} 
          onInput={handleTerminalInput} 
          theme={theme} 
        />
      </div>
      <footer>
        <p>For young coders learning Python | Input works via browser prompts</p>
      </footer>
    </div>
  );
}

export default App;
