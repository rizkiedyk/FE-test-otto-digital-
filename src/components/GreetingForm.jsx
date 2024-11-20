import React, { useState, useRef, useEffect } from "react";

const GreetingForm = () => {
  const [dear, setDear] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ dear, message, from, image });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setImgLoaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const wrapText = (ctx, text, x, y, maxCharsPerLine, lineHeight) => {
    let lines = [];
    let currentLine = "";

    for (let i = 0; i < text.length; i++) {
      currentLine += text[i];

      if (currentLine.length >= maxCharsPerLine) {
        lines.push(currentLine);
        currentLine = "";
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
  };

  const drawTextOnImage = () => {
    if (!imgLoaded || !canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.font = "25px Arial";
      ctx.fillStyle = "#958166";
      ctx.textAlign = "left";

      const maxCharsPerLine = 20;
      const lineHeight = 40;
      let yOffset = canvas.height / 3;

      wrapText(
        ctx,
        dear,
        canvas.width / 2.2,
        yOffset,
        maxCharsPerLine,
        lineHeight
      );
      yOffset += lineHeight;

      wrapText(
        ctx,
        message,
        canvas.width / 3.3,
        yOffset,
        maxCharsPerLine,
        lineHeight
      );
      yOffset += lineHeight;

      wrapText(
        ctx,
        from,
        canvas.width / 2.35,
        (yOffset = canvas.height / 1.7),
        maxCharsPerLine,
        lineHeight
      );
    };
  };

  useEffect(() => {
    drawTextOnImage();
  }, [dear, message, from, imgLoaded, image]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imageUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "gift-card.png";
    link.click();
  };

  return (
    <div
      className="container-fluid overflow-auto p-5"
      style={{
        backgroundColor: "#f0f0fa",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="card shadow-sm p-4"
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h3 className="text-left mb-4">Gift Card</h3>

        {image && (
          <div className="text-center mt-4">
            <canvas
              ref={canvasRef}
              width="500"
              height="500"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="image" className="form-label">
              File Upload
            </label>
            <input
              type="file"
              id="image"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dear" className="form-label">
              Dear
            </label>
            <input
              type="text"
              id="dear"
              className="form-control"
              value={dear}
              onChange={(e) => setDear(e.target.value)}
              placeholder="Enter recipient's name"
              maxLength={14}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows="4"
              maxLength={40}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="from" className="form-label">
              From
            </label>
            <input
              type="text"
              id="from"
              className="form-control"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Enter your name"
              maxLength={10}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GreetingForm;
