const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const owner = 'd3';
const repo = 'd3-geo-projection';
const folder = 'img'; // The folder in the d3 repo where images are stored

async function fetchProjectionImages() {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    for (const file of data) {
      if (file.type === 'file' && file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const imageUrl = file.download_url;
        const imagePath = path.join(__dirname, 'assets', file.name);
        
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.buffer();
        
        fs.writeFileSync(imagePath, imageBuffer);
        console.log(`Downloaded: ${file.name}`);
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

fetchProjectionImages();
