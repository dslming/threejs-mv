varying vec3 vNormal;
varying float isStroke;
// varying float vFog;
// varying float depth;

uniform vec3 center;

varying vec3 vPosition;

uniform float strokeInflate;

attribute vec3 vertexNormal;
varying vec2 vUv;
varying mat4 vMatrix;

void main() {

    vPosition = position;
    vMatrix = modelViewMatrix;

    vNormal = normalize( normalMatrix * normal );
    vUv = uv;

    vec3 worldPosition = ( modelViewMatrix * vec4( vPosition, 1.0 ) ).xyz;
    float depth = length( worldPosition );
    // vFog = map( depth, 0.0, far, 0.0, 0.1 );


    if ( length( normal ) > 2.0 ) {
        isStroke = 20.0;
        // vPosition += normalize( vertexNormal ) * depth / 240.0;
        vec3 offset = vPosition - center;
        vPosition += normalize( offset ) * length( offset ) * 0.05 * min( 2.5, sqrt( depth * 0.01 ) ) * strokeInflate;
    } else {
        isStroke = 0.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

}
