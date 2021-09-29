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

app.post("/", upload.single("image"), async (req, res) => {
	try {

		const buffer = req.file.buffer;
		console.log(model);
		const result = await model.executeAsync(buffer);
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
		res.json(formated);
	} catch (e) {
		res.statusCode = 500;
		res.write("Internal Server Error\n");
		res.write(`Error: "${e.message}"`);
		res.end();
	}
});

app.listen(port, () => {
	console.log(`Object Detection app is listening on http://localhost:${port}`);
});