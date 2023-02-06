// TODO: NEED HELP UDERSTANDING HOW TO FOLLOW THE STRUCTURE OF AN EXISTING PROJECT

const missingURL = 'http://tinyurl.com/missing-tv'

async function searchShows(query) {
  let response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`
  )

  let shows = response.data.map((result) => {
    let show = result.show
    return {
      id: show.id,
      name: show.name,
      summary: `${show.summary.substring(0, 275)}...`,
      image: show.image ? show.image.medium : missingURL,
    }
  })

  return shows
}

function populateShows(shows) {
  const $showsList = $('#shows-list')

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-4 col-xl-3 gy-3 d-flex Show" data-show-id="${show.id}">
         <div class="card h-100 w-100" data-show-id="${show.id}">
           <img class="card-img-top rounded img-thumbnail" src="${show.image}">
           <div class="card-body d-flex flex-column">
             <h5 class="card-title">${show.name}</h5>
             <p class="text-muted">${show.summary}</p>
             <button class="btn btn-secondary mt-auto align-self-center get-episodes">Episodes</button>
           </div>
         </div>  
       </div>
      `
    )

    $showsList.append($item)
  }
}

$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault()

  let query = $('#search-query').val()
  if (!query) return

  let shows = await searchShows(query)

  populateShows(shows)
})

async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  let episodes = response.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }))

  return episodes
}

function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list')
  $episodesList.empty()

  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `
    )

    $episodesList.append($item)
  }

  $('#episodes-area').show()
}

$('#shows-list').on(
  // TODO: I DONT UNDERSTAND THIS
  'click',
  '.get-episodes',
  async function handleEpisodeClick(evt) {
    let showId = $(evt.target).closest('.Show').data('show-id')
    let episodes = await getEpisodes(showId)
    populateEpisodes(episodes)
  }
)
