import React from 'react';
import { DefaultButton, Stack, Text } from '@fluentui/react';
import { useStateContext } from './StateContext'; // StateContextのインポート

const ShowState = () => {
  const { activeState, setActiveState } = useStateContext(); // Contextから状態を取得

  const buttonSize = activeState => activeState ? 60 : 40; // アクティブな状態では大きく、それ以外では小さくする

  const buttonStyle = (stateNumber) => ({
    borderRadius: '50%', // 常に円形を保持
    width: `${buttonSize(activeState === stateNumber)}px`,
    height: `${buttonSize(activeState === stateNumber)}px`,
    lineHeight: `${buttonSize(activeState === stateNumber)}px`, // 高さに合わせて行の高さを調整
    margin: '10px',
    transition: 'all 0.1s ease'
  });

  const descriptionStyle = {
    marginTop: '5px',
    fontSize: '12px'
  };

  const messages = ["Upload Image", "Choose Rectangle Area", "Find the difference"];

  return (
    <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 20 }}>
      {[1, 2, 3].map((stateNumber) => (
        <Stack key={stateNumber} horizontalAlign="center">
          <DefaultButton
            style={buttonStyle(stateNumber)}
            disabled={true}
          >
            {stateNumber}
          </DefaultButton>
          <Text style={descriptionStyle}>
            {`${messages[stateNumber-1]}`}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};

export default ShowState;
