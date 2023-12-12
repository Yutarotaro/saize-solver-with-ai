import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function Inference() {
  useEffect(() => {
    let isCanceled = false;

    const loadModel = async () => {
      const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
      if (!isCanceled) {
        console.log(model);
      }
    };

    loadModel();
    return () => {
      isCanceled = true;
    };
  }, []);

  return (
    <div className="Inference">
    </div>
  );
}

export default Inference;
