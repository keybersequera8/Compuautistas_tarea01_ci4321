import { ATTRIB } from '../vendor/ff/ff';

export function triangulo(gl: WebGL2RenderingContext) {
  
    // El color lo ponemos luego con ff.setColor
  const vertices = new Float32Array([
    0, 0.7, 0,
    -0.7, -0.6, 0,
    0.7, -0.6, 0
  ]);

  // Creamos el vao y guardamos los vertices en el buffer
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Solamente usamos las posiciones de los vertices
  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);

  return {
    vao,
    mode: gl.TRIANGLES,
    count: 3,
    indexed: false
  };
}

export function cuadrado(gl: WebGL2RenderingContext) {
  
    // Guardamos los 4 vertices
  const vertices = new Float32Array([
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
    -0.5, 0.5, 0
  ]);

  // Dividimos el cuadrado en 2 triangulos
  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3
  ]);

  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, 0, 0);

  // Guardamos los indices en otro buffer
  const buffer_indices = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer_indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  return {
    vao,
    mode: gl.TRIANGLES,
    count: 6,
    indexed: true
  };
}