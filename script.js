import gallery from './gallery-items.js';

const refs = {
    sectionGalery: document.querySelector('.js-gallery'),
    modal: document.querySelector('.lightbox'),
    modalImg: document.querySelector('.lightbox__image'),
    closeModalBtn: document.querySelector('[data-action="close-lightbox"]'),
    overLay: document.querySelector('.lightbox__overlay'),
  }

// - Создание и рендер разметки по массиву данных и предоставленному шаблону.
  const createGallery = gallery.map(({original,preview,description}={})=>
`<li class="gallery__item">
    <a class="gallery__link"
      href="${original}">
      <img
        class="gallery__image"
        src="${preview}"
        data-source="${original}"
        alt="${description}"/>
    </a>
  </li>
`
).join('');

refs.sectionGalery.innerHTML=createGallery;

// - Реализация делегирования на галерее `ul.js-gallery` и получение `url` большого изображения.

refs.sectionGalery.addEventListener('click', handleGalleryClick);

function handleGalleryClick(ev){
    ev.preventDefault()
    if(ev.target.nodeName !== "IMG") return;
    openModal(ev.target);
    
};

// - Открытие модального окна по клику на элементе галереи.

function openModal(target){
    refs.modal.classList.add("is-open")
    pastModalAtribut(target)

    refs.closeModalBtn.addEventListener('click',modalClose);
    refs.overLay.addEventListener('click',closeOnOverlay);
    document.addEventListener('keydown',closeByEscape);
    document.addEventListener('keydown',flipPhoto);
}

// - Подмена значения атрибута `src` элемента `img.lightbox__image`.
function pastModalAtribut(target) {
    refs.modalImg.src=target.dataset.source;
    refs.modalImg.alt=target.alt
}

// - Закрытие модального окна по клику на кнопку   
// - Очистка значения атрибута `src` элемента `img.lightbox__image`. Это необходимо  для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

function modalClose(){
    refs.modal.classList.remove("is-open")
    refs.modalImg.src="";
    refs.modalImg.alt="";

    refs.closeModalBtn.removeEventListener('click',modalClose)
    refs.overLay.removeEventListener('click',modalClose)
    document.removeEventListener('keydown',closeByEscape);
    document.removeEventListener('keydown',flipPhoto);
}

// =========== Additions
// - Закрытие модального окна по клику на `div.lightbox__overlay`.
function closeOnOverlay(){
    modalClose()
}

// - Закрытие модального окна по нажатию клавиши `ESC`.
function closeByEscape(ev){
    const ESC_KEY_CODE = 'Escape'
    if(ev.key=== ESC_KEY_CODE){
        modalClose()
    } 
}

// - Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

function flipPhoto (ev){
    const LEFT_KEY ='ArrowLeft';
    const RIGHT_KEY='ArrowRight';
    
    let newIndex;
    const currentIndex = gallery.findIndex(card => card.original === refs.modalImg.src)
 
    if (ev.key===LEFT_KEY){
        newIndex=currentIndex-1;
        
            if(newIndex === -1){
                newIndex=gallery.length-1
    } }
    else if (ev.key===RIGHT_KEY){
        newIndex=currentIndex+1;
            if(newIndex === gallery.length) {
                newIndex =0
            }
    }

    refs.modalImg.src = gallery[newIndex].original;
}