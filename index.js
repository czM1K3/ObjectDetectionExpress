const express = require("express");
const cvstfjs = require('@microsoft/customvision-tfjs-node');
const multer = require("multer");
const fs = require("fs");

const labels = fs.readFileSync('customvision/labels.txt', 'utf8').split('\n');

const upload = multer({
	limits: {
		fileSize: 4 * 1024 * 1024,
	},
});

const model = new cvstfjs.ObjectDetectionModel();
const loadModel = async () => {
    await model.loadModelAsync('file://customvision/model.json');
}
loadModel();

const app = express();
const port = 3000;

app.get("/", (_req, res) => {
	res.sendFile(`${__dirname}/index.html`)
});

app.post("/", upload.single("image"), async (req, res) => {
	try {
		const buffer = req.file.buffer;
		const result = await model.executeAsync(buffer);
		const sizes = result[0].map(x => x.length > 2 ? (((x[2]-x[0])+(x[3]-x[1]))/2):null).filter(x => x);
		const formated = Array(result[0].length);
		for (let i = 0; i < formated.length; i++) {
			formated[i] = {
				type: labels[result[2][i]],
				precision: result[1][i],
				position: result[0][i].length > 2 ? {
					x: result[0][i][0] + ((result[0][i][2] - result[0][i][0]) / 2),
					y: result[0][i][1] + ((result[0][i][3] - result[0][i][1]) / 2),
				} : {
					x: result[0][i][0],
					y: result[0][i][1],
				},
			}
		}
		res.json({size: sizes.length > 0 ? (sizes.reduce((a, b) => a + b, 0) / sizes.length) : 0, data: formated});
	} catch (e) {
		res.statusCode = 500;
		res.json({
			status: "Internal Server Error",
			error: e.message,
		});
	}
});

app.listen(port, () => {
	console.log(`Object Detection app is listening on http://localhost:${port}`);
});