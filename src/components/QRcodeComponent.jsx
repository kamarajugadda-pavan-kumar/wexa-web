import React, { useEffect } from "react";
import QRCode from "qrcode";

const QRcodeComponent = ({ url }) => {
  useEffect(() => {
    const canvas = document.getElementById("canvas");

    // Generate the QR code and render it on the canvas
    if (canvas && url) {
      console.log(url);
      QRCode.toCanvas(canvas, url, { width: 250, height: 250 }, (error) => {
        if (error) console.error("Error generating QR code:", error);
      });
    }

    // Clear the canvas when the component unmounts
    return () => {
      if (canvas) {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [url]); // Re-render QR code if URL changes

  return <canvas id="canvas"></canvas>;
};

export default QRcodeComponent;
