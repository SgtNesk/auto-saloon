"use client";
import { useState } from "react";

interface Props {
  images: string[];
  emoji: string;
}

export default function ImageCarousel({ images, emoji }: Props) {
  const [idx, setIdx] = useState(0);

  if (!images.length) {
    return (
      <div className="detail-img" style={{ background: "linear-gradient(135deg, #1a2030, #111)" }}>
        <span style={{ fontSize: 140 }}>{emoji}</span>
      </div>
    );
  }

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div className="carousel">
      <div className="carousel-viewport">
        <img src={images[idx]} alt={`Foto ${idx + 1}`} className="carousel-img" />
        {images.length > 1 && (
          <>
            <button className="carousel-btn carousel-prev" onClick={prev} aria-label="Precedente">‹</button>
            <button className="carousel-btn carousel-next" onClick={next} aria-label="Successiva">›</button>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === idx ? "active" : ""}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="carousel-thumbs">
          {images.map((url, i) => (
            <button
              key={i}
              className={`carousel-thumb ${i === idx ? "active" : ""}`}
              onClick={() => setIdx(i)}
            >
              <img src={url} alt={`Miniatura ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
