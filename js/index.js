import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

const $form = document.querySelector('#search-form');
const $input = document.querySelector('input');
const $gallery = document.querySelector('.gallery');
const $loadMoreBtn = document.querySelector('.load-more');

let currentPage;
let shownPictures;

async function formSubmit(event) {
  event.preventDefault();
  if (event.type === 'submit') {
    currentPage = 1;
    shownPictures = 40;
    clearElement($gallery);
  }
  try {
    await axios({
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
        key: '26661197-308a063e24f104dc88fbcb9e0',
        q: `${$input.value}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${currentPage}`,
        per_page: 40,
      },
    }).then(response => {
      response = response.data;

      if (event.type === 'submit') {
        if (response.totalHits > 0) {
          Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
        } else {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
          );
        }
      }
      if (response.totalHits + 39 >= shownPictures) {
        if (response.total !== 0) {
          if (response.totalHits <= shownPictures) {
            $loadMoreBtn.hidden = true;
            renderGallery(response);
            if (event.type === 'click') {
              Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }
          } else {
            renderGallery(response);
            $loadMoreBtn.hidden = false;
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function clearElement(element) {
  element.innerHTML = '';
}

function renderGallery(pictures) {
  const markup = pictures.hits
    .map(pictures => {
      return `<div class="photo-card">
  <a href="${pictures.largeImageURL}"><img src="${pictures.webformatURL}" alt="${pictures.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${pictures.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${pictures.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${pictures.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${pictures.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  let existingGallery = $gallery.innerHTML;
  $gallery.innerHTML = existingGallery + markup;
  disableAPls();
  lightbox.refresh();
}

function loadMore(event) {
  currentPage = currentPage + 1;
  shownPictures = shownPictures + 40;
  formSubmit(event);
}

const inputEvent = $form.addEventListener('submit', formSubmit);
const loadMoreEvent = $loadMoreBtn.addEventListener('click', loadMore);

var lightbox = new SimpleLightbox('.gallery a', {});

function disableAPls() {
  const $a = document.querySelectorAll('a');
  console.log($a);
  console.log($a.length);
  for (let i = 0; i < $a.length; i++) {
    $a[i].addEventListener('click', event => {
      event.preventDefault();
    });
  }
}
