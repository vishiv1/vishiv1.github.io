const setup = () => {
    console.log("setup");
    let evenement = {
        naam: "Codeer Workshop Javascript",
        datum: new Date(2025, 3, 15), // 15 april 2025
        locatie: "Kortrijk",
        deelnemers: ["John", "Maria", "Ahmed", "Sophie"]
    }

    toonEvenementInfo(evenement);
}
const toonEvenementInfo = (event) =>{
    console.log("Evenement: " + event.naam);
    console.log("Datum: " + event.datum.toDateString());
    console.log("Locatie: " + event.locatie);
    console.log("Deelnemers: " + event.delnemers.join(", "));
    console.log("Aantal dagen tot het evenement: " + dagenTotEvenement(event));
}
const dagenTotEvenement = (event) =>{
    return Math.ceil((event.datum - new Date())/ (1000 * 3600 * 24));

}

window.addEventListener("load", setup);