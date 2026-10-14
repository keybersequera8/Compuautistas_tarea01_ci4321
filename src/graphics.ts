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