uniform vec3 time;

uniform vec3 colorHigh;
uniform vec3 colorLow;

uniform float noiseScale;
uniform float threshhold;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    vec2 noisePos = vNormal.xy * 4.0 * noiseScale + time.xz;
    noisePos += vWorldPosition.xy * 0.0005;
    noisePos *= 0.15;
    float noise = snoise( noisePos ) * 0.5 + 0.5;
    if ( noise > threshhold ) {
        gl_FragColor = vec4( colorLow, 1.0 );
    } else {
        gl_FragColor = vec4( colorHigh, 1.0 );
    }
}
