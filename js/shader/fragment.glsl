uniform float time;
uniform float progress;
uniform float distanceFromCenter;
uniform vec2 mouse;
uniform sampler2D texture1;
uniform sampler2D texture2;
varying float vAlpha;
uniform vec4 resolution;
varying vec2 vUv;
uniform vec2 imageResolution;
varying vec4 vPosition;


void main(){
   
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
        min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
        );
    vec2 EverUv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 t = texture2D(texture1, EverUv);
    float bw = (t.r + t.b + t.g)/3.;
    vec4 another = vec4(bw, bw, bw, 1.);
    gl_FragColor = vec4(vUv,1., 0.);
    gl_FragColor = mix(another, t, distanceFromCenter);
    //gl_FragColor = vec4(vUv, 1., 1.);
    gl_FragColor.a = clamp(distanceFromCenter, 0.6, vAlpha);

}