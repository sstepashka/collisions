"use strict";

const kVertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;

const kFragmentShaderSource =`
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);

    throw `Failed to compile shader ${gl.getShaderInfoLog(shader)}`
  }

  return shader
};

function createProgram(gl, vertex_shader_source, fragment_shader_source) {
  const vertex_shader = loadShader(gl, gl.VERTEX_SHADER, vertex_shader_source);
  const fragment_shader = loadShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);

  const program = gl.createProgram();
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw `Failed to link shader program: ${gl.getProgramInfoLog(program)}`;
  }

  return program;
}

(function(){
  const canvas = document.querySelector("#glcanvas");
  if (canvas === null) {
      alert("Unable to get access to the canvas.");
      return;
  }

  const gl = canvas.getContext("webgl");

  const program = createProgram(gl, kVertexShaderSource, kFragmentShaderSource);
  const program_info = {
    program: program,
    attrib_locations: {
      vertex_position: gl.getAttribLocation(program, "aVertexPosition"),
      vertex_color: gl.getAttribLocation(program, "aVertexColor"),
    },
    uniform_locations: {
      projection_matrix: gl.getUniformLocation(program, "uProjectionMatrix"),
      model_view_matrix: gl.getUniformLocation(program, "uModelViewMatrix"),
    },
  };

  const position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);

  const positions = [
    -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
    -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

  const face_colors= [
    [1.0, 1.0, 1.0, 1.0],
    [1.0, 0.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
    [1.0, 0.0, 1.0, 1.0],
  ];

  var colors = [];

  for (var j = 0; j < face_colors.length; ++j) {
    const c = face_colors[j];
    colors = colors.concat(c, c, c, c);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

  const indices = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const buffers = {
    position: position_buffer,
    color: color_buffer,
    indices: index_buffer,
  };

  draw(gl, program_info, buffers);

  console.log("done");
})();

function draw(gl, program_info, buffers){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const field_of_view = (60 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const z_near = 0.1;
  const z_far = 100.0;

  const projection_matrix = mat4.create();
  mat4.perspective(projection_matrix, field_of_view, aspect, z_near, z_far);

  const model_view_matrix = mat4.create();
  mat4.translate(model_view_matrix, model_view_matrix, [0.0, 0.0, -5.0]);

  mat4.rotate(model_view_matrix, model_view_matrix, 0.6, [1, 0, 0]);
  mat4.rotate(model_view_matrix, model_view_matrix, 0.1, [0, 1, 0]);
  mat4.rotate(model_view_matrix, model_view_matrix, 0.31, [0, 0, 1]);

  setPositionAttribute(gl, buffers, program_info)
  setColorAttribute(gl, buffers, program_info)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl.useProgram(program_info.program);
  gl.uniformMatrix4fv(program_info.uniform_locations.projection_matrix, false, projection_matrix);
  gl.uniformMatrix4fv(program_info.uniform_locations.model_view_matrix, false, model_view_matrix);

  {
    const offset = 0;
    const type = gl.UNSIGNED_SHORT;
    const vertex_count = 36;
    gl.drawElements(gl.TRIANGLES, vertex_count, type, offset);
  }
};

function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attrib_locations.vertex_position,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attrib_locations.vertex_position);
};

function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attrib_locations.vertex_color,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attrib_locations.vertex_color);
}

