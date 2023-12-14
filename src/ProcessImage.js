import { useState, useRef, useEffect } from 'react';
import { PrimaryButton, Stack, Text, canUseDOM } from '@fluentui/react';
import { useStateContext } from './StateContext'; // StateContextのインポート

function ProcessImage() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const { activeState, setActiveState } = useStateContext();

  const [circlePos, setCirclePos] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);



  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (image) {
      const img = new Image();
      img.onload = () => {
        // 画像のアスペクト比に基づいてCanvasの高さを計算
        const aspectRatio = img.height / img.width;
        const canvasHeight = canvas.width * aspectRatio;
  
        // Canvasの高さを動的に設定
        canvas.height = canvasHeight;
  
        // 画像をリサイズして描画
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setActiveState(2);
        drawCircle(ctx, circlePos.x, circlePos.y); // ここで円を描画
      };

      img.src = image;
    } else {
      canvas.height = 1000;
      // drawCircle(ctx, circlePos.x, circlePos.y); // ここで円を描画
    }
  }, [image, circlePos]); // circlePosを依存関係に追加

  // 丸の描画
  const drawCircle = (context, x, y) => {
    context.fillStyle = 'blue';
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.fill();
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

  // ファイル入力変更時のハンドラ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
  
    // 実際の表示サイズと属性で設定されたサイズの比率を計算
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
  
    // マウスの座標をCanvasのスケールに合わせて調整
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
  
    // 円の範囲内かどうかをチェック（円の中心からの距離を計算）
    const distance = Math.sqrt(Math.pow(x - circlePos.x, 2) + Math.pow(y - circlePos.y, 2));
  
    // 円の半径（ここでは10としている）以内かどうかを判定
    if (distance < 10) {
      setIsDragging(true);
    }
  };
  

  const handleMouseMove = (e) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
  
      // 実際の表示サイズと属性で設定されたサイズの比率を計算
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
  
      // マウスの座標をCanvasのスケールに合わせて調整
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
  
      setCirclePos({ x, y });
      console.log("Cicle pos is set to (x, y)", x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <Stack tokens={{ childrenGap: 20 }} >
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {activeState == 1 && (
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
        )}
        <canvas
          width={2000} 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ maxWidth: '100%' }} />
      </Stack>
    </div>
  );
}

export default ProcessImage;
