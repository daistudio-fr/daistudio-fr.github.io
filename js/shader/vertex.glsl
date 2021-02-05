uniform float time;
varying vec2 vUv;
uniform float progress;
uniform float direction;
uniform vec2 mouse;
uniform float alpha;
varying float vAlpha;
varying vec4 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;
uniform float distanceFromCenter;


void main(){
    vUv = (uv - vec2(0.5))*(0.9 - 0.2*distanceFromCenter*(2. - distanceFromCenter)) + vec2(0.5);
    
    vAlpha = alpha;
    vec3 pos = position;
    // float distance = length(uv - vec2(0.5));
    // float maxdist = length(vec2(0.5));

    float distance = length(uv - vec2(0.5, 0.7));

    float maxdist = length(mouse);

    float normalizeDistance = distance/maxdist;

    float stickTo = normalizeDistance;

    float stickOut = -normalizeDistance;

    float stickEffect = mix(stickTo, stickOut, direction);

    float mySuperDupahProgress = min(2.*progress, 2.*(1. - progress));

    float zOffset = 2.;

    float zProgress = (mix(clamp(2.*progress, 0., 1.),clamp(1. - 2.*(1. -progress), 0., 1.), direction));

    pos.z += zOffset*(stickEffect*mySuperDupahProgress - zProgress) ;

    pos.z += progress*sin(distance*10. + time )*0.05;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}