export default {
    "ip": "143.195.92.181",
    "port": 5804,
    "threads": 4,
    "quadDecimate": 1,
    "quadSigma": 2,
    "decodeSharpening": 0.25,
    "robot": {
        "size": [0.2, 0.1, 0.05]
    },
    "cameras": [
        {
            "name": "Arducam",
            "position": [0, 0, 0.5],
            "rotation": [0, 0, 0],
            "color": 0x0ff00ff,
            "width": 1280,
            "height": 800,
            "fps": 60,
            "exposure": 10,
            "focalX": 900.1952156742097,
            "focalY": 894.6754195471635,
            "centerX": 571.666435101298,
            "centerY": 390.46964731626423,
            "k1": -0.012323347146166098,
            "k2": 0.2380493188668742,
            "p1": 0.013368965698578669,
            "p2": -0.024880499480665952,
            "k3": -0.24749980536005237
        }
    ],
    "apriltags": [
        {
            "id": 1,
            "position": [0.600, 1.448, 2.850],
            "rotation": [0, 180, 0],
            "size": 0.1651
        },
        {
            "id": 2,
            "position": [-0.091, 1.333, 1.300],
            "rotation": [0, 90, 0],
            "size": 0.1651
        },
        {
            "id": 3,
            "position": [1.032, 1.357, 0],
            "rotation": [0, 0, 0],
            "size": 0.1651
        },
        {
            "id": 4,
            "position": [0.613, 1.357, 0],
            "rotation": [0, 0, 0],
            "size": 0.1651
        }
    ]
}