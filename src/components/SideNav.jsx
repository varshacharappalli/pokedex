import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber, getPokedexNumber } from "../utils"

export function SideNav(props){
    const{selectedPokemon,setselectedPokemon,handleCloseMenu,sideMenu}=props;
    const[searchState,setSearchState]=useState('');
    const filteredPokemon=first151Pokemon.filter((ele,eleIndex)=>{
        if(getFullPokedexNumber(eleIndex).includes(searchState)){return true};
        if(ele.toLowerCase().includes(searchState.toLowerCase())){return true};
        return false;
    })
    return(
        <nav className={" "+((!sideMenu)?"open":" ")}>
            <button onClick={handleCloseMenu} className={" "+((!sideMenu)?"open":" ")}>
                <i class="fa-solid fa-arrow-left-long"></i>
            </button>
            <header className="header">
                <h1 className="text-gradient">Pokedex</h1>
            </header>
            <input value={searchState} onChange={(e)=>{
                setSearchState(e.target.value)
            }}/>
            {
                filteredPokemon.map((pokemon) => {
                    const originalIndex = first151Pokemon.indexOf(pokemon); 

                    return (
                        <button 
                            className={"nav-card " + (originalIndex === selectedPokemon ? 'nav-card-selected' : '')} 
                            key={originalIndex} 
                            onClick={() => {setselectedPokemon(originalIndex)
                                handleCloseMenu()}
                            }
                        >
                            <p>{getFullPokedexNumber(originalIndex)}</p>
                            <p>{pokemon}</p>
                        </button>
                    );
                })
            }
        </nav>
    )
}