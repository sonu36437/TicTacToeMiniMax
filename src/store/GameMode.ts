import { create } from "zustand"
export type GameMode = "AI" | "OFFLINE" | "ONLINE"|"SELECT"
type GameModeStore={
    mode:GameMode,
    setMode:(mode:GameMode)=>void,
    userCurrentPlayer?:string|null,
    onlinePlayerName?:string|null,
    setCurrentPlayer:(name:string)=>void,
    setOnlinePlayer:(name:string)=>void,
    currentPlayerSymbol:string,
    setCurrentPlayerSymbol:(symbol:string)=>void,
    isConnected?:boolean,
    setIsConnected:()=>void,

}
export const useGameModeStore=create<GameModeStore>((set)=>({
    mode:"SELECT",
    currentPlayerSymbol:"",
    userCurrentPlayer:null,
    onlinePlayerName:null,
    isConnected:false,
    setMode:(mode)=>set({mode}),
    setCurrentPlayer:(name)=>set({userCurrentPlayer:name}),
    setOnlinePlayer(name) {
        set({onlinePlayerName:name})
    },
    setCurrentPlayerSymbol:(symbol)=>set({currentPlayerSymbol:symbol}),

    setIsConnected:()=>set({isConnected:true})


}))
