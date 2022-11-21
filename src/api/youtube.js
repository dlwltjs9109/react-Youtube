export default class Youtube {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async search(keyword) {
        // 함수 앞에 #을 붙히면 프라이빗 함수, 클래스 내부에선 호출가능 외부에선 x
        return keyword ? this.#searchByKeyword(keyword) : this.#mostPopular();
    }
    async channelImageURL(id) {
        return this.apiClient
            .channels({
                params: {
                    part: 'snippet',
                    id: id,
                },
            })
            .then((res) => res.data.items[0].snippet.thumbnails.default.url);
    }
    
    async relatedVideos(id) {
        return this.apiClient
            .search({
                params: {
                    part: 'snippet',
                    maxResults: 25,
                    type: 'video',
                    relatedToVideoId: id,
                },
            })
            .then((res) => res.data.items)
            .then((items) => items.map((item) => ({...item, id: item.id.videoId})));
    }

    async #searchByKeyword(keyword) {
        return this.apiClient
            .search({
                params: {
                    part: 'snippet',
                    maxResults: 25,
                    type: 'video',
                    q: keyword,
                },
            })
            .then((res) => res.data.items)
            .then((items) => items.map((item) => ({...item, id: item.id.videoId})));
    }

    async #mostPopular() {
        return this.apiClient
            .videos({
                params: {
                    part: 'snippet',
                    maxResults: 25,
                    chart: 'mostPopular',
                },
            })
            .then((res) => res.data.items);
    }
}