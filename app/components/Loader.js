export function Loader(){
    const $loader = document.createElement('img');
    $loader.src = 'app/assets/loader.svg';
    $loader.alt = 'Loader';
    $loader.classList.add('loader');
    return $loader;
}