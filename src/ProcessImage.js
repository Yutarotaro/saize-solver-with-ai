import { useState, useRef, useEffect } from 'react';
import { PrimaryButton, Stack, Text, canUseDOM } from '@fluentui/react';
import { useStateContext } from './StateContext'; // StateContextのインポート
import { Button, FluentProvider, MenuList, webLightTheme } from '@fluentui/react-components';

function ProcessImage() {
  const width = 1000;
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { cv } = window;

  const { activeState, setActiveState } = useStateContext();

  const [redCirclePos, setRedCirclePos] = useState({ x: width / 10, y: width / 10 });
  const [isRedDragging, setIsRedDragging] = useState(false);

  const [blueCirclePos, setBlueCirclePos] = useState({ x: 9 * width / 10, y: width / 10 });
  const [isBlueDragging, setIsBlueDragging] = useState(false);

  const [greenCirclePos, setGreenCirclePos] = useState({ x: 9 * width / 10, y: width / 2 });
  const [isGreenDragging, setIsGreenDragging] = useState(false);

  const [yellowCirclePos, setYellowCirclePos] = useState({ x: width / 10, y: width / 2 });
  const [isYellowDragging, setIsYellowDragging] = useState(false);

  const [isInferenceReady, setIsInferenceReady] = useState(false);

  const [srcMat, setSrcMat] = useState(null);


  // 画像の読み込みと表示
  useEffect(() => {
    if (image) {
      const img = new Image();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const canvasHeight = canvas.width * aspectRatio;
        canvas.height = canvasHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if(srcMat == null){
          console.log("cv.onRuntimeInitialized",cv.onRuntimeInitialized);
          const srcMat = cv.matFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
          setSrcMat(srcMat);
          console.log(srcMat);
        }
        setActiveState(2);

        // 直線の開始点
        ctx.beginPath();
        ctx.moveTo(redCirclePos.x, redCirclePos.y); // x = 50, y = 50 の位置に移動
        // 直線の終了点
        ctx.lineTo(blueCirclePos.x, blueCirclePos.y); // x = 200, y = 200 まで線を描画

        ctx.moveTo(blueCirclePos.x, blueCirclePos.y); // x = 50, y = 50 の位置に移動
        // 直線の終了点
        ctx.lineTo(greenCirclePos.x, greenCirclePos.y); // x = 200, y = 200 まで線を描画

        ctx.moveTo(greenCirclePos.x, greenCirclePos.y); // x = 50, y = 50 の位置に移動
        // 直線の終了点
        ctx.lineTo(yellowCirclePos.x, yellowCirclePos.y); // x = 200, y = 200 まで線を描画

        ctx.moveTo(yellowCirclePos.x, yellowCirclePos.y); // x = 50, y = 50 の位置に移動
        // 直線の終了点
        ctx.lineTo(redCirclePos.x, redCirclePos.y); // x = 200, y = 200 まで線を描画


        //中心線
        ctx.moveTo((redCirclePos.x + blueCirclePos.x) / 2, (redCirclePos.y + blueCirclePos.y) / 2); // x = 50, y = 50 の位置に移動
        // 直線の終了点
        ctx.lineTo((yellowCirclePos.x + greenCirclePos.x) / 2, (yellowCirclePos.y + greenCirclePos.y) / 2); // x = 200, y = 200 まで線を描画

        // 線のスタイル設定
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000'; // 黒色で描画
        ctx.stroke(); // 線を描画

        drawCircle(ctx, redCirclePos.x, redCirclePos.y, 'red'); // ここで円を描画
        drawCircle(ctx, blueCirclePos.x, blueCirclePos.y, 'blue'); // ここで円を描画
        drawCircle(ctx, greenCirclePos.x, greenCirclePos.y, 'green'); // ここで円を描画
        drawCircle(ctx, yellowCirclePos.x, yellowCirclePos.y, 'yellow'); // ここで円を描画

      };
      img.src = image;
    }
  }, [image, redCirclePos, blueCirclePos, greenCirclePos, yellowCirclePos]);

  const drawCircle = (context, x, y, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, width / 200, 0, 2 * Math.PI);
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
    const redDistance = Math.sqrt(Math.pow(x - redCirclePos.x, 2) + Math.pow(y - redCirclePos.y, 2));
    const blueDistance = Math.sqrt(Math.pow(x - blueCirclePos.x, 2) + Math.pow(y - blueCirclePos.y, 2));
    const greenDistance = Math.sqrt(Math.pow(x - greenCirclePos.x, 2) + Math.pow(y - greenCirclePos.y, 2));
    const yellowDistance = Math.sqrt(Math.pow(x - yellowCirclePos.x, 2) + Math.pow(y - yellowCirclePos.y, 2));

    // 円の半径（ここでは10としている）以内かどうかを判定
    if (redDistance < 10) {
      setIsRedDragging(true);
    } else if (blueDistance < 10) {
      setIsBlueDragging(true);
    } else if (greenDistance < 10) {
      setIsGreenDragging(true);
    } else if (yellowDistance < 10) {
      setIsYellowDragging(true);
    }

  };


  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    if (isRedDragging) {
      setRedCirclePos({ x, y });
    }
    if (isBlueDragging) {
      setBlueCirclePos({ x, y });
    }
    if (isGreenDragging) {
      setGreenCirclePos({ x, y });
    }
    if (isYellowDragging) {
      setYellowCirclePos({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsRedDragging(false);
    setIsBlueDragging(false);
    setIsGreenDragging(false);
    setIsYellowDragging(false);
  };

  const calculateHomography = () => {
    const canvas = canvasRef.current;
    canvas.height = canvas.width / 2;
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [redCirclePos.x, redCirclePos.y, blueCirclePos.x, blueCirclePos.y, greenCirclePos.x, greenCirclePos.y, yellowCirclePos.x, yellowCirclePos.y]); // 変形前の頂点
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, canvas.width, 0, canvas.width, canvas.height, 0, canvas.height]); // 変形後の頂点

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    return M;
  }

  const splitImage = () => {
    setIsInferenceReady(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const homography = calculateHomography();

    // ホモグラフィ変換の適用
    let dst = new cv.Mat();
    cv.warpPerspective(srcMat, dst, homography, new cv.Size(canvas.width, canvas.height));

    cv.imshow(canvas, dst);

    let leftImage = new cv.Mat();
    let leftRect = new cv.Rect(0, 0, canvas.width / 2, canvas.height);
    leftImage = dst.roi(leftRect);
    // cv.imshow(canvas, leftImage);
  }

  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (cv) {
      if (!cv.onRuntimeInitialized) {
        cv.onRuntimeInitialized = () => {
          console.log('OpenCV Ready');
          setIsReady(true);
        };
      } else {
        console.log('OpenCV was already initialized');
        setIsReady(true);
      }
    } else {
      console.log('cv object is not available');
    }
  }, []);

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
        {activeState == 2 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
              onClick={splitImage}
              disabled={isInferenceReady}
              >Inference</Button>
            </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}> */}
          <canvas 
            width={width}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            //  style={{ maxWidth: '100%' }} 
          />
        </div>
      </Stack>
    </div>
  );
}

export default ProcessImage;
