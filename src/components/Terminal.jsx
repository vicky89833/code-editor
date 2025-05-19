import { useRef, useEffect } from 'react';

const Terminal = ({ output, theme }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Split output by lines and render each line separately
  const outputLines = output.split('\n').map((line, i) => (
    <div key={i}>{line || ' '}</div>  // Empty line becomes space to maintain height
  ));

  return (
    <div className={`terminal ${theme}`} ref={terminalRef}>
      {outputLines}
    </div>
  );
};

export default Terminal;
