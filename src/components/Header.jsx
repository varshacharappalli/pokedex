export function Header(props){
    const {handletoggle}=props;
    return(
        <header>
            <button className="open-nav-button" onClick={handletoggle}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="text-gradient">Pokedex</h1>
        </header>
    )
}