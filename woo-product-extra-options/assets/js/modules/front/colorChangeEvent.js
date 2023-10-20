// colorChangeEvent.js

export function attachColorChangeEvent(cortesSegunMaquinaCallback) {
    const colorRadios = document.querySelectorAll("div[data-name='color'] .wpcc-field-radios input[name=color]");
  
    // Encapsula el fragmento de código en una función
    function handleColorChange(calculosPersonalizados, radio) {
      if (productData.name == 'Copistería online' && radio.value === 'bn') {
        calculo = calculosPersonalizados.calculosInicialesCopisteria;
        maquina = data.primas.preparacion_maquina[4];
      } else if (productData.name == 'Copistería online' && radio.value === 'color') {
        calculo = calculosPersonalizados.customCalculosIniciales;
        maquina = data.primas.preparacion_maquina[0];
      } else {
        calculo = calculosPersonalizados.customCalculosIniciales;
        maquina = data.primas.preparacion_maquina[0];
      }
  
      // Llama al callback con los nuevos valores
      cortesSegunMaquinaCallback(); // Llama a la función de cortesSegunMaquina
    }
  
    colorRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        // Llama a la función que maneja el cambio de color
        handleColorChange(radio);
      });
    });
}
