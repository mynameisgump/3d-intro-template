varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vNormalModel;
varying vec3 vNormalView;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;

void main() {
    vUv = uv;
    // World space normal
    vNormal = normalize(mat3(modelMatrix) * normal);
    // Model space normal
    vNormalModel = normal;
    // View space normal
    vNormalView = normalize(normalMatrix * normal);
    // Normalized view space position
    vPosition = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
    // World space position
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    // Local position - for patterns that should move with the object
    vLocalPosition = position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}