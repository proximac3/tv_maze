/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 * 
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

async function searchShows(query) {
  const respond = await axios.get('https://api.tvmaze.com/search/shows', { params: { q: query } })
  let results = []

  let shows = respond.data

  shows.forEach(elem => {
    if (elem.show.image) {
      results.push({
        id: elem.show.id,
        name: elem.show.name,
        summary: elem.show.summary,
        image: elem.show.image.medium
      })
    }

  })

  // console.log(results);

  return results
}

searchShows('friends')


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="show_episode">Episode</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  // $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // get request for episodes using id input
  const results = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  //return results data
  return results.data
}



async function populateEpisode(episode) {
  //Select episode list to append episodes data.
  let episodeList = document.querySelector('#episodes-list')
  
  //await episoed object
  let episodeListObject = await episode

  //Loop episode data, create a new li with extracted data and append to DOM

  episodeListObject.forEach(elem => {
    let newLi = document.createElement('li')
    newLi.innerText = `Season ${elem.season}, Number: ${elem.number}, Episode Name: ${elem.name}`

    episodeList.append(newLi)
  })
}


document.querySelector('#shows-list').addEventListener('click', function (e) {
  //get id number of show
  let episodeNumber = e.target.parentElement.parentElement.getAttribute('data-show-id')

  //get episodes of show using spisode id number
  let episodes = getEpisodes(episodeNumber)

  //append episodes to dom
  populateEpisode(episodes)

})