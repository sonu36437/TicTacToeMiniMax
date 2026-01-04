import React, { useEffect } from 'react'
import Board from './components/board/Board'
import { socket } from './socket'
import ChooseGameMode from './pages/ChooseGameMode';
import { useGameModeStore } from './store/GameMode';
import OnlinePlayerConfigPage from './pages/OnlinePlayerConfigPage';

export default function App() {


  const {mode,isConnected} =useGameModeStore()
 if (mode === "SELECT") {
  return <ChooseGameMode />;
}
else if(mode==='ONLINE' && !isConnected ){
  return <OnlinePlayerConfigPage/>
}

  return (
   <>

    <Board/>
   
   </>
  )
}
