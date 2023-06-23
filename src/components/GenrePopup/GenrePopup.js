import React from 'react'
import "./genrePopup.css"

export default function GenrePopup({ selectGenre, genreList, close }) {
  return (
    <ul id="genresPopup" onMouseLeave={close}>
        {genreList.map((genre, idx) => {
          return <li key={idx} onClick={()=>selectGenre(genre)}>{genre}</li>
        })}
    </ul>
  )
}
