import { useEffect, useState } from "react"
import "./App.css"
import { api } from "./utils/api"
import ErrorModal from "./components/ErrorModal/ErrorModal"
import { BsSearch } from "react-icons/bs"
import GenrePopup from "./components/GenrePopup/GenrePopup"
import { getDeduplicatedGenres } from "./utils/getDeduplicatedGenres"

function App() {
    const [games, setGames] = useState([])
    const [auxGames, setAuxGames] = useState([])

    const [openModal, setOpenModal] = useState(false)
    const [errorModalMessage, setErrorModalMessage] = useState("")
    const [search, setSearch] = useState("")
    const [openGenrePopup, setOpenGenrePopup] = useState(false)
    const [genres, setGenres] = useState([])

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await api.get("/data", {
                    headers: {
                        "dev-email-address": "joaoantoniogba025@gmail.com",
                    },
                })

                setGames(response.data)
                setAuxGames(response.data)

                const genres = getDeduplicatedGenres(response.data)
                console.log(genres)
                setGenres(genres)
            } catch (err) {
                const status = err.response.status
                if (
                    status === 500 ||
                    status === 502 ||
                    status === 503 ||
                    status === 504 ||
                    status === 507 ||
                    status === 508 ||
                    status === 509
                ) {
                    setErrorModalMessage(
                        "O servidor falhou em responder, tente recarregar a página"
                    )
                    setOpenModal(true)
                } else if (status !== 200 || status !== 201) {
                    setErrorModalMessage(
                        "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde"
                    )
                    setOpenModal(true)
                }
                console.log(err)
            }
        }

        fetchGames()
    }, [])

    function handleChange(event) {
        setSearch(event.target.value)
    }

    function selGenre(gen) {}

    function execSearch() {
        const filteredGames = games.filter((game) =>
            game.title.toLowerCase().includes(search.toLowerCase())
        )

        if (search.length === 0) setAuxGames(games)
        else setAuxGames(filteredGames)
    }

    return (
        <>
            <div className="App">
                <div>
                    <span>
                        <input
                            type="text"
                            placeholder="Busque aqui um jogo pelo título"
                            onChange={handleChange}
                            size="35"
                        />
                        <button onClick={execSearch}>
                            <BsSearch size={25} />
                        </button>
                    </span>
                    <span>
                        <button
                            id="genreFilter"
                            onClick={() => setOpenGenrePopup(true)}
                        >
                            Filtrar por gênero
                        </button>
                        {openGenrePopup && (
                            <GenrePopup
                                genreList={genres}
                                selectGenre={selGenre}
                                close={() => setOpenGenrePopup(false)}
                            />
                        )}
                    </span>
                </div>
                <br />
                <br />
                <ul>
                    {auxGames.map((game) => {
                        return (
                            <li key={game.id}>
                                <img src={game.thumbnail} />
                                <h3>{game.title}</h3>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {openModal && <ErrorModal message={errorModalMessage} />}
        </>
    )
}

export default App
