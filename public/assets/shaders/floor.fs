uniform vec3 time;

uniform vec3 colorHigh;
uniform vec3 colorLow;

uniform float opacityHigh;
uniform float opacityLow;

uniform float noiseScale;
uniform float threshhold;

varying vec3 vWorldPosition;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    float noise;

    if ( threshhold == 1.0 ) {
        noise = 0.0;
    } else if ( threshhold == 0.0 ) {
        noise = 1.0;
    } else {
        noise = cnoise( vWorldPosition * 0.0009 * noiseScale + time ) * 0.5 + 0.5;
        noise /= max( 1.0, length( vPosition ) * 0.00075 );
    }

    if ( noise > threshhold ) {
        gl_FragColor = vec4( colorLow, opacityLow );
    } else {
        gl_FragColor = vec4( colorHigh, opacityHigh );
    }
}
