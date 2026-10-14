// Se importa la configuración y constantes de FixedFunction
import * as ff from './vendor/ff/ff';

/**
    * Se crea y configura un Vertex Array Object (VAO) para una figura geométrica 2D.
    * 
    * La función abstrae la creación del Buffer de Vértices (VBO), encapsulando su estado
    * en un VAO. Se asegura de habilitar únicamente el atributo de posición, garantizando
    * que no se filtren datos de color en la geometría base.
    *
    * @param gl - El contexto activo de WebGL2.
    * @param vertices - Arreglo plano de coordenadas 2D (x, y).
    * @param indices  - Arreglo de índices para la reutilización de vértices.
    * @returns - El VAO configurado y listo para ser utilizado en el ciclo de renderizado.
    * @throws {Error} Si el navegador o el contexto no pueden asignar memoria para el VAO/VBO.
*/

export function createShapeVAO(
    gl: WebGL2RenderingContext,
    vertices: Float32Array,
    indices?: Uint16Array
): WebGLVertexArrayObject {

    const vao = gl.createVertexArray();
    if (!vao) {
        throw new Error('Error: No se pudo crear el Vertex Array Object (VAO).');
    }
    
    gl.bindVertexArray(vao);

    // Se crea y configura el VBO:
    const vbo = gl.createBuffer();
    if (!vbo) {
        throw new Error('Error: No se pudo crear el Vertex Buffer Object (VBO).');
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Se habilita y vincula específicamente ATTRIB.POSITION:
    gl.enableVertexAttribArray(ff.ATTRIB.POSITION);
    
    // Se especifica cómo WebGL lee el arreglo: 2 componentes (x,y) por vértice:
    gl.vertexAttribPointer(ff.ATTRIB.POSITION, 2, gl.FLOAT, false, 0, 0);

    // Se crea y configura el EBO si se proporciona:
    if (indices) {
        const ebo = gl.createBuffer();
        if (!ebo) {
            throw new Error('Error: No se pudo crear el Element Buffer Object (EBO).');
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    // Se desvincula el VAO como medida de seguridad para prevenir modificaciones
    // accidentales fuera de esta función:
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    if (indices) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return vao;
}

// Se define la geometría en Clip Space del triángulo:
export const TRIANGLE_VERTICES = new Float32Array([
    0.0, 0.5,   // Vértice superior
    -0.5, -0.5, // Vértice inferior izquierdo
    0.5, -0.5   // Vértice inferior derecho
])

// Se define la geometría en Clip Space del cuadrado:
export const SQUARE_VERTICES = new Float32Array([
    -0.5, 0.5,  // Vértice superior izquierdo
    -0.5, -0.5, // Vértice inferior izquierdo
    0.5, -0.5,  // Vértice inferior derecho
    0.5, 0.5    // Vértice superior derecho
]);

// Se genera el cuadrado con dos triángulos:
export const SQUARE_INDICES = new Uint16Array([
    0, 1, 2,    // Primer triángulo (arriba-izquierda -> abajo-izquierda -> abajo-derecha)
    0, 2, 3,    // Segundo triángulo (arriba-izquierda -> abajo-derecha -> arriba-derecha)
]);

const R = 0.5;
const H = R * Math.sin(Math.PI / 3); // Altura del triángulo equilátero que forma el hexágono
const C = R * Math.cos(Math.PI / 3); // Coordenada x del vértice superior del triángulo equilátero
// Se define la geometría en Clip Space del hexágono:
export const HEXAGON_VERTICES = new Float32Array([
    0.0, 0.0,       // Centro
    R, 0.0,         // Derecha
    C, H,           // Arriba-derecha
    -C, H,          // Arriba-izquierda
    -R, 0.0,        // Izquierda
    -C, -H,         // Abajo-izquierda
    C, -H           // Abajo-derecha
]);

// Se usa gl.TRIANGLE_FAN con drawElements para dibujar el hexágono:
export const HEXAGON_INDICES = new Uint16Array([
    0, 1, 2, 
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 6,
    0, 6, 1
]);

// Se usa gl.TRIANGLE_FAN con drawElements para dibujar el hexágono:
export const HEXAGON_INDICES_FAN = new Uint16Array([
    0, 1, 2, 3, 4, 5, 6, 1
]);

export const MAX_SEGMENTS = 64; // Número máximo de segmentos para aproximar el círculo

// Se define la geometría del círculo:
export function createCircleVertices(segments: number, radius: number = 0.5): Float32Array {
    // Se asegura que el número de segmentos esté dentro del rango permitido:
    const n = Math.min(Math.max(3, Math.floor(segments)), MAX_SEGMENTS); // Al menos 3 segmentos para formar un triángulo
    
    const vertices = new Float32Array((n+1) * 2); // n+1 vértices (centro + n puntos en la circunferencia)
    
    // Vértice central del círculo:
    vertices[0] = 0.0; // x
    vertices[1] = 0.0; // y

    // Se calculan los vértices en la circunferencia:
    for (let i = 0; i < n; i++) {
        const angle = (i / n) * 2 * Math.PI; // Ángulo en radianes
        vertices[(i + 1) * 2] = radius * Math.cos(angle);     // x
        vertices[(i + 1) * 2 + 1] = radius * Math.sin(angle); // y
    }

    // Se usa gl.TRIANGLES con index buffer: n triángulos * 3 índices = 3n índices:
    const indices = new Uint16Array(n * 3);
    for (let i = 0; i < n; i++) {
        const currentIndex = i + 1; // Vértice actual en la circunferencia
        const nextIndex = ((i + 1) % n) + 1; // Conecta al último vértice con el primero
        
        indices[i * 3] = 0;           // Centro
        indices[i * 3 + 1] = currentIndex;   // Vértice actual en la circunferencia
        indices[i * 3 + 2] = nextIndex;      // Vértice siguiente
    }

    return {vertices, indices};
}