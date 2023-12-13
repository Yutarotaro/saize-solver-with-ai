import React from 'react';
import { makeStyles, Text } from '@fluentui/react-components';

// カスタムスタイルを作成
const useStyles = makeStyles({
  header: {
    backgroundColor: '#4a90e2', // 例として青色を設定
    color: 'white', // テキスト色を白に設定
    textAlign: 'center',
    height: '50px',
  },
  headerText: {
    fontsize: '44px'
  }
});

function Header() {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <Text className={classes.headerText}>Saize Solver</Text>
    </header>
  );
}


export default Header;
