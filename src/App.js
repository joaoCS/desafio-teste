import { useEffect, useState } from "react"
import "./App.css"
import { api } from "./utils/api"
import ErrorModal from "./components/ErrorModal"

function App() {
    const [games, setGames] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [errorModalMessage, setErrorModalMessage] = useState("")

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await api.get("/data", {
                    headers: {
                        "dev-email-address": "joaoantoniogba025@gmail.com",
                    },
                })

                console.log(response)
                setGames(response.data)
            } catch (err) {
                const status = err.response.status;
                if (status === 500 || 
                    status === 502 ||
                    status === 503 ||
                    status === 504 ||
                    status === 507 ||
                    status === 508 ||
                    status === 509) {
                      setErrorModalMessage("O servidor fahou em responder, tente recarregar a página")
                      setOpenModal(true);
                    }
                else if (status !== 200 || status !== 201) {
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

    return (
        <>
            <div className="App">
                <ul>
                    {games.map((game) => {
                        return (
                            <li key={game.id}>
                                <img src={game.thumbnail} />
                                <h3>{game.title}</h3>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {openModal && <ErrorModal message={errorModalMessage}/>}
        </>
    )
}

export default App
