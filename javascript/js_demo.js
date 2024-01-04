const videoCardContainer = document.querySelector('.video-wrapper')

let api_key = "AIzaSyCoWtzi7Fwa3ysNaE4K5L0TQXusfDB7Zzo";
let video_http = "https://www.googleapis.com/youtube/v3/videos?"
let channel_http = "https://www.googleapis.com/youtube/v3/channels?"

fetch(
    video_http + new URLSearchParams({
        part: "snippet,contentDetails,statistics,player",
        chart: "mostPopular",
        maxResults: 40,
        regionCode: 'IN',
        key: api_key,
    })
)
    .then((res) => res.json())
    .then((data) => {
        data.items.forEach((items) => {
            getChannelIcon(items);
        });
        console.log(data)
    })
    .catch((err) => console.log(err));

    
const getChannelIcon = (video_data) => {
    fetch(
        channel_http + new URLSearchParams({
            key: api_key,
            part: "snippet",
            id: video_data.snippet.channelId,
        })

    )
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            makeVideoCard(video_data);
        });
}

const playVideo = (embedHtml) => {
    sessionStorage.setItem("videoEmbedHtml", embedHtml);
    window.location.href = "/video_page.html"
}

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

    videoCardContainer.appendChild(videoCard)

}