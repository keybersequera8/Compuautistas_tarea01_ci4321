/** 
 * @fileoverview Programa principal de la aplicación WebGL2. 
 * 
 * Se encarga de inicializar el contexto WebGL2, crear las figuras geométricas 
 * y gestionar la interacción del usuario con los botones para cambiar la 
 * figura y el color.
 */


import './style.css';
import {createFixedFunction, type Color} from './vendor/ff/ff';
import {createAllShapes, type ShapeType} from './graphics';


// Se dimensiona el lienzo de dibujo para preservar la relación de aspecto 1:1:
const CANVAS_SIZE = 480;

// Se define la secuencia cíclica de figuras geométricas soportadas por la aplicación:
const SHAPE_ORDER: readonly ShapeType[] = ['triangle', 'quad', 'hexagon', 'circle'];

// Se define el estado de color:
interface ColorState {
  readonly name: 'red' | 'green' | 'blue';
  readonly value: Color;
}

// Se define la secuencia cíclica de los colores:
const COLOR_ORDER: readonly ColorState[] = [
  {name: 'red', value: [1.0, 0.0, 0.0]},
  {name: 'green', value: [0.0, 1.0, 0.0]},
  {name: 'blue', value: [0.0, 0.0, 1.0]},
];

// Referencias a elementos del DOM:
const stage = document.getElementById('stage') as HTMLElement;
const btnShape = document.getElementById('btn-shape') as HTMLButtonElement;
const btnColor = document.getElementById('btn-color') as HTMLButtonElement;

// Se crea un Canvas limpio y se agrega al DOM:
const canvas = document.createElement('canvas');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
stage.replaceChildren(canvas);

// Se inicializa el contexto WEbGL2:
const gl = canvas.getContext('webgl2');
if (!gl) {
  throw new Error('Este navegador no soporta WebGL2');
}

// Se configura el viewport:
gl.viewport(0, 0, canvas.width, canvas.height);

// Se inicializa la libreria FixedFunction y los VAOs:
const ff = createFixedFunction(gl);
const shapes = createAllShapes(gl);

// Se define el estado inicial de la figura y el color:
let currentShapeIndex = 0;
let currentColorIndex = 0;

// Se limpia el framebuffer y dibuja la figura con el color seleccionado:
function render(): void {
  gl!.clear(gl!.COLOR_BUFFER_BIT);
  const activeColor = COLOR_ORDER[currentColorIndex].value;
  const activeShapeKey = SHAPE_ORDER[currentShapeIndex];
  const activeMesh = shapes[activeShapeKey];

  ff.setColor(activeColor);
  gl!.bindVertexArray(activeMesh.vao);
  if (activeMesh.indexed) {
    ff.drawElements(activeMesh.mode, activeMesh.count, gl!.UNSIGNED_SHORT, 0);
  } else {
    ff.drawArrays(activeMesh.mode, 0, activeMesh.count);
  }

  gl!.bindVertexArray(null);
}

// Listener para el botón de cambiar figura:
btnShape.addEventListener('click', () => {
  // Lógica para cambiar la figura geométrica: triángulo -> cuadrado -> hexágono -> círculo -> triángulo
});

// Listener para el botón de cambiar color:
btnColor.addEventListener('click', () => {
  // Lógica para cambiar el color de la figura geométrica: rojo -> verde -> azul -> rojo
});