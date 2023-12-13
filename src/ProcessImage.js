import { useState, useRef, useEffect } from 'react';
import { PrimaryButton, Stack, Text } from '@fluentui/react';
import drawRectangle from './drawRectangle';
import { useStateContext } from './StateContext'; // StateContextのインポート

function ProcessImage() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [square, setSquare] = useState({ x: 50, y: 50, size: 100, dragging: false });

  const { activeState, setActiveState } = useStateContext();


  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        setActiveState(2);
        drawSquare(); // 画像がロードされた後に正方形を描画
      };

      img.src = image;
    }
  }, [image]);

  const drawSquare = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 10; // ここで線の太さを設定
    ctx.strokeStyle = 'blue';
    // 既存の描画をクリアする
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 画像を再描画
    if (image) {
      const img = new Image();
      img.src = image;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    // 正方形を描画
    ctx.strokeRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
    // ctx.strokeRect(square.x, square.y, square.size, square.size);
    // ハンドルの描画
    const handles = handlePositions();
    handles.forEach(handle => {
      ctx.fillStyle = 'red';
      ctx.fillRect(handle.x, handle.y, 10, 10);
    });
  };

  // 新しいステートを追加：ハンドルのドラッグ状態を管理
  const [draggingHandle, setDraggingHandle] = useState(null);

  // ハンドルのサイズと位置を計算する関数
  const handlePositions = () => {
    const { x, y, size } = square;
    return [
      { x: x - 5, y: y - 5 }, // 左上
      { x: x + size - 5, y: y - 5 }, // 右上
      { x: x + size - 5, y: y + size - 5 }, // 右下
      { x: x - 5, y: y + size - 5 } // 左下
    ];
  };

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

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // 矩形内をクリックしたか判定
    if (x > square.x && x < square.x + square.size &&
      y > square.y && y < square.y + square.size) {
      setSquare({ ...square, dragging: true });
    }

    // ハンドルのドラッグ開始を検出
    const handles = handlePositions();
    handles.forEach((handle, index) => {
      if (e.clientX >= handle.x && e.clientX <= handle.x + 10 &&
        e.clientY >= handle.y && e.clientY <= handle.y + 10) {
        setDraggingHandle(index);
      }
    });
  };

  const handleMouseMove = (e) => {
    if (square.dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSquare({ ...square, x: x - square.size / 2, y: y - square.size / 2 });
      drawSquare(); // マウス移動時に正方形を再描画
    }

    // ハンドルがドラッグされている場合の処理
    if (draggingHandle !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // ハンドルの位置に応じて正方形のサイズを更新
      if (draggingHandle === 0) { // 左上のハンドル
        setSquare({ ...square, x, y, size: square.size + square.x - x });
      } else if (draggingHandle === 1) { // 右上のハンドル
        setSquare({ ...square, y, size: x - square.x });
      } else if (draggingHandle === 2) { // 右下のハンドル
        setSquare({ ...square, size: x - square.x });
      } else if (draggingHandle === 3) { // 左下のハンドル
        setSquare({ ...square, x, size: square.size + square.y - y });
      }
      drawSquare();
    }
  };

  const handleMouseUp = () => {
    setSquare({ ...square, dragging: false });
    setDraggingHandle(null);
  };




  return (
    <div>
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
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          style={{ maxWidth: '100%' }} />
      </Stack>
    </div>
  );
}

export default ProcessImage;
