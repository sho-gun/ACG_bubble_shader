const float PI = 3.14159265358979323846;

varying vec3 mvViewPosition;
varying vec3 mvNormal;

uniform vec3 directionalLightPos;
uniform vec3 directionalLightColor;
uniform vec3 ambientLightColor;
uniform vec3 materialColor;
uniform vec3 backgroundColor;
uniform float surfaceThickness; // nm
uniform float refractiveIndex;

const vec3 wavelengths = vec3( 620.0, 530.0, 485.0 ); // nm

vec3 getInterferenceColor() {
  vec3 interferenceColor = directionalLightColor;

  float cos_theta = max( dot(normalize(directionalLightPos), mvNormal), dot(normalize(directionalLightPos), -mvNormal) );
  float sin_phi_squared = ( 1.0 - pow( cos_theta, 2.0 ) ) / pow( refractiveIndex, 2.0 );
  float distanceDiff = ( 2.0 * surfaceThickness * sqrt(sin_phi_squared) ) / sqrt( 1.0 - sin_phi_squared );

  interferenceColor *= 0.5 * sqrt( 2.0 + 2.0 * cos( 2.0 * PI * distanceDiff / wavelengths ) );

  return interferenceColor;
}

void main() {
  vec3 ambientColor = ambientLightColor * materialColor;
  vec3 diffuseColor = max( 0.0, dot( normalize(directionalLightPos), mvNormal ) ) * directionalLightColor * materialColor;
  vec3 interferenceColor = getInterferenceColor();
  gl_FragColor.rgb = mix( backgroundColor, ambientColor + diffuseColor + interferenceColor, 0.1 );
  gl_FragColor.a = 1.0;
}
