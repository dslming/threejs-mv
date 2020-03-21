uniform vec3 color;

varying vec2 vUv;
varying mat4 vMatrix;
varying vec3 vPosition;

varying vec3 vNormal;
varying float vFog;
varying float isStroke;

uniform sampler2D sparkle1;
uniform sampler2D sparkle2;
uniform float sparkleStrength;

uniform vec4 sparkleSeed;

float map( float v, float a, float b, float c, float d ) {
    return clamp( c + ( d - c ) * ( v - a ) / ( b - a ), c, d );
}

vec3 hsv2rgb( vec3 c ) {

    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);

}
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

void main() {


    if ( isStroke > 5.0 ) {

        gl_FragColor = vec4( 0.156, 0.156, 0.156, 1.0 );

        if ( sparkleStrength > 0.0 ) {

            vec2 sparkleCoord = fract( gl_FragCoord.xy * 0.0002 + sparkleSeed.xy + fract( vPosition.xy * 0.005 ) );
            vec3 sTexel1 = texture2D( sparkle1, sparkleCoord ).xyz;
            vec3 s = max( sTexel1, gl_FragColor.xyz );
            gl_FragColor.xyz = mix( gl_FragColor.xyz, s, sparkleStrength );
        }

    } else {

        float l = dot( vNormal, vec3( 1.0, 0.4, 1.0 ) ) * 0.5 + 0.5;

        gl_FragColor = vec4( color * l, 1.0 );

        if ( sparkleStrength > 0.0 ) {

            vec2 sparkleCoord = fract( gl_FragCoord.xy * 0.0002 + sparkleSeed.xy + fract( vPosition.xy * 0.005 ) );
            vec3 sTexel1 = texture2D( sparkle1, sparkleCoord ).xyz;
            vec3 sTexel2 = texture2D( sparkle2, sparkleCoord ).xyz;

            vec3 texel = max( sTexel1, sTexel2  );
            float normalHue = rgb2hsv( vNormal * 0.5 + 0.5 ).x;
            vec3 hsvTexel = rgb2hsv( texel * texel * texel );
            hsvTexel.x = fract( hsvTexel.x + normalHue );
            gl_FragColor.xyz = mix( gl_FragColor.xyz, hsv2rgb( hsvTexel ) + l * 0.3, sparkleStrength );
        }



        // gl_FragColor *= gl_FragColor * gl_FragColor;

        // gl_FragColor = s;
        // gl_FragColor.xyz += vNormal * 0.5;
        // gl_FragColor.xyz
         // = max( s.xyz, gl_FragColor.xyz );
        // vec3 hsv = rgb2hsv( gl_FragColor.xyz );
        // hsv.y = max( 0.5, hsv.y );
        // gl_FragColor.xyz = hsv2rgb( hsv );
        // gl_FragColor = vec4( gl_FragCoord.x * 0.001, gl_FragCoord.y * 0.001, 1.0, 1.0 );
    }



    // depth = clamp( depth, 0.0, 1.0 );
    // gl_FragColor.w = 1.0 - depth;


    // gl_FragColor = vec4( vec3( depth ), 1.0 );
    // gl_FragColor = vec4( vec3( vDepth / 400.0 ), 1.0 );
    // gl_FragColor.xyz = vec3( depth );

}
