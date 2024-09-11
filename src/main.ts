import Phaser from "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;
import Shader = Phaser.GameObjects.Shader;

const fragShader =  new Blob([`
    precision mediump float;

    uniform float time;    
    uniform vec2 resolution;
    varying vec2 fragCoord;
    
    mat2 rotate2d(float _angle) {
        return
        mat2(cos(_angle),-sin(_angle),
             sin(_angle), cos(_angle));
    }
    
    void main() {
        vec2 uv = fragCoord / resolution.xy - vec2(0.5, 0.5);
        gl_FragColor = vec4(vec3(((0.5 - distance(uv, vec2(0))) * 2.0) > ((sin(time * 10.0) + 1.0) / 2.0) ? 1.0 : 0.0), 1.0);
    }
`]);

class Game extends Phaser.Scene {
    shader: Shader | null = null;

    preload() {
        let fragShaderURL = URL.createObjectURL(fragShader);
        this.load.glsl("particles", fragShaderURL);
    }

    create() {
        this.shader = this.add.shader("particles", 400, 300, 40, 40);
    }

    update(time: number, _delta: number) {
        this.shader?.setPosition(
            400 + 200 * Math.cos(time / 1000),
            300 + 200 * Math.sin(time / 1000),
        );
    }
}

let config: GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Game
};

new Phaser.Game(config);