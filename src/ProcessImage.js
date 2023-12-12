import { useState, useRef, useEffect } from 'react';
import { Paper, Button } from '@mui/material';

function ProcessImage() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };

      img.src = image;
    }
  }, [image]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files) => {
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setImage(URL.createObjectURL(files[0]));
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      <Paper
        variant="outlined"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ width: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        onClick={handleClick}
      >
        ドラッグアンドドロップ、またはタップして画像をアップロード
      </Paper>
      <canvas ref={canvasRef} style={{ marginTop: 20, maxWidth: '100%' }} />
    </div>
  );
}

export default ProcessImage;
