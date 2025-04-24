uniform float u_time;
uniform vec3 u_color;
uniform vec3 u_cameraPosition;
uniform mat4 modelMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vNormalModel;
varying vec3 vNormalView;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;

// 2D Random
float random(in vec3 st) {
    return fract(sin(dot(st, vec3(12.9898, 78.233, 23.112))) * 12943.145);
}

float noise(in vec3 _pos) {
    vec3 i_pos = floor(_pos);
    vec3 f_pos = fract(_pos);

    float i_time = floor(u_time * 0.2);
    float f_time = fract(u_time * 0.2);

    // Eight corners in 3D of a tile for current time
    float aa = random(i_pos + vec3(0.0) + i_time);
    float ab = random(i_pos + vec3(1.0, 0.0, 0.0) + i_time);
    float ac = random(i_pos + vec3(0.0, 1.0, 0.0) + i_time);
    float ad = random(i_pos + vec3(1.0, 1.0, 0.0) + i_time);
    float ae = random(i_pos + vec3(0.0, 0.0, 1.0) + i_time);
    float af = random(i_pos + vec3(1.0, 0.0, 1.0) + i_time);
    float ag = random(i_pos + vec3(0.0, 1.0, 1.0) + i_time);
    float ah = random(i_pos + vec3(1.0, 1.0, 1.0) + i_time);

    // Eight corners for next time step
    float ba = random(i_pos + vec3(0.0) + (i_time + 1.0));
    float bb = random(i_pos + vec3(1.0, 0.0, 0.0) + (i_time + 1.0));
    float bc = random(i_pos + vec3(0.0, 1.0, 0.0) + (i_time + 1.0));
    float bd = random(i_pos + vec3(1.0, 1.0, 0.0) + (i_time + 1.0));
    float be = random(i_pos + vec3(0.0, 0.0, 1.0) + (i_time + 1.0));
    float bf = random(i_pos + vec3(1.0, 0.0, 1.0) + (i_time + 1.0));
    float bg = random(i_pos + vec3(0.0, 1.0, 1.0) + (i_time + 1.0));
    float bh = random(i_pos + vec3(1.0, 1.0, 1.0) + (i_time + 1.0));

    // Smooth step
    vec3 t = smoothstep(0.0, 1.0, f_pos);
    float t_time = smoothstep(0.0, 1.0, f_time);

    // Mix 8 corners percentages for current time
    float currentTime = mix(
        mix(mix(aa, ab, t.x), mix(ac, ad, t.x), t.y),
        mix(mix(ae, af, t.x), mix(ag, ah, t.x), t.y),
        t.z
    );
    
    // Mix 8 corners percentages for next time
    float nextTime = mix(
        mix(mix(ba, bb, t.x), mix(bc, bd, t.x), t.y),
        mix(mix(be, bf, t.x), mix(bg, bh, t.x), t.y),
        t.z
    );
    
    // Interpolate between current and next time
    return mix(currentTime, nextTime, t_time);
}

#define NUM_OCTAVES 6
float fBm(in vec3 _pos, in float sz) {
    float v = 0.0;
    float a = 0.2;
    _pos *= sz;

    vec3 angle = vec3(-0.001 * u_time, 0.0001 * u_time, 0.0004 * u_time);
    mat3 rotx = mat3(1.0, 0.0, 0.0,
                     0.0, cos(angle.x), -sin(angle.x),
                     0.0, sin(angle.x), cos(angle.x));
    mat3 roty = mat3(cos(angle.y), 0.0, sin(angle.y),
                     0.0, 1.0, 0.0,
                     -sin(angle.y), 0.0, cos(angle.y));
    mat3 rotz = mat3(cos(angle.z), -sin(angle.z), 0.0,
                     sin(angle.z), cos(angle.z), 0.0,
                     0.0, 0.0, 1.0);

    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_pos);
        _pos = rotx * roty * rotz * _pos * 2.0;
        a *= 0.8;
    }
    return v;
}

void main() {
    // Use normalized model space normal for base pattern
    // This ensures the pattern is fixed to the object
    vec3 modelNormal = normalize(vNormalModel);
    
    // Sun surface using fractal noise
    vec3 st = modelNormal;

    vec3 q = vec3(0.0);
    q.x = fBm(st, 5.0);
    q.y = fBm(st + vec3(1.2, 3.2, 1.52), 5.0);
    q.z = fBm(st + vec3(0.02, 0.12, 0.152), 5.0);

    float n = fBm(st + q + vec3(1.82, 1.32, 1.09), 5.0);

    vec3 surfaceColor = vec3(0.0);
    surfaceColor = mix(vec3(1.0, 0.4, 0.0), vec3(1.0, 1.0, 1.0), n * n);
    surfaceColor = mix(surfaceColor, vec3(1.0, 0.0, 0.0), q * 0.7);
    
    // For view-dependent effects, calculate view direction in world space
    vec3 viewDirection = normalize(u_cameraPosition - vWorldPosition);
    vec3 worldNormal = normalize(vNormal);
    
    // Glow effect - using world space normal and view direction
    float raw_intensity = max(dot(viewDirection, worldNormal), 0.0);
    float intensity = pow(raw_intensity, 4.0);
    
    // Fresnel effect - using world space normal and view direction
    float fresnelTerm_inner = 0.2 - 0.7 * min(dot(viewDirection, worldNormal), 0.0);
    fresnelTerm_inner = pow(fresnelTerm_inner, 5.0);

    float fresnelTerm_outer = 1.0 + dot(viewDirection, worldNormal);
    fresnelTerm_outer = pow(fresnelTerm_outer, 2.0);
    
    float fresnelTerm = fresnelTerm_inner + fresnelTerm_outer;
    
    // Combine all effects
    vec3 finalColor = 1.6 * surfaceColor;
    float alpha = intensity + 0.7 * fresnelTerm;
    
    gl_FragColor = vec4(finalColor, 1.0);
}