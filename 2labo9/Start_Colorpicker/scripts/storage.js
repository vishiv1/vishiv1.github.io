

const storeSliderValues = () => {
  let red = document.getElementById("sldRed").value;
  let green = document.getElementById("sldGreen").value;
  let blue =  document.getElementById("sldBlue").value;

  let rgb = {
      red: red,
      green: green,
      blue: blue
  };

  let jsonText = JSON.stringify(rgb);
  localStorage.setItem("Vives.be.colorpicker.sliders", jsonText);
};

const restoreSliderValues = () => {
let jsonText = localStorage.getItem("VIVES.be.colorpicker.sliders.sliders");
if(jsonText != null) {
    let rgb =JSON.parse(jsonText);
    document.getElementById("sldRed").value = rgb.red;
    document.getElementById("sldGreen").value = rgb.green;
    document.getElementById("sldBlue").value = rgb.blue;
}
};

const storeSwatches = () => {
    // bouw een array met kleurinfo objecten
  let rgbColors = [];
  let swatches = document.getElementsByClassName(" swatch");
  for (let i = 1; i < swatches.length; i++) {
      let rgb = {
          red: swatches[i].getAttribute("data-red"),
          green: swatches[i].getAttribute("data-green"),
          blue: swatches[i].getAttribute("data-blue")
      };
      rgbColors.push(rgb);
  }

  let jsonText = JSON.stringify(rgbColors);
  localStorage.setItem("VIVES.be.colorpicker.swatches", jsonText);
};

const restoreSwatches = () => {

};
