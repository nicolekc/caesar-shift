import "./styles.css";
import { useEffect, useState, useRef } from "react";

const code = "That's how you do it on Survivor!";

function shiftLetter(letter: string, shift: number = 0) {
  if (letter.match(/([^A-Za-z])/)) {
    return letter;
  }

  if (shift < 0) {
    shift = (shift % 26) + 26;
  }

  const CODE_A = 65;
  return String.fromCharCode(
    ((letter.toUpperCase().charCodeAt(0) - CODE_A + shift) % 26) + CODE_A
  );
}

function shiftSentence(sentence: string, shift = 0, isReversed = false) {
  return sentence
    .split("")
    .map((char, idx, arr) => (isReversed ? arr[arr.length - idx - 1] : char))
    .map((letter) => shiftLetter(letter, shift))
    .join("");
}

function Letter({ letter }: { letter: string }) {
  return (
    <div className="font-mono px-1 bg-white dark:bg-gray-900 inline-block h-min">
      {letter.toUpperCase()}
    </div>
  );
}

function LetterRow({ str, className }: { str: string; className?: string }) {
  return (
    <div
      className={`mb-2 flex flex-row w-fit bg-gray-200 dark:bg-gray-600 gap-0.5 p-0.5 h-min ${className}`}
    >
      {str
        .replace(/\s/g, "_")
        .split("")
        .map((char, idx) => {
          return <Letter key={idx} letter={char} />;
        })}
    </div>
  );
}

function Button({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick: React.MouseEventHandler;
  className?: string;
}) {
  return (
    <button
      className={`h-min bg-blue-500 dark:bg-blue-600 rounded text-white px-2 py-1 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function Interactive({
  sentence,
  keysDisabled = false,
  isReversed = false,
}: {
  sentence: string;
  keysDisabled?: boolean;
  isReversed?: boolean;
}) {
  const [shift, setShift] = useState(0);

  function left() {
    setShift((shift) => shift - 1);
    shiftRef.current = shift - 1;
  }

  function right() {
    setShift((shift) => shift + 1);
    shiftRef.current = shift + 1;
  }

  const shiftRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keysDisabled) return;

      if (event.key === "ArrowLeft") {
        left();
      } else if (event.key === "ArrowRight") {
        right();
      }
    };

    // Attach the event listener to the window
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keysDisabled]);

  let shifted = shiftLetter("A", shift);

  return (
    <>
      <div className="flex flex-row">
        <LetterRow str="a" />
        <div className="px-2 py-1">=</div>
        <LetterRow
          className={shifted !== "A" ? "[&&]:bg-blue-500 [&&]:dark:bg-blue-600" : ""}
          str={shifted}
        />
        <div className="ml-4 mb-4">
          <Button text="-" onClick={left} />
          &nbsp;
          <Button text="+" onClick={right} />
          &nbsp;
        </div>
      </div>
      <LetterRow str={sentence} />
      {(shift !== 0 || isReversed) && (
        <LetterRow
          className="[&&]:bg-blue-200 [&&]:dark:bg-blue-800"
          str={shiftSentence(sentence, shift, isReversed)}
        />
      )}
    </>
  );
}

function SeeAll({
  sentence,
  isReversed,
}: {
  sentence: string;
  isReversed?: boolean;
}) {
  return (
    <>
      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((shifted, idx) => {
        return (
          <div className="flex flex-row">
            <>
              <LetterRow str={shifted} />
              <div className="px-2 py-1">=</div>
              <LetterRow str={shiftSentence(sentence, idx, isReversed)} />
            </>
          </div>
        );
      })}
    </>
  );
}

export default function App() {
  const [isReversed, setReversed] = useState(false);
  const [isInteractive, setInteractive] = useState(true);
  const [isTyping, setTyping] = useState(false);
  const [sentence, setSentence] = useState(code);
  return (
    <html>
      <body className="m-4">
        <div className="flex flex-row">
          <input
            value={sentence}
            onFocus={() => setTyping(true)}
            onBlur={() => setTyping(false)}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Type a sentence..."
            className="mb-4
              flex-1
              p-2
              border 
              border-gray-300 
              dark:border-gray-600
              rounded-lg
              focus:border-blue-500
              font-mono"
          />
          &nbsp;
          {!isReversed ? (
            <Button text="Reverse" onClick={() => setReversed(true)} />
          ) : (
            <Button
              text="Turn off reverse"
              onClick={() => setReversed(false)}
              className="[&&]:bg-red-500"
            />
          )}
        </div>
        {isInteractive ? (
          <>
            <Interactive
              sentence={sentence}
              keysDisabled={!!isTyping}
              isReversed={isReversed}
            />
            <Button text="See all" onClick={() => setInteractive(false)} />
          </>
        ) : (
          <>
            <div className="mb-2">
              <Button text="Back" onClick={() => setInteractive(true)} />
            </div>
            <SeeAll sentence={sentence} isReversed={isReversed} />
          </>
        )}
      </body>
    </html>
  );
}
