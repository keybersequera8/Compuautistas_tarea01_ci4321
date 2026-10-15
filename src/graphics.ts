// Se importa la configuración y constantes de FixedFunction
import * as ff from './vendor/ff/ff';

/** 
 * @fileoverview Funciones para crear y gestionar objetos gráficos en WebGL2.
 * 
 * Todas las figuras están construidas con triángulos en sentido antihorario 
 * y se definen en Clip Space, donde el rango de coordenadas es [-1, 1].
 */

// Se identifican las figuras geométricas soportadas por la aplicación:
export type ShapeType = 'triangle' | 'quad' | 'hexagon' | 'circle';

// Se define la geometría en Clip Space del triángulo:
export const TRIANGLE_VERTICES = new Float32Array([
    0.0, 0.7, 0.0, // Vértice superior
    -0.7, -0.6, 0.0, // Vértice inferior izquierdo
    0.7, -0.6, 0.0, // Vértice inferior derecho
])

// Se define la geometría en Clip Space del cuadrado:
export const QUAD_VERTICES = new Float32Array([
    -0.5, -0.5, 0.0, // Vértice superior izquierdo
    0.5, -0.5, 0.0, // Vértice inferior izquierdo
    0.5, 0.5, 0.0, // Vértice inferior derecho
    -0.5, 0.5, 0.0 // Vértice superior derecho
]);

// Se genera el cuadrado con dos triángulos:
export const QUAD_INDICES = new Uint16Array([
    0, 1, 2, // Primer triángulo (mitad inferior derecha)
    0, 2, 3, // Segundo triángulo (mitad superior izquierda)
]);

const R = 0.5;
const H = R * Math.sin(Math.PI / 3); // Altura del triángulo equilátero que forma el hexágono
const C = R * Math.cos(Math.PI / 3); // Coordenada x del vértice superior del triángulo equilátero

// Se define la geometría en Clip Space del hexágono:
export const HEXAGON_VERTICES = new Float32Array([
    0.0, 0.0, 0.0, // Centro
    R, 0.0, 0.0, // Derecha
    C, H, 0.0, // Arriba-derecha
    -C, H, 0.0, // Arriba-izquierda
    -R, 0.0, 0.0, // Izquierda
    -C, -H, 0.0, // Abajo-izquierda
    C, -H, 0.0, // Abajo-derecha
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
    0, 1, 2, 3, 4, 5, 6, 1,
]);

export const MAX_SEGMENTS = 64; // Número máximo de segmentos para aproximar el círculo

// Se define la geometría del círculo:
export function createCircleGeometry(
    segments: number = MAX_SEGMENTS,
    radius: number = 0.5
): { vertices: Float32Array, indices: Uint16Array } {
    // Se asegura que el número de segmentos esté dentro del rango permitido:
    const n = Math.min(Math.max(3, Math.floor(segments)), MAX_SEGMENTS); // Al menos 3 segmentos para formar un triángulo
    const vertices = new Float32Array((n+1) * 3); // n+1 vértices (centro + n puntos en la circunferencia)
    // Vértice central del círculo:
    vertices[0] = 0.0; // x
    vertices[1] = 0.0; // y
    vertices[2] = 0.0; // z

    // Se calculan los vértices en la circunferencia:
    for (let i = 0; i < n; i++) {
        const angle = (i / n) * 2 * Math.PI; // Ángulo en radianes
        const offset = (i + 1) * 3; // Offset para el vértice actual
        vertices[offset] = radius * Math.cos(angle); // x
        vertices[offset + 1] = radius * Math.sin(angle); // y
        vertices[offset + 2] = 0.0; // z
    }

    // Se usa gl.TRIANGLES con index buffer: n triángulos * 3 índices = 3n índices:
    const indices = new Uint16Array(n * 3);
    for (let i = 0; i < n; i++) {
        const currentIndex = i + 1; // Vértice actual en la circunferencia
        const nextIndex = ((i + 1) % n) + 1; // Conecta al último vértice con el primero
        
        indices[i * 3] = 0; // Centro
        indices[i * 3 + 1] = currentIndex; // Vértice actual en la circunferencia
        indices[i * 3 + 2] = nextIndex; // Vértice siguiente
    }

    return {vertices, indices};
}

/**
    * Se crea y configura un Vertex Array Object (VAO) para una figura geométrica 2D.
    * 
    * Cumple con la restricción de diseño de habilitar únicamente el atributo de posición 
    * (ATTRIB.POSITION) y no otros atributos, delegando el color al estado genérico del
    * contexto manejado por FixedFunction.
    *
    * @param gl - El contexto activo de WebGL2.
    * @param vertices - Arreglo plano de coordenadas 2D (x, y).
    * @param indices - Arreglo de índices para la reutilización de vértices.
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
    
    // Se especifica cómo WebGL lee el arreglo: 3 componentes (x,y, z) por vértice:
    gl.vertexAttribPointer(ff.ATTRIB.POSITION, 3, gl.FLOAT, false, 0, 0);

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

// Datos necesarios para dibujar las figuras geométricas en el ciclo de renderizado.
// Se guarda si usa índices o no para saber si llamar a drawElements o drawArrays:
export interface ShapeMesh {
    readonly vao: WebGLVertexArrayObject;
    readonly mode: GLenum;
    readonly count: number;
    readonly indexed: boolean;
}

/** 
 * Inicializa los descriptores geométricos de las figuras soportadas por la aplicación.
 * 
 * @param gl - El contexto activo de WebGL2.
 * @param circleSegments - Número de segmentos para aproximar el círculo (mínimo 3, máximo 64).
 * @returns - Un objeto que contiene los VAOs y la información de dibujo para cada figura.
 * @throws {Error} Si ocurre un error al crear los VAOs o buffers.
 */
export function createAllShapes(
    gl: WebGL2RenderingContext, 
    circleSegments: number = MAX_SEGMENTS
): Record<ShapeType, ShapeMesh> {
    const circleGeometry = createCircleGeometry(circleSegments);
    return {
        triangle: {
            vao: createShapeVAO(gl, TRIANGLE_VERTICES),
            mode: gl.TRIANGLES,
            count: TRIANGLE_VERTICES.length / 3, // 3 vértices
            indexed: false,
        },
        quad: {
            vao: createShapeVAO(gl, QUAD_VERTICES, QUAD_INDICES),
            mode: gl.TRIANGLES,
            count: QUAD_INDICES.length, // 6 vértices
            indexed: true,
        },
        hexagon: {
            vao: createShapeVAO(gl, HEXAGON_VERTICES, HEXAGON_INDICES_FAN),
            mode: gl.TRIANGLE_FAN,
            count: HEXAGON_INDICES_FAN.length, // 8 vértices
            indexed: true,
        },
        circle: {
            vao: createShapeVAO(gl, circleGeometry.vertices, circleGeometry.indices),
            mode: gl.TRIANGLES,
            count: circleGeometry.indices.length, // 3 * cicleSegments índices
            indexed: true,
        }
    };
}