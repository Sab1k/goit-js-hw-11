import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix';
import { searchPics } from "./pixabay";

import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';

const form = document.querySelector("#search-form");
const input = document.querySelector("input");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
const backToTopBtn = document.querySelector(".back-to-top");

let page = 1;
let query = "";
let lightbox;

loadMoreBtn.classList.add("isHidden");

const createGallery = async () => {
    let markup;

    try {
        const data = await searchPics(query, page)

        if (page === 1 && data.totalHits) {
            Notify.success(`Hooray! We found ${data.totalHits} images.`)
        }

        if (!data.totalHits) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }

        else {
            checkQuantity(data);
        }

        data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
          
            markup =
                `<div class="photo-card">         
                        <a class="photo-link" href="${webformatURL}">
                            <img src="${largeImageURL}" alt="${tags}" loading="lazy" height="260px"/>
                        </a>                   
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            <span>${likes}</span>
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            <span>${views}</span>
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            <span>${comments}</span>
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            <span>${downloads}</span>
                        </p>
                    </div>
                </div>`;
                
            gallery.insertAdjacentHTML("beforeend", markup);
        })
            addGallery()
        
    } catch (error) { Notify.failure("Oops") }
}

const checkQuantity = (data) => {  
    let imageQuantity = data.hits.length;

    if (imageQuantity >= 40) {           
        loadMoreBtn.classList.remove("isHidden");

    } else {
        Notify.warning ("We're sorry, but you've reached the end of search results.");

        loadMoreBtn.classList.add("isHidden");
        backToTopBtn.classList.remove("isHidden");
    }
}

const checkQuery = () => {
    if (query == "") {
        Notify.failure('Please, enter key word to find');

    } else {
        createGallery();
    } 
}

const addGallery = () => {
   lightbox = new SimpleLightbox('.gallery a', {
            caption: true,
            captionsData: 'alt',
            captionDelay: 250,
        }).refresh();
}

const onSubmit = (e)=>{
    e.preventDefault()
    
    gallery.innerHTML = "";
    query = input.value;
    page = 1;

    checkQuery();

    backToTopBtn.classList.add("isHidden");
    loadMoreBtn.classList.add("isHidden");
    input.value = "";
}
    
const onLoadMore = () => {
    page += 1;
    lightbox.destroy();

    createGallery(query, page);
}

const imageOnClick = (e) => {
    e.preventDefault();

    if (e.target.nodeName !== "IMG") {
        return
    }
}

form.addEventListener("submit", onSubmit)
loadMoreBtn.addEventListener("click", onLoadMore);
gallery.addEventListener("click", imageOnClick);

backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        form.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });