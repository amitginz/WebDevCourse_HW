
//Get HTML DOM Element Reference
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const viewToggleBtn = document.getElementById('viewToggleBtn');
let isTableView = true;

//if not exsist in localStorage get empty array else 
//get json text and convert it to object json
let songs = JSON.parse(localStorage.getItem('playlist')) || [];
/**
 * loading the saved song from the locaStorage .
 */
function loadSongs() {
    //reading the saved son from the locaStorage
    const savedSongs = localStorage.getItem('playlist');

    //if there is some saved object
    if (savedSongs) {
        try {
            //parsing savedsongs to songs json object
            songs = JSON.parse(savedSongs);
        } catch (e) {
            console.error("error by loading the song from localStorage", e);
            //in case of error object remain empty
            songs = [];
        }
    } else {
        //if there is no songs the song object remain empty
        songs = [];
    }
}
//call the load songs function that load from storage
loadSongs();
//render the page to show the songs in the page
saveAndRender();

/**
 * identify the id from the youtube URL
 * @param {string} url - URL of YouTube page.
 * @returns {string | null} - identify the video |if doesn't exsist null.
 */
function getYouTubeId(url) {
    if (!url) return null;
    //regExp and match for the URL shape
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    // if the url is in length of 11 :match[2] else null
    return (match && match[2].length === 11) ? match[2] : null;
}

//User click the add Button
form.addEventListener('submit', (e) => {
    //Don't submit the for to the server yet let me handle it here
    e.preventDefault();

    //read Forms Data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rank = document.getElementById('Rank').value;

    //critical check -if this is an update
    const existingId = document.getElementById('songId').value;

    //
    const videoId = getYouTubeId(url);
    //if there is no video url show alert
    if (!videoId) {
        alert("youtube url is invalid...try again");
        return; // 
    }
    //if there is no title or rank show alert
    if (!title || !rank) {
        alert("please add title or rank");
        return;
    }
    // **********************************

    if (existingId) {
        //the id allready exsist -it is un update
        updateSong(Number(existingId), title, url, rank);
    } else {
        //TODO VALIDATE FIELDS
        //create JSON OBJ Based on URL title
        const newsong = {
            id: Date.now(),  // Unique ID
            title: title,
            videoId: videoId,
            url: url,
            rank: rank,
            dateAdded: Date.now()
        };
        songs.push(newsong);
    }


    saveAndRender();
    //TO DO SAVE  AND RERENDER 

    form.reset();
});
//Save to Local storage and render UI table
function saveAndRender() {

    localStorage.setItem('playlist', JSON.stringify(songs));

    //TODO RELOAD UI    
    renderSongs();
    // ⭐⭐ שינוי: קורא לפונקציה המרכזית לבחירת התצוגה
    updateViewDisplay();

}


//show the songs list in the website 
function renderSongs() {
    list.innerHTML = ''; // Clear current list container

    let tableHtml = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col" style="width: 10%;">picture</th>
                    <th scope="col" style="width: 30%;">Title</th>
                    <th scope="col" style="width: 20%;">Link</th>
                    <th scope="col" style="width: 10%;">rank</th>
                    <th scope="col" class="text-end" style="width: 20%;">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    songs.forEach(song => {
        const thumbnailSrc = `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`;
        // נשתמש ב-string literal לבניית ה-HTML של השורות
        tableHtml += `
            <tr>
                <td><img src="${thumbnailSrc}" alt="Thumbnail for ${song.title}" style="width: 80px; height: auto;"></td>
                <td><strong>${song.title}</strong></td>
                <td>
                    <a href="${song.url}" target="_blank" class="text-info me-2">Watch</a>
                    <button class="btn btn-sm btn-info" onclick="playSong('${song.videoId}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                </td>
                <td>${song.rank}</td> 
                <td class="text-end">
                    <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tableHtml += `</tbody></table>`;
    list.innerHTML = tableHtml;
}

//render cards
//  Bootstrap -create cards show in the website
function renderCards() {
    list.innerHTML = ''; // Clear current list container

    // יוצר מיכל רספונסיבי לרשת (Row)
    const cardRow = document.createElement('div');
    cardRow.className = 'row g-3';

    songs.forEach(song => {
        const thumbnailSrc = `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`;

        // 3 in a row in big screen ,4 in a row in meduim screen.
        const cardCol = document.createElement('div');
        cardCol.className = 'col-xl-3 col-lg-4 col-sm-6';

        cardCol.innerHTML = `
            <div class="card h-100 bg-dark text-white border-secondary">
                <img src="${thumbnailSrc}" class="card-img-top" alt="Thumbnail for ${song.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text small mb-2">Rank: <strong>${song.rank}</strong></p>
                    
                    <div class="mt-auto d-flex flex-wrap justify-content-between pt-2">
                        <div>
                            <button class="btn btn-sm btn-info me-1 mb-1" onclick="playSong('${song.videoId}')">
                                <i class="fas fa-play"></i> Play
                            </button>
                            <a href="${song.url}" target="_blank" class="btn btn-sm btn-light mb-1">
                                Watch
                            </a>
                        </div>
                        
                        <div class="text-end">
                            <button class="btn btn-sm btn-warning me-1" onclick="editSong(${song.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cardRow.appendChild(cardCol);
    });

    list.appendChild(cardRow);
}

//delete song from the list
function deleteSong(id) {
    if (confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

//edit song name by id of the song
function editSong(id) {

    const songToEdit = songs.find(song => song.id === id);

    //show the song value that need to be update
    document.getElementById('title').value = songToEdit.title;
    document.getElementById('url').value = songToEdit.url;
    document.getElementById('Rank').value = songToEdit.rank;
    document.getElementById('songId').value = songToEdit.id; // Set Hidden ID

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success', 'btn-warning');
}

//update the song in the table
function updateSong(id, title, url, rank) {
    // 1. Calculate the new video ID from the updated URL
    const newVideoId = getYouTubeId(url);
    if (!newVideoId) {
        // If the URL is invalid during an update, stop and alert
        alert("The new YouTube URL is invalid. Update aborted.");
        return;
    }

    const index = songs.findIndex(song => song.id == id);
    if (index === -1) {
        console.error("erorr:didn't find song to update");
        return;
    }
    //update songs table by the values we update
    songs[index].title = title;
    songs[index].url = url;
    songs[index].rank = rank;
    songs[index].videoId = newVideoId;

    document.getElementById('songId').value = '';
    //change the button name from update to add
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    submitBtn.classList.replace('btn-warning', 'btn-success');

}

//get radio buttons
const radioButtons = document.querySelectorAll('input[name="sortOption"]');

// add listener foe each radio button
radioButtons.forEach(radio => {
    radio.addEventListener('change', function () {
        //call sort function
        const selectedValue = this.value;
        performSorting(selectedValue);
    });
});
//function that sort the songs objects by the radio buttons
function performSorting(sortKey) {
    songs.sort((a, b) => {
        if (sortKey === 'name') {
            // sort by A-Z
            return a.title.localeCompare(b.title, 'he', { sensitivity: 'base' });
        } else if (sortKey === 'date') {
            //sort by Date
            return b.dateAdded - a.dateAdded;
        } else if (sortKey === 'rating') {
            // sort by ranking
            return parseFloat(b.rank) - parseFloat(a.rank);
        }
        return 0;
    });

    saveAndRender();
}

//call for first sort of the table
const defaultSortElement = document.querySelector('input[name="sortOption"]:checked');
if (defaultSortElement) {
    //predform sorting bof the table
    performSorting(defaultSortElement.value);
}


/**
 * open url address for small popup window
 * @param {string} videoId - מזהה הסרטון (11 תווים) של YouTube.
 */
function playSong(videoId) {
    //embedded url address for popup window
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const windowName = 'YouTubePlayer';
    const windowFeatures = 'width=640,height=390,scrollbars=no,resizable=yes,status=no,toolbar=no,menubar=no,location=no';

    // open new window
    window.open(embedUrl, windowName, windowFeatures);
}


/**
 * switch between cardsShow and table Show
 */
function toggleView() {
    isTableView = !isTableView; // switch the state of the view(cards or table)
    updateViewDisplay();
}

/**
 * main function for render the song isTableView
 */
function updateViewDisplay() {
    //update button acording to the show status(cards,table)
    if (viewToggleBtn) {
        if (isTableView) {
            // if we are in table show cardsshow
            viewToggleBtn.innerHTML = '<i class="fas fa-th-large"></i> Cards View';
        } else {
            // if we are in cards , show table
            viewToggleBtn.innerHTML = '<i class="fas fa-list-alt"></i> Table View';
        }
    }

    //acutal render the songs
    if (isTableView) {
        renderSongs(); // table show
    } else {
        renderCards(); // cards show
    }
}