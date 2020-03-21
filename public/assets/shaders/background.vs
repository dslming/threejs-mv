varying vec3 vWorldPosition;

void main() {

    vWorldPosition = ( modelMatrix * vec4( position, 1.0 ) ).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    // float displacement = - noise + b;

    // vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // vNormal = normalize(normalMatrix * normal);

    // vec3 lightPosition = vec3(0, 0, 500);
    // vec3 lVector = normalize(lightPosition - mvPosition.xyz);
    // float lightVolume = max(0.0, dot(vNormal, lVector)) * 0.4;
    // vlightColor = lightColor * lightVolume;


    // lightPosition = vec3(0, -500, -500);
    // lVector = normalize(lightPosition - mvPosition.xyz);
    // lightVolume = max(0.0, dot(vNormal, lVector)) * 0.4;
    // vlightColor += lightColor * lightVolume;

    // vec3 newPosition = position + normal * displacement;
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );


}
