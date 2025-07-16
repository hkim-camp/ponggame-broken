const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const theme = getComputedStyle(document.documentElement);
const scoreLeftEl = document.getElementById("score-left");
const scoreRightEl = document.getElementById("score-right");

function updateScore(model) {
    scoreLeftEl.textContent = model.scoreL;
    scoreRightEl.textContent = model.scoreR;
}

// Helper to clear shadow properties after drawing an element
function clear_shadows(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

// Helper to apply neumorphic outset shadow
function apply_outset_shadow(ctx) {
    const shadowColorLight = theme.getPropertyValue('--neumorphic-shadow').split(',')[1].trim().split(')')[0] + ')';
    const shadowColorDark = theme.getPropertyValue('--neumorphic-shadow').split(',')[0].trim().split(')')[0] + ')';

    // Dark shadow (bottom-right)
    ctx.shadowColor = shadowColorDark;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // We need to draw the light shadow separately after the dark one.
    // This is handled in the draw functions.
}

function draw_game(model) {
    // Save context and reset transforms to ensure this theme isn't
    // affected by transformations from other themes.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Neumorphic background color
    ctx.fillStyle = theme.getPropertyValue('--background').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Inset center line for a "groove" effect
    ctx.strokeStyle = theme.getPropertyValue('--neumorphic-shadow-inset').split(',')[0].trim().split(' ')[2];
    ctx.lineWidth = 1;
    ctx.setLineDash([]); // No dashes
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 1, 0);
    ctx.lineTo(canvas.width / 2 - 1, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = theme.getPropertyValue('--neumorphic-shadow-inset').split(',')[1].trim().split(' ')[2];
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + 1, 0);
    ctx.lineTo(canvas.width / 2 + 1, canvas.height);
    ctx.stroke();

    draw_ball(ctx, model);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);

    // Restore context
    ctx.restore();
}

function draw_ball(ctx, model) {
    const ball = model.ball;
    // The ball is the same color as the background, with shadows to make it pop
    ctx.fillStyle = theme.getPropertyValue('--background').trim();

    const path = new Path2D();
    path.arc(ball.posx, ball.posy, BALL_RADIUS, 0, Math.PI * 2);

    // Apply dark outset shadow
    apply_outset_shadow(ctx);
    ctx.fill(path);

    // Apply light outset shadow
    const shadowColorLight = theme.getPropertyValue('--neumorphic-shadow').split(',')[1].trim().split(')')[0] + ')';
    ctx.shadowColor = shadowColorLight;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = -5;
    ctx.shadowOffsetY = -5;
    ctx.fill(path);

    // Clear shadows to not affect other draw calls
    clear_shadows(ctx);
}

function draw_paddle(ctx, paddle) {
    const radius = 8;
    ctx.fillStyle = theme.getPropertyValue('--background').trim();

    // Create a rounded rectangle path
    const path = new Path2D();
    const x = paddle.posx, y = paddle.posy, width = paddle.width, height = paddle.height;
    path.moveTo(x + radius, y);
    path.lineTo(x + width - radius, y);
    path.quadraticCurveTo(x + width, y, x + width, y + radius);
    path.lineTo(x + width, y + height - radius);
    path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    path.lineTo(x + radius, y + height);
    path.quadraticCurveTo(x, y + height, x, y + height - radius);
    path.lineTo(x, y + radius);
    path.quadraticCurveTo(x, y, x + radius, y);
    path.closePath();

    // Apply dark outset shadow
    apply_outset_shadow(ctx);
    ctx.fill(path);

    // Apply light outset shadow
    const shadowColorLight = theme.getPropertyValue('--neumorphic-shadow').split(',')[1].trim().split(')')[0] + ')';
    ctx.shadowColor = shadowColorLight;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = -5;
    ctx.shadowOffsetY = -5;
    ctx.fill(path);
    clear_shadows(ctx);
}

function drawStarfield(ctx) { }
function initStarfield() { }

function draw_victory_screen(model) {
    const winner = model.scoreL >= model.winningScore ? "Left Player" : "Right Player";
    ctx.fillStyle = "rgba(224, 229, 236, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.fillStyle = model.theme.darkShadow;
    ctx.font = "bold 40px 'Segoe UI', sans-serif";
    ctx.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px 'Segoe UI', sans-serif";
    ctx.fillText("Press 'End' to play again", canvas.width / 2, canvas.height / 2 + 20);
}