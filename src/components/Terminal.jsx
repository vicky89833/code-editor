const Terminal = ({ output, onInput, theme }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className={`terminal ${theme}`} ref={terminalRef}>
      <pre>{output}</pre>
      <div className="input-line">
        <span className="prompt">{'> '}</span>
        <input 
          type="text" 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onInput(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default Terminal;
