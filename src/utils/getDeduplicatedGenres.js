
export function getDeduplicatedGenres(games) {
    let genres = []
    for (let index = 0; index < games.length; index++) {
        genres.push(games[index].genre)
    }
    
    const set = new Set(genres)
    const deduplicatedGenres = Array.from(set)
    
    return deduplicatedGenres
}
