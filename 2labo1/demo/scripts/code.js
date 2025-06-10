

const setup = () => {

    let lblCursus = document.getElementById("lblCursus");
    lblCursus.addEventListener("click", change);

    let btnSend = document.getElementById("btnSend");
    btnSend.addEventListener("click", show);
}

const show = () => {
    let txtName = document.getElementById("txtName");

    if (txtName.value !== "") {
        alert("Jouw naam is " + txtName.value);

        console.log("Jouw naam is " + txtName.value);

        console.log(`Jouw naam is ${txtName.value}`);
    }
    else{
        alert("Gelieve naam in te vullen");
    }

}


const change = () => {

    let lblCursus = document.getElementById("lblCursus");
    lblCursus.className = "cursus";
}



window.addEventListener("load", setup);