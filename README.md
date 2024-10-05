@"
# Africa Moon Visualization

This project uses A-Frame to create a visualization of Africa wrapped around the moon for scale.

## Setup

1. Clone this repository
2. Run `npm install`
3. Open `src/index.html` in a web browser

## Docker

To build and run with Docker:

1. `docker build -t africa-moon-visualization .`
2. `docker run -p 8080:80 africa-moon-visualization`
3. Open `http://localhost:8080` in a web browser
"@ | Out-File -FilePath README.md -Encoding utf8