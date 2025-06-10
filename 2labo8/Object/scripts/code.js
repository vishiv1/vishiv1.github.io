const setup = () => {

    // Create an object
    let student = {}; // een leeg object
    student.firstName = "John";
    student.lastName = "Doe";
    student.age = new Date (2000,1,1);
    student.eyeColor = "blue";

    console.log (student.firstName);

    let student1 = {
        firstName: "John",
        lastName: "Doe",
        age: new Date (2000,1,1),
        eyeColor: "blue"
    };

    console.log (student1.firstName);
    console.log (student1.age);

    let student2 = {
        firstName: "John",
        lastName: "Doe",
        address : {
            zipCode : 8500,
            city : "Kortrijk"
        }
    };

    console.log (student2.address.zipCode);


    let tekst = JSON.stringify(student);
    console.log (tekst);


    let students = [
        {
            firstName: "John",
            lastName: "Doe",
            address: {
                zipCode: 8500,
                city: "Kortrijk"
            }
        },
        {
            firstName: "VIVES",
            lastName: "Doe",
            address: {
                zipCode: 8500,
                city: "Kortrijk"
            }
        }
    ];

    tekst = JSON.stringify(students);

    console.log (tekst);


    tekstJS = JSON.parse(tekst);
    console.log ("JsonParse " + tekstJS[0].firstName);


    tekst =JSON.stringify(students[1]);
    console.log (tekst);

}


window.addEventListener("load", setup);