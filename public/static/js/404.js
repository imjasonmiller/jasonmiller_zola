var Page = (function() {
  var matLines = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true
  });
  var matSolid = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      polygonOffset: true,
      polygonOffsetFactor: 5,
      polygonOffsetUnits: 5
  });

  matSolid.side = THREE.BackSide;
  var openDoorFrame = getMesh({
      "uvs": [
      [0.38, 0.25, 0.62, 0.25, 0.38, 0.5, 0.62, 0.5, 0.38, 0.75, 0.62, 0.75, 0.38, 1, 0.62, 1, 0.62, 0, 0.88, 0, 0.88, 0.25, 0.12, 0, 0.38, 0, 0.12, 0.25]
      ],
      "name": "doorFrame",
      "faces": [40, 0, 1, 2, 0, 1, 2, 0, 1, 2, 40, 2, 1, 3, 2, 1, 3, 2, 1, 3, 40, 4, 5, 6, 4, 5, 6, 4, 5, 6, 40, 6, 5, 7, 6, 5, 7, 6, 5, 7, 40, 7, 5, 1, 8, 9, 1, 7, 5, 1, 40, 1, 5, 3, 1, 9, 10, 1, 5, 3, 40, 4, 6, 2, 11, 12, 13, 4, 6, 2, 40, 2, 6, 0, 13, 12, 0, 2, 6, 0, 40, 8, 9, 10, 0, 2, 1, 8, 9, 10, 40, 10, 9, 11, 1, 2, 3, 10, 9, 11, 40, 12, 13, 14, 4, 6, 5, 12, 13, 14, 40, 14, 13, 15, 5, 6, 7, 14, 13, 15, 40, 15, 10, 14, 8, 1, 9, 15, 10, 14, 40, 14, 10, 11, 9, 1, 10, 14, 10, 11, 40, 12, 9, 13, 11, 13, 12, 12, 9, 13, 40, 13, 9, 8, 12, 13, 0, 13, 9, 8, 40, 8, 10, 0, 0, 1, 0, 8, 10, 0, 40, 0, 10, 1, 0, 1, 1, 0, 10, 1, 40, 11, 9, 3, 3, 2, 3, 11, 9, 3, 40, 3, 9, 2, 3, 2, 2, 3, 9, 2, 40, 12, 14, 4, 4, 5, 4, 12, 14, 4, 40, 4, 14, 5, 4, 5, 5, 4, 14, 5, 40, 15, 13, 7, 7, 6, 7, 15, 13, 7, 40, 7, 13, 6, 7, 6, 6, 7, 13, 6, 40, 14, 11, 5, 9, 10, 9, 14, 11, 5, 40, 5, 11, 3, 9, 10, 10, 5, 11, 3, 40, 10, 15, 1, 1, 8, 1, 10, 15, 1, 40, 1, 15, 7, 1, 8, 8, 1, 15, 7, 40, 13, 8, 6, 12, 0, 12, 13, 8, 6, 40, 6, 8, 0, 12, 0, 0, 6, 8, 0, 40, 9, 12, 2, 13, 11, 13, 9, 12, 2, 40, 2, 12, 4, 13, 11, 11, 2, 12, 4],
      "vertices": [-1800, 5362.5, 200, 1800, 5362.5, 200, -1800, 5362.5, -200, 1800, 5362.5, -200, -1800, -262.5, -200, 1800, -262.5, -200, -1800, -262.5, 200, 1800, -262.5, 200, -1500, 5050, 200, -1500, 5050, -200, 1500, 5050, 200, 1500, 5050, -200, -1500, 50, -200, -1500, 50, 200, 1500, 50, -200, 1500, 50, 200],
      "normals": [-0.58, 0.58, 0.58, 0.58, 0.58, 0.58, -0.58, 0.58, -0.58, 0.58, 0.58, -0.58, -0.58, -0.58, -0.58, 0.58, -0.58, -0.58, -0.58, -0.58, 0.58, 0.58, -0.58, 0.58, 0.3, -0.3, 0.9, 0.3, -0.3, -0.9, -0.3, -0.3, 0.9, -0.3, -0.3, -0.9, 0.3, 0.3, -0.9, 0.3, 0.3, 0.9, -0.3, 0.3, -0.9, -0.3, 0.3, 0.9]
  }, matLines);
  var openDoorPanel = getMesh({
      "uvs": [
          [0.38, 0, 0.62, 0, 0.38, 0.25, 0.62, 0.25, 0.38, 0.5, 0.62, 0.5, 0.38, 0.75, 0.62, 0.75, 0.38, 1, 0.62, 1, 0.88, 0, 0.88, 0.25, 0.12, 0, 0.12, 0.25]
      ],
      "name": "doorPanel",
      "faces": [40, 0, 1, 2, 0, 1, 2, 0, 1, 2, 40, 2, 1, 3, 2, 1, 3, 2, 1, 3, 40, 2, 3, 4, 2, 3, 4, 2, 3, 4, 40, 4, 3, 5, 4, 3, 5, 4, 3, 5, 40, 4, 5, 6, 4, 5, 6, 4, 5, 6, 40, 6, 5, 7, 6, 5, 7, 6, 5, 7, 40, 6, 7, 0, 6, 7, 8, 6, 7, 0, 40, 0, 7, 1, 8, 7, 9, 0, 7, 1, 40, 1, 7, 3, 1, 10, 3, 1, 7, 3, 40, 3, 7, 5, 3, 10, 11, 3, 7, 5, 40, 6, 0, 4, 12, 0, 13, 6, 0, 4, 40, 4, 0, 2, 13, 0, 2, 4, 0, 2],
      "vertices": [-1500, 50, 100, 1500, 50, 100, -1500, 5050, 100, 1500, 5050, 100, -1500, 5050, -300, 1500, 5050, -300, -1500, 50, -300, 1500, 50, -300],
      "normals": [-0.58, -0.58, 0.58, 0.58, -0.58, 0.58, -0.58, 0.58, 0.58, 0.58, 0.58, 0.58, -0.58, 0.58, -0.58, 0.58, 0.58, -0.58, -0.58, -0.58, -0.58, 0.58, -0.58, -0.58]
  }, matSolid);

  var openDoorLever = getMesh({
      "uvs": [
          [0, 0.2, 0.12, 0.2, 0, 0.4, 0.12, 0.4, 0.25, 0.2, 0.25, 0.4, 0.38, 0.2, 0.38, 0.4, 0.5, 0.2, 0.5, 0.4, 0.62, 0.2, 0.62, 0.4, 0.75, 0.2, 0.75, 0.4, 0.88, 0.2, 0.88, 0.4, 1, 0.2, 1, 0.4, 0, 0.6, 0.12, 0.6, 0.25, 0.6, 0.38, 0.6, 0.5, 0.6, 0.62, 0.6, 0.75, 0.6, 0.88, 0.6, 1, 0.6, 0, 0.8, 0.12, 0.8, 0.25, 0.8, 0.38, 0.8, 0.5, 0.8, 0.62, 0.8, 0.75, 0.8, 0.88, 0.8, 1, 0.8, 0.06, 1, 0.19, 1, 0.31, 1, 0.44, 1, 0.56, 1, 0.69, 1, 0.81, 1, 0.94, 1, 0, 0, 1, 0, 0, 1, 1, 1]
      ],
      "name": "doorLever",
      "faces": [40, 0, 1, 2, 0, 1, 2, 0, 1, 2, 40, 2, 1, 3, 2, 1, 3, 2, 1, 3, 40, 1, 4, 3, 1, 4, 3, 1, 4, 3, 40, 3, 4, 5, 3, 4, 5, 3, 4, 5, 40, 4, 6, 5, 4, 6, 5, 4, 6, 5, 40, 5, 6, 7, 5, 6, 7, 5, 6, 7, 40, 6, 8, 7, 6, 8, 7, 6, 8, 7, 40, 7, 8, 9, 7, 8, 9, 7, 8, 9, 40, 8, 10, 9, 8, 10, 9, 8, 10, 9, 40, 9, 10, 11, 9, 10, 11, 9, 10, 11, 40, 10, 12, 11, 10, 12, 11, 10, 12, 11, 40, 11, 12, 13, 11, 12, 13, 11, 12, 13, 40, 12, 14, 13, 12, 14, 13, 12, 14, 13, 40, 13, 14, 15, 13, 14, 15, 13, 14, 15, 40, 14, 0, 15, 14, 16, 15, 14, 0, 15, 40, 15, 0, 2, 15, 16, 17, 15, 0, 2, 40, 2, 3, 16, 2, 3, 18, 2, 3, 16, 40, 16, 3, 17, 18, 3, 19, 16, 3, 17, 40, 3, 5, 17, 3, 5, 19, 3, 5, 17, 40, 17, 5, 18, 19, 5, 20, 17, 5, 18, 40, 5, 7, 18, 5, 7, 20, 5, 7, 18, 40, 18, 7, 19, 20, 7, 21, 18, 7, 19, 40, 7, 9, 19, 7, 9, 21, 7, 9, 19, 40, 19, 9, 20, 21, 9, 22, 19, 9, 20, 40, 9, 11, 20, 9, 11, 22, 9, 11, 20, 40, 20, 11, 21, 22, 11, 23, 20, 11, 21, 40, 11, 13, 21, 11, 13, 23, 11, 13, 21, 40, 21, 13, 22, 23, 13, 24, 21, 13, 22, 40, 13, 15, 22, 13, 15, 24, 13, 15, 22, 40, 22, 15, 23, 24, 15, 25, 22, 15, 23, 40, 15, 2, 23, 15, 17, 25, 15, 2, 23, 40, 23, 2, 16, 25, 17, 26, 23, 2, 16, 40, 16, 17, 24, 18, 19, 27, 16, 17, 24, 40, 24, 17, 25, 27, 19, 28, 24, 17, 25, 40, 17, 18, 25, 19, 20, 28, 17, 18, 25, 40, 25, 18, 26, 28, 20, 29, 25, 18, 26, 40, 18, 19, 26, 20, 21, 29, 18, 19, 26, 40, 26, 19, 27, 29, 21, 30, 26, 19, 27, 40, 19, 20, 27, 21, 22, 30, 19, 20, 27, 40, 27, 20, 28, 30, 22, 31, 27, 20, 28, 40, 20, 21, 28, 22, 23, 31, 20, 21, 28, 40, 28, 21, 29, 31, 23, 32, 28, 21, 29, 40, 21, 22, 29, 23, 24, 32, 21, 22, 29, 40, 29, 22, 30, 32, 24, 33, 29, 22, 30, 40, 22, 23, 30, 24, 25, 33, 22, 23, 30, 40, 30, 23, 31, 33, 25, 34, 30, 23, 31, 40, 23, 16, 31, 25, 26, 34, 23, 16, 31, 40, 31, 16, 24, 34, 26, 35, 31, 16, 24, 40, 24, 25, 32, 27, 28, 36, 24, 25, 32, 40, 25, 26, 32, 28, 29, 37, 25, 26, 32, 40, 26, 27, 32, 29, 30, 38, 26, 27, 32, 40, 27, 28, 32, 30, 31, 39, 27, 28, 32, 40, 28, 29, 32, 31, 32, 40, 28, 29, 32, 40, 29, 30, 32, 32, 33, 41, 29, 30, 32, 40, 30, 31, 32, 33, 34, 42, 30, 31, 32, 40, 31, 24, 32, 34, 35, 43, 31, 24, 32, 40, 1, 0, 33, 44, 45, 46, 1, 0, 33, 40, 33, 0, 34, 46, 45, 47, 33, 0, 34, 40, 4, 1, 35, 44, 45, 46, 4, 1, 35, 40, 35, 1, 33, 46, 45, 47, 35, 1, 33, 40, 6, 4, 36, 44, 45, 46, 6, 4, 36, 40, 36, 4, 35, 46, 45, 47, 36, 4, 35, 40, 8, 6, 37, 44, 45, 46, 8, 6, 37, 40, 37, 6, 36, 46, 45, 47, 37, 6, 36, 40, 10, 8, 38, 44, 45, 46, 10, 8, 38, 40, 38, 8, 37, 46, 45, 47, 38, 8, 37, 40, 12, 10, 39, 44, 45, 46, 12, 10, 39, 40, 39, 10, 38, 46, 45, 47, 39, 10, 38, 40, 14, 12, 40, 44, 45, 46, 14, 12, 40, 40, 40, 12, 39, 46, 45, 47, 40, 12, 39, 40, 0, 14, 34, 44, 45, 46, 0, 14, 34, 40, 34, 14, 40, 46, 45, 47, 34, 14, 40],
      "vertices": [-1063.87, 2653.54, 195.78, -1117.41, 2675.72, 195.78, -1030.78, 2686.63, 260.19, -1117.41, 2722.51, 260.19, -1170.95, 2653.54, 195.78, -1204.04, 2686.63, 260.19, -1193.12, 2600, 195.78, -1239.92, 2600, 260.19, -1170.95, 2546.46, 195.78, -1204.04, 2513.37, 260.19, -1117.41, 2524.28, 195.78, -1117.41, 2477.49, 260.19, -1063.87, 2546.46, 195.78, -1030.78, 2513.37, 260.19, -1041.69, 2600, 195.78, -994.9, 2600, 260.19, -1030.78, 2686.63, 339.81, -1117.41, 2722.51, 339.81, -1204.04, 2686.63, 339.81, -1239.92, 2600, 339.81, -1204.04, 2513.37, 339.81, -1117.41, 2477.49, 339.81, -1030.78, 2513.37, 339.81, -994.9, 2600, 339.81, -1063.87, 2653.54, 404.22, -1117.41, 2675.72, 404.22, -1170.95, 2653.54, 404.22, -1193.12, 2600, 404.22, -1170.95, 2546.46, 404.22, -1117.41, 2524.28, 404.22, -1063.87, 2546.46, 404.22, -1041.69, 2600, 404.22, -1117.41, 2600, 378.51, -1117.41, 2675.72, 100, -1063.87, 2653.54, 100, -1170.95, 2653.54, 100, -1193.12, 2600, 100, -1170.95, 2546.46, 100, -1117.41, 2524.28, 100, -1063.87, 2546.46, 100, -1041.69, 2600, 100],
      "normals": [0.67, 0.67, -0.33, 0, 0.94, -0.33, 0.68, 0.68, -0.29, 0, 0.96, -0.29, -0.67, 0.67, -0.33, -0.68, 0.68, -0.29, -0.94, 0, -0.33, -0.96, 0, -0.29, -0.67, -0.67, -0.33, -0.68, -0.68, -0.29, 0, -0.94, -0.33, 0, -0.96, -0.29, 0.67, -0.67, -0.33, 0.68, -0.68, -0.29, 0.94, 0, -0.33, 0.96, 0, -0.29, 0.68, 0.68, 0.29, 0, 0.96, 0.29, -0.68, 0.68, 0.29, -0.96, 0, 0.29, -0.68, -0.68, 0.29, 0, -0.96, 0.29, 0.68, -0.68, 0.29, 0.96, 0, 0.29, 0.3, 0.3, 0.91, 0, 0.42, 0.91, -0.3, 0.3, 0.91, -0.42, 0, 0.91, -0.3, -0.3, 0.91, 0, -0.42, 0.91, 0.3, -0.3, 0.91, 0.42, 0, 0.91, 0, 0, 1, 0, 1, 0, 0.71, 0.71, 0, -0.71, 0.71, 0, -1, 0, 0, -0.71, -0.71, 0, 0, -1, 0, 0.71, -0.71, 0, 1, 0, 0]
  }, matLines);
  var httpCode_0 = getMesh({
      "uvs": [
          [0.375, 0, 0.625, 0, 0.375, 0.25, 0.625, 0.25, 0.375, 0.5, 0.625, 0.5, 0.375, 0.75, 0.625, 0.75, 0.375, 1, 0.625, 1, 0.875, 0, 0.875, 0.25, 0.125, 0, 0.125, 0.25, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0.5, 0, 0.5]
      ],
      "name": "httpCodeFour",
      "faces": [40, 0, 1, 2, 0, 1, 2, 0, 1, 2, 40, 2, 1, 3, 2, 1, 3, 2, 1, 3, 40, 4, 5, 6, 4, 5, 6, 4, 5, 6, 40, 6, 5, 7, 6, 5, 7, 6, 5, 7, 40, 6, 7, 0, 6, 7, 8, 6, 7, 0, 40, 0, 7, 1, 8, 7, 9, 0, 7, 1, 40, 1, 7, 3, 1, 10, 3, 1, 7, 3, 40, 3, 7, 5, 3, 10, 11, 3, 7, 5, 40, 6, 0, 4, 12, 0, 13, 6, 0, 4, 40, 4, 0, 2, 13, 0, 2, 4, 0, 2, 40, 8, 2, 3, 14, 15, 16, 8, 2, 3, 40, 4, 9, 5, 15, 17, 16, 4, 9, 5, 40, 5, 9, 10, 16, 17, 14, 5, 9, 10, 40, 11, 12, 13, 15, 17, 16, 0, 11, 6, 40, 13, 12, 14, 16, 17, 14, 6, 11, 12, 40, 15, 16, 17, 15, 16, 17, 1, 7, 13, 40, 17, 16, 18, 17, 16, 14, 13, 7, 14, 40, 3, 5, 15, 15, 16, 15, 3, 5, 1, 40, 15, 5, 16, 15, 16, 16, 1, 5, 7, 40, 5, 10, 16, 16, 14, 16, 5, 10, 7, 40, 16, 10, 18, 16, 14, 14, 7, 10, 14, 40, 10, 8, 18, 14, 17, 14, 10, 8, 14, 40, 18, 8, 17, 14, 17, 17, 14, 8, 13, 40, 8, 3, 17, 17, 15, 17, 8, 3, 13, 40, 17, 3, 15, 17, 15, 15, 13, 3, 1, 40, 2, 19, 4, 15, 15, 16, 2, 15, 4, 40, 4, 19, 20, 16, 15, 16, 4, 15, 16, 40, 4, 20, 9, 16, 16, 14, 4, 16, 9, 40, 9, 20, 21, 14, 16, 14, 9, 16, 17, 40, 9, 21, 22, 14, 14, 17, 9, 17, 18, 40, 22, 21, 23, 17, 14, 17, 18, 17, 19, 40, 22, 23, 2, 17, 17, 15, 18, 19, 2, 40, 2, 23, 19, 15, 17, 15, 2, 19, 15, 40, 19, 11, 20, 15, 15, 16, 15, 0, 16, 40, 20, 11, 13, 16, 15, 16, 16, 0, 6, 40, 20, 13, 21, 16, 16, 14, 16, 6, 17, 40, 21, 13, 14, 14, 16, 14, 17, 6, 12, 40, 23, 12, 19, 17, 17, 15, 19, 11, 15, 40, 19, 12, 11, 15, 17, 15, 15, 11, 0, 40, 24, 8, 25, 17, 16, 14, 20, 8, 21, 40, 10, 9, 26, 16, 15, 14, 10, 9, 22, 40, 26, 9, 27, 14, 15, 17, 22, 9, 23, 40, 9, 22, 27, 16, 15, 18, 9, 18, 23, 40, 27, 22, 24, 18, 15, 19, 23, 18, 20, 40, 10, 26, 8, 16, 14, 15, 10, 22, 8, 40, 8, 26, 25, 15, 14, 17, 8, 22, 21, 40, 23, 21, 24, 17, 14, 19, 19, 17, 20, 40, 24, 21, 27, 19, 14, 18, 20, 17, 23, 40, 24, 25, 28, 19, 16, 17, 20, 21, 24, 40, 28, 25, 29, 17, 16, 14, 24, 21, 13, 40, 26, 27, 30, 15, 18, 17, 22, 23, 14, 40, 30, 27, 31, 17, 18, 14, 14, 23, 25, 40, 25, 26, 29, 15, 16, 17, 21, 22, 13, 40, 29, 26, 30, 17, 16, 14, 13, 22, 14, 40, 21, 14, 27, 14, 14, 18, 17, 12, 23, 40, 27, 14, 31, 18, 14, 14, 23, 12, 25, 40, 23, 24, 12, 17, 19, 17, 19, 20, 11, 40, 12, 24, 28, 17, 19, 17, 11, 20, 24, 40, 31, 14, 28, 14, 14, 17, 25, 12, 24, 40, 28, 14, 12, 17, 14, 17, 24, 12, 11, 40, 29, 30, 28, 17, 17, 17, 13, 14, 24, 40, 28, 30, 31, 17, 17, 14, 24, 14, 25, 40, 22, 8, 24, 15, 16, 17, 18, 8, 20, 40, 22, 2, 8, 17, 15, 14, 18, 2, 8],
      "vertices": [-100, -1.2e-05, 100, 100, -1.2e-05, 100, -100, 200, 100, 100, 200, 100, -100, 200, -100, 100, 200, -100, -100, 1.2e-05, -100, 100, 1.2e-05, -100, 100, 400, 100, -100, 400, -100, 100, 400, -100, -700, 200, 100, -700, 400, 100, -700, 200, -100, -700, 400, -100, 300, 200, 100, 300, 200, -100, 300, 400, 100, 300, 400, -100, -500, 200, 100, -500, 200, -100, -500, 400, -100, -100, 400, 100, -500, 400, 100, -100, 900, 100, 100, 900, 100, 100, 900, -99.9999, -100, 900, -99.9999, -100, 1200, 100, 100, 1200, 100, 100, 1200, -99.9999, -100, 1200, -99.9999],
      "normals": [-0.577349, -0.577349, 0.577349, 0.577349, -0.577349, 0.577349, -0.301492, -0.301492, 0.904508, 0.301492, -0.301492, 0.904508, -0.301492, -0.301492, -0.904508, 0.301492, -0.301492, -0.904508, -0.577349, -0.577349, -0.577349, 0.577349, -0.577349, -0.577349, 0.301492, 0.301492, 0.904508, -0.301492, 0.301492, -0.904508, 0.301492, 0.301492, -0.904508, -0.727042, 0.242347, 0.642354, -0.727042, 0.242347, -0.642354, 0.577349, 0.577349, 0.577349, 0.577349, 0.577349, -0.577349, 0, -0.707083, 0.707083, 0, -0.707083, -0.707083, 0.22074, 0.106082, -0.969512, -0.301492, 0.301492, 0.904508, 0.22074, 0.106082, 0.969512, -0.060335, -0.172002, 0.983215, 0.707083, 0, 0.707083, 0.707083, 0, -0.707083, -0.060335, -0.172002, -0.983215, -0.351238, 0.702506, 0.618915, -0.351238, 0.702506, -0.618915]
  }, matLines);
  var httpCode_1 = getMesh({
      "uvs": [
          [0.375, 0, 0.625, 0, 0.375, 0.25, 0.625, 0.25, 0.375, 0.5, 0.625, 0.5, 0.375, 0.75, 0.625, 0.75, 0.375, 1, 0.625, 1, 0.125, 0.25, 0.125, 0, 0.875, 0, 0.875, 0.125, 0.625, 0.125, 0.875, 0.25]
      ],
      "name": "httpCodeZero",
      "faces": [40, 0, 1, 2, 0, 1, 2, 0, 1, 2, 40, 2, 1, 3, 2, 1, 3, 2, 1, 3, 40, 2, 3, 4, 2, 3, 4, 2, 3, 4, 40, 4, 3, 5, 4, 3, 5, 4, 3, 5, 40, 4, 5, 6, 4, 5, 6, 4, 5, 6, 40, 6, 5, 7, 6, 5, 7, 6, 5, 7, 40, 6, 7, 0, 6, 7, 8, 6, 7, 0, 40, 0, 7, 1, 8, 7, 9, 0, 7, 1, 40, 8, 9, 10, 10, 11, 2, 8, 9, 10, 40, 9, 11, 10, 11, 0, 2, 9, 11, 10, 40, 6, 0, 9, 11, 0, 11, 6, 0, 9, 40, 9, 0, 11, 11, 0, 0, 9, 0, 11, 40, 11, 0, 10, 0, 0, 2, 11, 0, 10, 40, 0, 2, 10, 0, 2, 2, 0, 2, 10, 40, 7, 12, 1, 12, 13, 1, 7, 12, 1, 40, 1, 12, 13, 1, 13, 14, 1, 12, 13, 40, 7, 5, 12, 12, 15, 13, 7, 5, 12, 40, 3, 1, 13, 3, 1, 14, 3, 1, 13, 40, 5, 3, 14, 15, 3, 15, 5, 3, 14, 40, 14, 3, 15, 15, 3, 3, 14, 3, 15, 40, 3, 13, 15, 3, 14, 3, 3, 13, 15, 40, 15, 13, 16, 3, 14, 3, 15, 13, 16, 40, 13, 12, 16, 14, 13, 3, 13, 12, 16, 40, 16, 12, 17, 3, 13, 15, 16, 12, 17, 40, 12, 5, 17, 13, 15, 15, 12, 5, 17, 40, 17, 5, 14, 15, 15, 15, 17, 5, 14, 40, 18, 19, 20, 15, 3, 15, 18, 19, 20, 40, 20, 19, 21, 15, 3, 3, 20, 19, 21, 40, 15, 16, 22, 3, 3, 3, 15, 16, 22, 40, 16, 17, 22, 3, 15, 3, 16, 17, 22, 40, 22, 17, 23, 3, 15, 15, 22, 17, 23, 40, 17, 14, 23, 15, 15, 15, 17, 14, 23, 40, 14, 15, 24, 15, 3, 15, 14, 15, 24, 40, 24, 15, 25, 15, 3, 3, 24, 15, 25, 40, 15, 22, 25, 3, 3, 3, 15, 22, 25, 40, 25, 22, 21, 3, 3, 3, 25, 22, 21, 40, 22, 23, 21, 3, 15, 3, 22, 23, 21, 40, 21, 23, 20, 3, 15, 15, 21, 23, 20, 40, 23, 14, 20, 15, 15, 15, 23, 14, 20, 40, 20, 14, 24, 15, 15, 15, 20, 14, 24, 40, 25, 21, 19, 3, 3, 3, 25, 21, 19, 40, 20, 24, 18, 15, 15, 15, 20, 24, 18, 40, 9, 8, 6, 11, 10, 11, 9, 8, 6, 40, 6, 8, 4, 11, 10, 4, 6, 8, 4, 40, 4, 8, 24, 10, 10, 15, 4, 8, 24, 40, 24, 8, 18, 15, 10, 15, 24, 8, 18, 40, 8, 10, 18, 10, 2, 15, 8, 10, 18, 40, 18, 10, 19, 15, 2, 3, 18, 10, 19, 40, 10, 2, 19, 2, 2, 3, 10, 2, 19, 40, 19, 2, 25, 3, 2, 3, 19, 2, 25, 40, 2, 4, 25, 2, 4, 3, 2, 4, 25, 40, 25, 4, 24, 3, 4, 15, 25, 4, 24],
      "vertices": [-300, -1.3e-05, 98.6433, 300, -1.3e-05, 98.6433, -300, 200, 101.357, 300, 200, 101.357, -300, 200, -97.2865, 300, 200, -97.2865, -300, 1.1e-05, -100, 300, 1.1e-05, -100, -500, 200, -97.2865, -500, 200, -100, -500, 200, 101.357, -500, 200, 98.6433, 500, 200, -97.2865, 500, 200, 101.357, 300, 1000, -97.2864, 300, 1000, 101.357, 500, 1000, 101.357, 500, 1000, -97.2864, -500, 1000, -97.2864, -500, 1000, 101.357, -300, 1200, -97.2864, -300, 1200, 101.357, 300, 1200, 101.357, 300, 1200, -97.2864, -300, 1000, -97.2864, -300, 1000, 101.357],
      "normals": [-0.296548, -0.721885, 0.625202, 0.296548, -0.721885, 0.625202, 0.302255, 0.294046, 0.906705, -0.302255, 0.294046, 0.906705, 0.30076, 0.308908, -0.902249, -0.30076, 0.308908, -0.902249, -0.297647, -0.712607, -0.635243, 0.297647, -0.712607, -0.635243, -0.810602, 0.250404, -0.529344, -0.999969, 0.001709, -0.00061, -0.716178, -0.29841, 0.630879, -0.390118, -0.920743, 0, 0.718375, -0.295755, -0.629627, 0.716178, -0.298441, 0.630879, -0.301492, -0.301492, -0.904508, -0.301492, -0.301492, 0.904508, 0.717277, 0.297098, 0.630238, 0.717277, 0.297098, -0.630238, -0.717277, 0.297098, -0.630238, -0.717277, 0.297098, 0.630238, -0.297098, 0.717277, -0.630238, -0.297098, 0.717277, 0.630238, 0.297098, 0.717277, 0.630238, 0.297098, 0.717277, -0.630238, 0.301492, -0.301492, -0.904508, 0.301492, -0.301492, 0.904508]
  }, matLines);
  var httpCode_2 = httpCode_0.clone();
  var httpCodeGroup = new THREE.Group();
  var openDoorPivot = new THREE.Object3D();
  var exitDoorPanel = openDoorPanel.clone();
  var exitDoorLever = openDoorLever.clone();
  var exitDoorFrame = openDoorFrame.clone();
  exitDoorPanel.position.z = -15200;
  exitDoorLever.position.z = -15200;
  exitDoorFrame.position.z = -15000;
  var openDoorWires = new THREE.WireframeHelper(openDoorPanel, 0x111111);
  var exitDoorWires = new THREE.WireframeHelper(exitDoorPanel, 0x111111);
  var scene;
  var camera;
  var renderer; 
  function init() {
      /* 
      * The aspect ratio is 16:9, the canvas height then is 56.25%
      **/ 
      var targetElem = document.querySelector('.post__media');
      var targetSize = targetElem.getBoundingClientRect();         
      var targetWidth = targetSize.width;
      var targetHeight = targetSize.width * 0.5625;
                      
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0xffffff, 0.00010);
      /* 
      * Set the camera aspect ratio to be 16:9
      */ 
      camera = new THREE.PerspectiveCamera(55, 16 / 9, 1, 20000);
      camera.position.set(0, 3000, 7500);
      /* 
      * Offset the first and last http code numbers from their initial, center position
      */ 
      httpCode_0.position.x = -1200;
      httpCode_2.position.x = 1600;
      httpCodeGroup.add(httpCode_0);
      httpCodeGroup.add(httpCode_1);
      httpCodeGroup.add(httpCode_2);
      httpCodeGroup.position.set(0,2500, -7500);
      scene.add(httpCodeGroup);   
      
      /* 
      * Change the pivot point of the door by offsetting the original
      * objects and adding them to a seperate object that will act as pivot
      **/
      openDoorLever.position.x = -1500;
      openDoorPanel.position.x = -1500;
      openDoorPivot.position.set(1500, 0, -200);
      openDoorPivot.add(openDoorLever);
      openDoorPivot.add(openDoorPanel);
      
      /* 
      * Add the door and its clone to the scene
      **/ 
      scene.add(openDoorWires);
      scene.add(openDoorPivot);
      scene.add(openDoorFrame);
      
      scene.add(exitDoorWires);
      scene.add(exitDoorPanel);
      scene.add(exitDoorLever);
      scene.add(exitDoorFrame);
      renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          canvas: document.getElementById('post__three-root')
      });
      window.addEventListener('resize', function() {
          var targetSize = targetElem.getBoundingClientRect();
          renderer.setPixelRatio(window.devicePixelRatio);         
          renderer.setSize(targetSize.width, targetSize.width * 0.5625);
      });
      renderer.setPixelRatio(window.devicePixelRatio)      
      renderer.setSize(targetWidth, targetHeight);
  
      animate();
  }
  

  // window.addEventListener('resize', )
  function getMesh(geo, mat) {
      var loader = new THREE.JSONLoader();
      var result = loader.parse(geo);
      return new THREE.Mesh(result.geometry, mat);
  }

  function easeInSine(t, b, c, d) {
      return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  }

  function animate() {
      requestAnimationFrame(animate);
  
      /*
      * Move the camera forwards and rotate the door while the camera's z-position is between 5000 and 0
      * To create an infinite loop, he door is set to its initial position at -2500, the camera at - 7500
      **/
      camera.position.z -= 50;
  
      if (camera.position.z < 5000 && camera.position.z > 0) {
          openDoorPivot.rotation.y = easeInSine((camera.position.z / 50), Math.PI, Math.PI / 2, 50);
      } else if (camera.position.z === -2500) { 
          openDoorPivot.rotation.y = (Math.PI/180) * 0;
      } else if (camera.position.z === -7500) {
          camera.position.z = 7500;
      }
  
      renderer.render(scene, camera);
  }
return {
  init: init
};
})();

Page.init();
