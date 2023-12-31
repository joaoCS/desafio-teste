import { useEffect, useState } from "react"
import "./App.css"
import { api } from "./utils/api"
import ErrorModal from "./components/ErrorModal/ErrorModal"
import { BsSearch } from "react-icons/bs"
import GenrePopup from "./components/GenrePopup/GenrePopup"
import { getDeduplicatedGenres } from "./utils/getDeduplicatedGenres"
import { Bars } from "react-loader-spinner"

function App() {
    const [games, setGames] = useState([])
    const [auxGames, setAuxGames] = useState([])

    const [openModal, setOpenModal] = useState(false)
    const [errorModalMessage, setErrorModalMessage] = useState("")
    const [search, setSearch] = useState("")
    const [openGenrePopup, setOpenGenrePopup] = useState(false)
    const [genres, setGenres] = useState([])
    const [showLoader, setShowLoader] = useState(false)

    useEffect(() => {
        async function fetchGames() {
            try {
                setShowLoader(true)

                const response = await Promise.race([
                    api.get("/data", {
                        headers: {
                            "dev-email-address": "joaoantoniogba025@gmail.com",
                        },
                    }),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("timeout")), 5000)
                    ),
                ])

                console.log(response)
                // const response = await api.get("/data", {
                //     headers: {
                //         "dev-email-address": "joaoantoniogba025@gmail.com",
                //     },
                // })

                setGames(response.data)
                setAuxGames(response.data)

                const genres = getDeduplicatedGenres(response.data)
                setGenres(genres)
                setShowLoader(false)
            } catch (err) {
                const status = err?.response?.status
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
                    setAuxGames([])
                    setGames([])
                    setShowLoader(false)
                    return
                } else if (status !== 200 && status !== 201 && status !== undefined) {
                    setErrorModalMessage(
                        "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde"
                    )
                    setOpenModal(true)
                    setAuxGames([])
                    setGames([])
                    setShowLoader(false)
                    return 
                }
                else if (err.message === "timeout") {
                    setErrorModalMessage(
                        "O servidor demorou para responder, tente mais tarde"
                    )
                    setOpenModal(true)
                    setAuxGames([])
                    setGames([])
                    setShowLoader(false)
                    return
                }

                console.log(typeof err.message)
            }
        }

        fetchGames()
    }, [])

    function handleChange(event) {
        setSearch(event.target.value)
    }

    function selGenre(gen) {
        const filteredGames = games.filter((game) =>
            game.genre.toLowerCase().includes(gen.toLowerCase())
        )

        if (gen === "Todos os gêneros") setAuxGames(games)
        else setAuxGames(filteredGames)
    }

    function execSearch() {
        const filteredGames = games.filter((game) =>
            game.title.toLowerCase().includes(search.toLowerCase())
        )

        if (search.length === 0) setAuxGames(games)
        else setAuxGames(filteredGames)
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            execSearch()
        }
    }
    return (
        <>
            <div className="App">
                <div id="header">
                    {!showLoader && (
                        <span>
                            <input
                                type="text"
                                placeholder="Busque aqui um jogo pelo título"
                                onChange={handleChange}
                                size="55"
                                onKeyDown={handleKeyDown}
                            />
                            <button onClick={execSearch}>
                                <BsSearch size={30} />
                            </button>
                        </span>
                    )}
                    <span id="gPp">
                        {!showLoader && (
                            <button
                                id="genreFilter"
                                onClick={() => setOpenGenrePopup(true)}
                            >
                                Filtrar por gênero
                            </button>
                        )}
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
                                <div>
                                    <h3>{game.title}</h3>
                                    <h5>Gênero: {game.genre}</h5>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {openModal && <ErrorModal message={errorModalMessage} />}
            {showLoader && (
                <div id="loader">
                    <Bars
                        width={150}
                        height={150}
                        color="white"
                        ariaLabel="Carregando..."
                    />
                </div>
            )}
        </>
    )
}

export default App
