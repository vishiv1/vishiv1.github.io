// Plaats alle benodigde Javascript code in dit bestand.
// Zorg ervoor dat je alle functionaliteit die in de opgave gevraagd wordt voorziet.
const setup = () => {
    loadMovies();

}
const loadMovies = () => {
    const movieList = document.getElementById('movielist');

    movies.forEach((movie, index) => {
        let movieDiv = createElementWithClassName('div', "movie");

        const title = createElementWithClassNameAndText("p", "title", movie.title);

        movieDiv.appendChild(title);
        movieList.appendChild(movieDiv);

    })


}


const createElementWithClassName = (element, className) => {
    let e = document.createElement(element);
    e.setAttribute("class", className);
    return e;
}

const createElementWithClassNameAndText = (element, className, tekst) => {
    let e = createElementWithClassName (element, className);
    let text = document.createTextNode(tekst);
    e.appendChild(text);
    return e;
}

const createElementWithClassNameAndImage = (element, className, Image) => {
    let e = createElementWithClassName (element, className);
    let text = document.createTextNode(tekst);
    let image = document.createElement("img");

    e.appendChild(text);
    return e;
}

window.addEventListener("load", setup);
