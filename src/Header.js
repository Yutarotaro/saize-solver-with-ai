import React from 'react';
import { makeStyles, Text } from '@fluentui/react-components';
import { Persona, PersonaProps } from "@fluentui/react-components";

// カスタムスタイルを作成
const useStyles = makeStyles({
  header: {
    backgroundColor: '#4a90e2', // 例として青色を設定
    color: 'white', // テキスト色を白に設定
    // textAlign: 'center',
    height: '50px',
    display: 'flex',
    justifyContent: 'space-between', // 左右にアイテムを分散
    alignItems: 'center', // アイテムを垂直方向に中央揃え
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: '40px',
    textAlign: 'center',
    flexGrow: 1, // テキスト要素が利用可能なスペースを埋める
  },
  personaStyles : {
    // primaryText: { color: 'white' }, // 名前のテキストの色
    // secondaryText: { color: 'white' } // セカンダリテキストの色
  }
});



function Header() {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <Text className={classes.headerText}>Saize Solver</Text>
      <a href="https://github.com/Yutarotaro/" target="_blank" rel="noopener noreferrer">
        <Persona
        name="Yutarotaro"
        secondaryText="Available"
        presence={{ status: "available" }}
        avatar={{
          image: {
            src: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20221209.001/office-ui-fabric-react-assets/persona-male.png",
          },
        }}
        className={classes.personaStyles}
      />
    </a>
    </header>
  );
}


export default Header;
