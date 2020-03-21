uniform vec3 time;

uniform vec3 colorHigh;
uniform vec3 colorLow;

uniform float noiseScale;
uniform float threshhold;

varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    float noise = cnoise( vWorldPosition * 0.00007 * noiseScale + time ) * 0.5 + 0.5;
    if ( noise > threshhold ) {
        gl_FragColor = vec4( colorLow, 1.0 );
    } else {
        gl_FragColor = vec4( colorHigh, 1.0 );
    }
}
