varying vec3 mvViewPosition;
varying vec3 mvNormal;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vec4 mvPosition =  viewMatrix * worldPosition;
  gl_Position = projectionMatrix * mvPosition;

  mvViewPosition = -mvPosition.xyz;
  mvNormal = normalize( normalMatrix * normal );
}
