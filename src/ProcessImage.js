import { useState, useRef, useEffect } from 'react';
import { PrimaryButton, Stack, Text } from '@fluentui/react';


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
    <Stack tokens={{ childrenGap: 20 }} padding={20}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        styles={{
          root: {
            width: '100%',
            minHeight: '200px',
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Text>ドラッグアンドドロップ、またはタップして画像をアップロード</Text>
      </Stack>
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
    </Stack>
  ); 
}

export default ProcessImage;
