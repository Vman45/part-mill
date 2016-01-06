SurfaceStrategy = function(model, boundingBox) {
  this.model = model;
  this.boundingBox = boundingBox;
  this.calculatingStep = false;
}

SurfaceStrategy.stepTool = function() {
  if (this.calculatingStep) {
    return;
  }

  this.calculatingStep = true;
  pos = toolPos;

  // Start from the bottom of the boundingBox
  pos[2] = this.boundingBox[0][2];

  if ((toolDirectionX == 1 &&
        pos[0] + ((resolution + (toolDiameter/2)) * toolDirectionX) <= boundingBox[1][0]) ||
      (toolDirectionX == -1 &&
        pos[0] + ((resolution + (toolDiameter/2)) * toolDirectionX) >= boundingBox[0][0])
      ) {
    // Continue moving in the same direction left or right
    pos[0] += resolution * toolDirectionX;
  }
  else if ((toolDirectionY == 1 &&
             pos[1] + ((resolution + (toolDiameter/2)) * toolDirectionY) <= boundingBox[1][1]) ||
           (toolDirectionY == -1 &&
             pos[1] + ((resolution + (toolDiameter/2)) * toolDirectionY) >= boundingBox[0][1])
           ) {
    // Move tool away from us and change X direction
    pos[1] += resolution * toolDirectionY;
    toolDirectionX = toolDirectionX * -1;
  }
  else {
    // Completed path as got to the bottom of the bounding boundingBox
    clearInterval(stepInterval);
    stepInterval = null;
    clearInterval(statsInterval);
    statsInterval = null;
    updateStats();
    return false;
  }

  tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+50] });
  var zpos = pos[2];
  while (hasCollided()) {
    zpos += resolution;
    tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: [pos[0], pos[1], zpos], end: [pos[0], pos[1], zpos+50] });
    tool.setColor(1, 0, 0);
    toolPos = pos;
  }
  toolPos = pos;
  toolPath.push([pos[0], pos[1], zpos]);
  rebuild();
  this.calculatingStep = false;
};
