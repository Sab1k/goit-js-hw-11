// import axios from "axios";

const API_KEY = "27641308-8655ee82f3657fe3b5b399be2";
const URL = "https://pixabay.com/api/";

export async function searchPics(query, page) {
    const options = `?key=${API_KEY}&q=${query}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`;
    const search = await axios.get(`${URL}${options}`).then(({ data }) => data);
    return search
}
