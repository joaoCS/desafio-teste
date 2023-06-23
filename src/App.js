import { useEffect, useState } from "react"
import "./App.css"
import { api } from "./utils/api"

function App() {
    const [games, setGames] = useState([])

    useEffect(() => {
        async function fetchGames() {
            const response = await api.get("/data", {
                headers: {
                    "dev-email-address": "joaoantoniogba025@gmail.com",
                },
            })

            console.log(response)
            setGames(response.data)
        }

        fetchGames()
    }, [])

    return (<div className="App">
        <ul>
          {games.map(game => {
            return (
              <li key={game.id}>
                <img src={game.thumbnail}/>
                <h3>{game.title}</h3>
              </li>
            )
          })}
        </ul>
      Olá</div>)
}

export default App
