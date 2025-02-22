import { useEffect, useState } from 'react';

export default function EmojiRain({ emoji, side }) {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const createEmoji = () => {
      const newEmoji = {
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 1}s`,
        opacity: Math.random(),
        transform: `rotate(${Math.random() * 360}deg)`,
        emoji: emoji
      };
      setEmojis(prev => [...prev, newEmoji]);
    };

    const interval = setInterval(createEmoji, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTimeout(() => setEmojis([]), 3000);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [emoji]);

  return (
    <div className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-1/2 h-screen pointer-events-none z-50`}>
      {emojis.map(emojiObj => (
        <div
          key={emojiObj.id}
          className="absolute animate-fall"
          style={{
            left: emojiObj.left,
            animationDuration: emojiObj.animationDuration,
            opacity: emojiObj.opacity,
            transform: emojiObj.transform
          }}
        >
          <span className="text-4xl">{emojiObj.emoji}</span>
        </div>
      ))}
    </div>
  );
}
