// Page scaffolding only: toggle, canvas swap and source panel.
import './style.css';

const stage = document.getElementById('stage')!;
// Nuevos botones para cambiar la figura y el color:
const btnShape = document.getElementById('btn-shape')!;
const btnColor = document.getElementById('btn-color')!;

// Se crea un Canvas limpio y se agrega al DOM:
const canvas = document.createElement('canvas');
stage.replaceChildren(canvas);

// Listener para el botón de cambiar figura:
btnShape.addEventListener('click', () => {
  // Lógica para cambiar la figura geométrica: triángulo -> cuadrado -> hexágono -> círculo -> triángulo
});

// Listener para el botón de cambiar color:
btnColor.addEventListener('click', () => {
  // Lógica para cambiar el color de la figura geométrica: rojo -> verde -> azul -> rojo
});

