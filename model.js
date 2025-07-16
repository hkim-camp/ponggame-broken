const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };
const STATE = { STARTUP: 0, PLAYING: 1, GAMEOVER: 2 };
const CPU_DIFFICULTY = { EASY: 0, MEDIUM: 1, HARD: 2 };
const THEMES = {
    NEON: {
        name: 'NEON',
        cssPath: 'themes/neon/style.css',
        jsPath: 'themes/neon/view.js',
        background: 'rgba(0, 0, 0, 0.15)',
        foreground: 'rgba(255, 255, 255, 0.5)',
        paddleLColor: '#00FFFF',
        paddleRColor: '#FF00FF',
        ballColor: '#FFFF00',
        hasStarfield: true
    },
    CLASSIC: {
        name: 'CLASSIC',
        cssPath: 'themes/classic/style.css',
        jsPath: 'themes/classic/view.js',
        background: '#000000',
        foreground: '#FFFFFF',
        paddleLColor: '#FFFFFF',
        paddleRColor: '#FFFFFF',
        ballColor: '#FFFFFF',
        hasStarfield: false
    },
    NEU: {
        name: 'NEU',
        cssPath: 'themes/neumorphism/style.css',
        jsPath: 'themes/neumorphism/view.js',
        background: '#000000',
        foreground: '#FFFFFF',
        paddleLColor: '#FFFFFF',
        paddleRColor: '#FFFFFF',
        ballColor: '#FFFFFF',
        hasStarfield: false
    }
};

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const PADDLE_WiDTH = 25;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12.5;
const PADDLE_VELOCITY = 5;
const PADDLE_FORCE = 1.1; // 110% of speed before
const INITIAL_BALL_SPEED = 3;

class Model {
    ball;
    paddleL;
    paddleR;
    scoreL = 0;
    scoreR = 0;
    cpu_left = false; // Default to Player vs CPU
    cpu_right = true;
    winningScore = 10;
    cpu_difficulty_left = CPU_DIFFICULTY.EASY;
    cpu_difficulty_right = CPU_DIFFICULTY.EASY;
    theme = THEMES.NEON; // Default theme
    state = STATE.STARTUP;
    intervalID = -1;

    constructor() {
        // Initialize paddles only once
        this.paddleL = new Paddle(0, 0, PADDLE_WiDTH, PADDLE_HEIGHT, SIDE.LEFT, this.theme.paddleLColor);
        this.paddleR = new Paddle(BOARD_WIDTH - PADDLE_WiDTH, 0, PADDLE_WiDTH, PADDLE_HEIGHT, SIDE.RIGHT, this.theme.paddleRColor);
    }

    setTheme(themeName) {
        if (THEMES[themeName]) {
            this.theme = THEMES[themeName];
            // Update existing paddle colors for live theme switching
            if (this.paddleL) this.paddleL.color = this.theme.paddleLColor;
            if (this.paddleR) this.paddleR.color = this.theme.paddleRColor;
        }
    }

    resetGame() {
        this.state = STATE.STARTUP;
        this.scoreL = 0;
        this.scoreR = 0;
        clearTimeout(this.intervalID);

        // Reset paddle positions to the center
        this.paddleL.posy = BOARD_HEIGHT / 2 - this.paddleL.height / 2;
        this.paddleL.vely = 0;
        this.paddleR.posy = BOARD_HEIGHT / 2 - this.paddleR.height / 2;
        this.paddleR.vely = 0;

        this.resetBall();
        // After resetting the internal state, make sure the UI matches.
        // This is crucial for when a game ends or is restarted.
        if (typeof syncControlsWithModel === 'function') {
            syncControlsWithModel();
        }
    }

    resetBall() {
        // Randomly decide to serve left or right.
        const serveLeft = Math.random() < 0.5;

        // Use the full random range: (-45 to 45) or (135 to 225)
        const angle = serveLeft ? (Math.random() * 90 + 135) : (Math.random() * 90 - 45);

        // Convert angle to radians for trigonometric functions
        const angleRad = angle * (Math.PI / 180);

        const velx = INITIAL_BALL_SPEED * Math.cos(angleRad);
        const vely = INITIAL_BALL_SPEED * Math.sin(angleRad);

        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, velx, vely);
    }

}
