import { useState } from "react"
import { Header } from "./components/Header"
import { PokeCard } from "./components/PokeCard"
import { SideNav } from "./components/SideNav"


function App() {

  const [selectedPokemon,setselectedPokemon]=useState(0);
  const [sideMenu,setSideMenu]=useState(true);

  function handletoggle(){
    setSideMenu(!sideMenu);
  }

  function handleCloseMenu(){
    setSideMenu(true);
  }

  return (
    <>
      <Header handletoggle={handletoggle}/>
      <SideNav selectedPokemon={selectedPokemon} setselectedPokemon={setselectedPokemon} handleCloseMenu={handleCloseMenu} sideMenu={sideMenu}/>
      <PokeCard selectedPokemon={selectedPokemon}/>
    </>
  )
}

export default App
