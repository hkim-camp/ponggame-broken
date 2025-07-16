var canvas = document.getElementById("gameboard");
var ctx = canvas.getContext("2d");
var scoreLeftEl = document.getElementById("score-left");
var scoreRightEl = document.getElementById("score-right");

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

function draw_game(model) {
    // Save context and reset transforms to ensure this theme isn't
    // affected by transformations from other themes.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Neumorphic background color
    ctx.fillStyle = model.theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Inset center line for a "groove" effect
    ctx.strokeStyle = model.theme.insetShadowDark;
    ctx.lineWidth = 1;
    ctx.setLineDash([]); // No dashes
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 1, 0);
    ctx.lineTo(canvas.width / 2 - 1, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = model.theme.insetShadowLight;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + 1, 0);
    ctx.lineTo(canvas.width / 2 + 1, canvas.height);
    ctx.stroke();

    draw_ball(ctx, model.ball, model.theme);
    draw_paddle(ctx, model.paddleL, model.theme);
    draw_paddle(ctx, model.paddleR, model.theme);

    // Restore context
    ctx.restore();
}

function draw_ball(ctx, ball, theme) {
    // The ball is the same color as the background, with shadows to make it pop
    ctx.fillStyle = theme.background;

    const path = new Path2D();
    path.arc(ball.posx, ball.posy, BALL_RADIUS, 0, Math.PI * 2);

    // Apply dark outset shadow
    ctx.shadowColor = theme.shadowDark;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fill(path);

    // Apply light outset shadow by drawing again
    ctx.shadowColor = theme.shadowLight;
    ctx.shadowOffsetX = -5;
    ctx.shadowOffsetY = -5;
    ctx.fill(path);

    // Clear shadows to not affect other draw calls
    clear_shadows(ctx);
}

function draw_paddle(ctx, paddle, theme) {
    const radius = 8;
    ctx.fillStyle = theme.background;

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
    ctx.shadowColor = theme.shadowDark;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fill(path);

    // Apply light outset shadow by drawing again
    ctx.shadowColor = theme.shadowLight;
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
    ctx.fillStyle = model.theme.foreground;
    ctx.font = "bold 40px 'Segoe UI', sans-serif";
    ctx.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px 'Segoe UI', sans-serif";
    ctx.fillText("Press 'Restart' to play again", canvas.width / 2, canvas.height / 2 + 20);
}