// This ensures Pyodide is fully loaded before React starts
window.addEventListener('load', async () => {
  if (window.loadPyodide) {
    window.dispatchEvent(new Event('pyodide-loaded'));
  }
});