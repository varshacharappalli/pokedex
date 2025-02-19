import { useEffect,useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import { TypeCard } from "./TypeCard";
import { Modal } from "./Modal";

export function PokeCard(props){
    const{selectedPokemon}=props;
    const[loading,setLoading]=useState(false);
    const[data,setData]=useState(null);
    const[skill,setSkill]=useState(null);
    const[loadingSkill,setLoadingSkill]=useState(false);

    const { name, height, abilities, stats, types, moves, sprites } = data || {};

    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) { return false }
        if (['versions', 'other'].includes(val)) { return false }
        return true
    })

    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return }

        // check cache for move
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            console.log('Found move in cache')
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData)
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)
        }
    }

    useEffect(()=>{
        if(loading||!localStorage){
            return
        }
        let cache={};
        if(localStorage.getItem('pokedex')){
            cache=JSON.parse(localStorage.getItem('pokedex'));
        }

        if(selectedPokemon in cache){
            setData(cache[selectedPokemon]);
            return
        }

        async function fetchdataapi(selectedPokemon){
            setLoading(true);
            try{
                const starturl='https://pokeapi.co/api/v2/';
                const url='pokemon/'+getPokedexNumber(selectedPokemon);
                const finalurl=starturl+url;
                const res=await fetch(finalurl);
                if (!res.ok) {
                    console.error("Error fetching data:", res.status, res.statusText);
                    return;
                }
                const data=await res.json();
                console.log(data);
                setData(data);
                cache[selectedPokemon]=data;
                localStorage.setItem('pokedex',JSON.stringify(cache));
            }
            catch(err){
                console.log(err.message);
            }
            finally{
                setLoading(false);
            }
            
        }

        fetchdataapi(selectedPokemon)

    },[selectedPokemon])
    return(
        <div className="poke-card">
            
            {(skill && <Modal handleCloseModal={()=>{setSkill(null)}}>
                <div>
                    <h6>Name</h6>
                    <h2>{skill.name.replaceAll('-',' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}
            <div>
                <h4>{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {
                    types?.map((typeObj,typeIndex)=>{
                        return(
                            <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                        )
                    })
                }
            </div>
            <img className='default-img' src={'/pokemon/'+getFullPokedexNumber(selectedPokemon)+'.png'} alt="{name}-large-img"/>
            <div className="img-container">
                {
                    imgList.map((spriteUrl,spriteIndex)=>{
                        const imgUrl=sprites[spriteUrl];
                        return(
                            <img key={spriteIndex} src={imgUrl} alt={{name}+'sprite-img'}/>
                        )
                    })
                }
            </div>
            <div className="stats-card">
                {
                    stats?.map((statsObj,statsIndex)=>{
                        const {stat,base_stat}=statsObj;
                        return (
                            <div className="stat-item" key={statsIndex}>
                                <p>{stat?.name.replace('-',' ')}</p>
                                <h4>{base_stat}</h4>
                            </div>
                        )

                    })
                }
            </div>

            <div className="pokemon-move-grid">
                {
                    moves?.map((moveObj,movIndex)=>{
                        return(
                        <button className="button-card pokemon-move" key={movIndex} onClick={()=>{
                            fetchMoveData(moveObj.move.name, moveObj.move.url)
                        }}>{moveObj?.move?.name.replace('-',' ')}</button>
                        )
                    })
                }
            </div>

        </div>
    )
}