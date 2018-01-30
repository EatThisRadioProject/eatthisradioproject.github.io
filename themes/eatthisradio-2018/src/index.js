import $ from 'jquery'
import Shuffle from 'shufflejs'

// Initializes the grid
function initGrid() { 
  if ( $('.grid').length ) {
    new Shuffle($('.grid'), {
      itemSelector: '.post-item',
      columnWidth: () => {
        return $(window).width()/4;
      }
    });
  }
}

// Detect link clicks.
$(document).on('click', '.link', e => {
  e.preventDefault()
  fetch(e.target.href).then(r => {
    return r.text()
  }).then(t => {
    let html = $.parseHTML(t);
    let tempDom = $('<div></div>').append($.parseHTML(t))
    let title = tempDom.find('title').text()
    let content = tempDom.find('#content').html()	
    if (title !== '') {
      $(document).attr('title',title);
    }

    if (!content || content === "" || content === " ") return
    $('#content').html(content)
    initGrid()  
    window.history.pushState({
      html: content,
      title: title
    }, title, e.target.href);
  })
})

// Mixcloud player
$(document).on('click', '.mixcloud-play-button', e => {
  e.preventDefault()
  var feed = e.target.href.replace(/https?:\/\/www.mixcloud.com\//, '/')
  feed = (feed.endsWith('/')) ? feed : feed+'/'
  feed = encodeURIComponent(decodeURIComponent(feed))
	let iframeHtml = '<iframe id="mixcloud-player" class="fixed bottom-0 left-0 z-999" width="100%" height="60" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=1&feed=' + feed + '" frameborder="0"></iframe>'

  // Load in iframe player
  $('#mixcloud-container').data('mixcloud', e.target.href).empty().append(iframeHtml)
  $(document.body).addClass('mixcloud-playing')
})

// Detect browser back button
window.addEventListener('popstate', e => {
  e.preventDefault()
  console.log(e)
  $('#content').html(e.state.html)
  $(document).attr('title', e.state.title)
	setTimeout(initGrid)
})

// set initial state.
window.history.replaceState({
  html: $('#content').html(),
  title: $(document).attr('title')
}, "", window.location.href)

// initialize grid for the first time.
initGrid()

