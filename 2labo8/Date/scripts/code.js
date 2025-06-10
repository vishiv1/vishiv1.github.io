const setup = () => {

    let start = new Date('2025-04-01T12:10:30');
    console.log(start);


    console.log(start.getDay());

    console.log((start.getMonth() + 1));

    console.log(start.getFullYear());

    console.log(start.getDate() + "-"
        + (start.getMonth() + 1) + "-"
        + start.getFullYear() + " " + start.getHours()
        + ":" + start.getMinutes() + ":" + start.getSeconds());

    let datum = new Date(2025, 0, 1)

    console.log(datum)

    let event = new Date()

    console.log("toString" + event.toString());


    console.log("toISOSString " + event.toISOSString());

    console.log("toDateString " + event.toDateString());

    console.log("toTimeString " + event.toTimeString());





}

const calcBD = () => {
  let toDay = new Date();
  let birthday = new Date (2003, 11, 20);
  console.log(birthDay);

  let milliseconds = toDay - birthDay;
  console.log(milliseconds)
    let oneDay = 1000 * 60 * 60 * 24;
  let countDay = milliseconds/(oneDay);

  console.log("aantal dagen: " + parseInt(countDay));

}

window.addEventListener("load", setup);