const $ = require('jquery')
const ipcRenderer = require('electron').ipcRenderer
var text1, text2, imagelg, imagesm, timer
let changed = false
let status
var mode = 'Code'

function enrich () {
  if ($('#text1').val().length < 2 || $('#text2').val().length < 2) {
    log('Please enter at least 2 characters', 'error')
    return
  }

  text1 = $('#text1').val()
  text2 = $('#text2').val()
  imagelg = $('#imagelg').val() == 'No Large Image' ? undefined : $('#imagelg').val().toLowerCase()
  imagesm = $('#imagesm').val() == 'No Small Image' ? undefined : $('#imagesm').val().toLowerCase()
  timer = $('#timer').val() == 'Yes Timer'

  status = ipcRenderer.sendSync('args', { text1, text2, imagelg, imagesm, timer })
  if (status.success === true) {
    if (changed) {
      changed = false
      change()
    }
    log(`Successfuly connected for <strong>${status.user}</strong>`)
  } else {
    document.write(
      '<h1>A serious error has occured</h1>',
      '<br> <h3>please report this on the following link </h3>',
      '<br> <a style="font-size: 40px" href="https://github.com/theqoobee/rpcengine/issues">Github.</a>',
      '<br> <h3>Please forward this error too <br> </h3>',
    `<br> <h4 style = 'color: red'> ${status}</h4>`
    )
  }
}

$(document).ready(() => {
  window.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      $('#submit').click()
    }
  })
})

function change () {
  $('#output').toggleClass('bg-danger')
  $('#ico').toggleClass('bg-danger')
  $('input').toggleClass('bg-danger')
  $('select').toggleClass('bg-danger')
  $('input').toggleClass('white')
}

function log (text, type) {
  $('#textOutput').replaceWith(`<p class="text-monospace text-white" id="textOutput">${text};</p>`)
  if (type === 'error' && !changed) { change(); changed = true };
}

ipcRenderer.on('name', (event, args) => {
  console.log(args)
})