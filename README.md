# ObjectDetectionExpress

This project takes trained model from Microsoft's [Custom Vision](https://www.customvision.ai/) and let's you self host it on your own server.
Because it uses Tenserflow, it is really wobbly to run properly on a server. I recommend using included Dockerfile, bacause it is ready to run anywhere.

## Requirements
* Your CPU has to support **AVX**
* You have to use Linux or WSL2 with kernel 5.10 or higher
* You have to have installed python3 and C++ compilers

## Installation
1. Install required packages
	* Debian based systems: 
		```bash
		sudo apt-get install build-essential wget python3 make gcc libc6-dev
		```
	* Arch based systems:
		```bash
		sudo pacman -S base-devel wget python
		```
	* Other distros are not tested
1. Clone this repo and cd into it
	```bash
	git clone https://github.com/czM1K3/ObjectDetectionExpress
	cd ObjectDetectionExpress
	```
1. Install packages
	```bash
	yarn install
	```
1. Run the server
	* With hot reload
		```bash
		yarn dev
		```
	* Without hot reload
		```bash
		yarn start
		```
1. Test it
	1. Test in browser
		* Open browser and go to http://localhost:3000
		* Choose image and send it
	1. Send POST message
		* Send multipart/form-data request to http://localhost:3000 with **image** 
		```bash
		curl -X POST -F image=@/path/to/image http://localhost:3000/
		```