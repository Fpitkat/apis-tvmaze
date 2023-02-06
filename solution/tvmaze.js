'use strict'

const MISSING_IMAGE_URL = 'https://tinyurl.com/missing-tv'
const TVMAZE_API_URL = 'http://api.tvmaze.com/'

const $showsList = $('#showsList')
const $episodesList = $('#episodesList')
const $episodesArea = $('#episodesArea')
const $searchForm = $('#searchForm')

async function getShowsByTerm(term) {
  const response = await axios({
    url: `${TVMAZE_API_URL}search/shows?q=${term}`,
    method: 'GET',
  })

  return response.data.map((result) => {
    const show = result.show
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    }
  })
}

function populateShows(shows) {
  $showsList.empty()

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    )

    $showsList.append($show)
  }
}

async function searchForShowAndDisplay() {
  const term = $('#searchForm-term').val()
  const shows = await getShowsByTerm(term)

  $episodesArea.hide()
  populateShows(shows)
}

$searchForm.on('submit', async function (evt) {
  evt.preventDefault()
  await searchForShowAndDisplay()
})

async function getEpisodesOfShow(id) {
  const response = await axios({
    url: `${TVMAZE_API_URL}shows/${id}/episodes`,
    method: 'GET',
  })

  return response.data.map((e) => ({
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number,
  }))
}

function populateEpisodes(episodes) {
  $episodesList.empty()

  for (let episode of episodes) {
    const $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `
    )

    $episodesList.append($item)
  }

  $episodesArea.show()
}

async function getEpisodesAndDisplay(evt) {
  const showId = $(evt.target).closest('.Show').data('show-id')

  const episodes = await getEpisodesOfShow(showId)
  populateEpisodes(episodes)
}

$showsList.on('click', '.Show-getEpisodes', getEpisodesAndDisplay)
