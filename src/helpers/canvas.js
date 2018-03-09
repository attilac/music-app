export function drawLines(props) {
  const { ctx, x, y, width, height, strokeStyle } = props;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, height);
  ctx.stroke();  
}
  
export function clearCanvas(props) {
  const { ctx, x, y, width, height } = props;
  ctx.clearRect(x, y, width, height);    
}

export function drawTile(props) {
  const { ctx, x ,y, offsetX, offsetY, width, height, margin, fillStyle } = props;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.fillRect((x * width) + margin + offsetX, (y * height) + margin + offsetY, width - ( margin * 2 ), height - ( margin * 2 ));  
}
