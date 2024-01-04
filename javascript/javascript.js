const videoCardContainer = document.querySelector('.video-wrapper');
const API_KEY = "AIzaSyCMoRqcm1CEyfIourS9nD74ZkVSe6MhtHo";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

async function fetchPopularVideos() {
    try {
        const response = await fetch(`${BASE_URL}/videos?` + new URLSearchParams({
            part: "snippet,contentDetails,statistics,player",
            chart: "mostPopular",
            maxResults: 40,
            regionCode: 'IN',
            key: API_KEY,
        }));

        if (!response.ok) {
            throw new Error(`Error fetching popular videos: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        data.items.forEach(video => {
            getChannelIcon(video);
        });
    } catch (error) {
        console.error('Error fetching popular videos:', error.message);
    }
}

const getChannelIcon = (videoData) => {
    fetch(`${BASE_URL}/channels?` + new URLSearchParams({
        key: API_KEY,
        part: "snippet",
        id: videoData.snippet.channelId,
    }))
        .then(res => res.json())
        .then(data => {
            videoData.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            makeVideoCard(videoData);
        });
};

const playVideo = (embedHtml) => {
    sessionStorage.setItem("videoEmbedHtml", embedHtml);
    window.location.href = "/video_page.html";
};

const makeVideoCard = (data) => {
    const videoCard = document.createElement('div');
    videoCard.classList.add("video");
    videoCard.innerHTML =
        `
        <div class="video-content">
            <img src="${data.snippet.thumbnails.high.url}" alt="thumbnail" class="thumbnail">
        </div>
        <div class="video-details">
            <div class="channel-logo">
                <img src="${data.channelThumbnail}" alt="channel-icon" class="channel-icon">
            </div>
            <div class="detail">
                <h3 class="title">${data.snippet.title}</h3>
                <div class="channel-name">${data.snippet.channelTitle}</div>
            </div>
        </div>`;

    videoCard.addEventListener('click', () => {
        playVideo(data.player.embedHtml);
    });

    videoCardContainer.appendChild(videoCard);
};

async function fetchData(searchQuery, maxResults) {
    try {
        const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet&type=video`);

        if (!response.ok) {
            throw new Error(`Error fetching videos: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.items);
        return data.items;
    } catch (error) {
        console.error('Error fetching videos:', error.message);
    }
}

async function displayVideos(searchQuery) {
    try {
        const result = await fetchData(searchQuery, 10);
        const videoCards = [];
        result.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.classList.add("video");

            const thumbnailUrl = video.snippet.thumbnails.high.url;
            const title = video.snippet.title;
            const channelTitle = video.snippet.channelTitle;
            const channalIcon = video.snippet.thumbnails.default.url;

            videoCard.innerHTML =
                `<div class="video-content">
                <img src="${thumbnailUrl}" alt="${title}" class="thumbnail">
            </div>
            <div class="video-details">
                <div class="channel-logo">
                    <img src="${channalIcon}" alt="channel-icon" class="channel-icon">
                </div>
                <div class="detail">
                    <h3 class="title">${title}</h3>
                    <div class="channel-name">${channelTitle}</div>
                </div>
            </div>`;
            videoCards.push(videoCard);
        });

        // Clear existing videos before appending new ones
        videoCardContainer.innerHTML = '';
        videoCards.forEach(videoCard => {
            videoCardContainer.appendChild(videoCard);
        });
    } catch (error) {
        console.error('Error displaying videos:', error.message);
    }
}

searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    searchVideos();
});

searchButton.addEventListener('click', searchVideos);

async function searchVideos() {
    const query = searchInput.value.trim();

    if (query) {
        await displayVideos(query);
    } else {
        console.log('Please enter a search query.');
    }
}

// Fetch most popular videos on page load
fetchPopularVideos();
