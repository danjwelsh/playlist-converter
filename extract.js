/**
 * Convert music to spotify playlists by pasting output into http://www.playlist-converter.net/
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Check for correct argments
if (!process.argv[2] || !process.argv[3]) {
  console.log('Usage: node extract.js <input directory> <output directory>')
  process.exit(1)
}

// Set input and output
const input = process.argv[2]
const output = process.argv[3]

// Set folder path for input
const folderPath = path.join(__dirname, '/' + input)

// Get files from input folder
fs.readdirSync(folderPath).filter(function (file) {
  return (file.indexOf('.txt') !== 0)

  // For each file...
}).forEach((file) => {
  // get file name and absolute path
  const fileName = file.split('.')[0]
  const filePath = folderPath + '/' + file
  let tracks = []

  // create line reader
  const lineReader = readline.createInterface({
    input: fs.createReadStream(filePath)
  })

  // for each new line
  lineReader.on('line', function (line) {
    // get title and artist from file
    let title = line.split('\t')[0]
    let artist = line.split('\t')[1]

    // remove '(feat. ...)' from title
    title = title.replace(/\(feat.[^)]*\)/, '')
    // remove [feat. ...]
    title = title.replace(/\[feat.[^]*\]/, '')

    // create track object
    let track = {
      title: title,
      artist: artist
    }

    // push to array of all tracks in files
    tracks.push(track)
  })
  // on closing of line reader
  lineReader.on('close', (line) => {
    let trackText = ''

    // push into a string, removing new line character at the end of the array
    for (let i = 1; i < tracks.length; i++) {
      if (i === tracks.length - 1) {
        trackText += `${tracks[i].title} - ${tracks[i].artist}`
      } else {
        trackText += `${tracks[i].title} - ${tracks[i].artist}\n`
      }
    }

    // Write the output to a file
    fs.writeFile(output + '/' + fileName + '.txt', trackText, function (err) {
      if (err) return console.log(err)
      console.log('Saved ' + fileName)
    })
  })
})
