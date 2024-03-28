document.addEventListener("DOMContentLoaded", function (event) {

    // бургер меню
    let burger = document.querySelector(".burger-menu");
    let documentBody = document.documentElement;

    function menuOpen() {
        documentBody.classList.toggle("lock");
        documentBody.classList.toggle("menu-open");
    };

    function menuClose() {
        documentBody.classList.remove("menu-open");
        documentBody.classList.remove("lock");
    };


    if (burger) {
        burger.addEventListener("click", function () {
            menuOpen();
        });
    }

    // Закрываем меню, если оно открыто при клике
    const links = document.querySelectorAll('.menu__link');
    if(links.length) {
        links.forEach(link => {
            link.addEventListener("click", function (e) {
                document.querySelector('html').classList.contains("menu-open") ? menuClose() : null;
            });
        });
    }


    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function () {
        const _this = this;
        // массив объектов
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        // массив DOM-элементов
        this.nodes = document.querySelectorAll("[data-da]");
        // наполнение оbjects объктами
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        // массив уникальных медиа-запросов
        this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
            return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }, this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        });
        // навешивание слушателя на медиа-запрос
        // и вызов обработчика при первом запуске
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            // массив объектов с подходящим брейкпоинтом
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
                return item.breakpoint === mediaBreakpoint;
            });
            matchMedia.addListener(function () {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
        if (matchMedia.matches) {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            }
        } else {
            //for (let i = 0; i < оbjects.length; i++) {
            for (let i = оbjects.length - 1; i >= 0; i--) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) {
                    this.moveBack(оbject.parent, оbject.element, оbject.index);
                }
            }
        }
    };
    // Функция перемещения
    DynamicAdapt.prototype.moveTo = function (place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === 'last' || place >= destination.children.length) {
            destination.insertAdjacentElement('beforeend', element);
            return;
        }
        if (place === 'first') {
            destination.insertAdjacentElement('afterbegin', element);
            return;
        }
        destination.children[place].insertAdjacentElement('beforebegin', element);
    }
    // Функция возврата
    DynamicAdapt.prototype.moveBack = function (parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].insertAdjacentElement('beforebegin', element);
        } else {
            parent.insertAdjacentElement('beforeend', element);
        }
    }
    // Функция получения индекса внутри родителя
    DynamicAdapt.prototype.indexInParent = function (parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    // Функция сортировки массива по breakpoint и place 
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    DynamicAdapt.prototype.arraySort = function (arr) {
        if (this.type === "min") {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }

                    if (a.place === "first" || b.place === "last") {
                        return -1;
                    }

                    if (a.place === "last" || b.place === "first") {
                        return 1;
                    }

                    return a.place - b.place;
                }

                return a.breakpoint - b.breakpoint;
            });
        } else {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }

                    if (a.place === "first" || b.place === "last") {
                        return 1;
                    }

                    if (a.place === "last" || b.place === "first") {
                        return -1;
                    }

                    return b.place - a.place;
                }

                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();

    // параллакс при движении мыши
    class MousePRLX {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true,
            }
            this.config = Object.assign(defaultConfig, props);
            if (this.config.init) {
                const paralaxMouse = document.querySelectorAll('[data-prlx-mouse]');
                if (paralaxMouse.length) {
                    this.paralaxMouseInit(paralaxMouse);
                }
            }
        }
        paralaxMouseInit(paralaxMouse) {
            paralaxMouse.forEach(el => {
                const paralaxMouseWrapper = el.closest('[data-prlx-mouse-wrapper]');

                // Коэф. X 
                const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
                // Коэф. У 
                const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
                // Напр. Х
                const directionX = el.hasAttribute('data-prlx-dxr') ? -1 : 1;
                // Напр. У
                const directionY = el.hasAttribute('data-prlx-dyr') ? -1 : 1;
                // Скорость анимации
                const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;


                // Объявление переменных
                let positionX = 0, positionY = 0;
                let coordXprocent = 0, coordYprocent = 0;

                setMouseParallaxStyle();

                // Проверяю на наличие родителя, в котором будет считываться положение мыши
                if (paralaxMouseWrapper) {
                    mouseMoveParalax(paralaxMouseWrapper);
                } else {
                    mouseMoveParalax();
                }

                function setMouseParallaxStyle() {
                    const distX = coordXprocent - positionX;
                    const distY = coordYprocent - positionY;
                    positionX = positionX + (distX * paramAnimation / 1000);
                    positionY = positionY + (distY * paramAnimation / 1000);
                    el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0);`;
                    requestAnimationFrame(setMouseParallaxStyle);
                }
                function mouseMoveParalax(wrapper = window) {
                    wrapper.addEventListener("mousemove", function (e) {
                        const offsetTop = el.getBoundingClientRect().top + window.scrollY;
                        if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
                            // Получение ширины и высоты блока
                            const parallaxWidth = window.innerWidth;
                            const parallaxHeight = window.innerHeight;
                            // Ноль по середине
                            const coordX = e.clientX - parallaxWidth / 2;
                            const coordY = e.clientY - parallaxHeight / 2;
                            // Получаем проценты
                            coordXprocent = coordX / parallaxWidth * 100;
                            coordYprocent = coordY / parallaxHeight * 100;
                        }
                    });
                }
            });
        }
    }

    // Запускаем и добавляем в переменную
    let mousePrlx = new MousePRLX({});



    // параллакс при скролле
    class Parallax {
        constructor(elements) {
            if (elements.length) {
                this.elements = Array.from(elements).map((el) => (
                    new Parallax.Each(el, this.options)
                ));
            }
        }
        destroyEvents() {
            this.elements.forEach(el => {
                el.destroyEvents();
            })
        }
        setEvents() {
            this.elements.forEach(el => {
                el.setEvents();
            })
        }

    }
    Parallax.Each = class {
        constructor(parent) {
            this.parent = parent;
            this.elements = this.parent.querySelectorAll('[data-prlx]');
            this.animation = this.animationFrame.bind(this);
            this.offset = 0;
            this.value = 0;
            this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
            this.setEvents();
        }
        setEvents() {
            this.animationID = window.requestAnimationFrame(this.animation);
        }
        destroyEvents() {
            window.cancelAnimationFrame(this.animationID);
        }
        animationFrame() {
            const topToWindow = this.parent.getBoundingClientRect().top;
            const heightParent = this.parent.offsetHeight;
            const heightWindow = window.innerHeight;
            const positionParent = {
                top: topToWindow - heightWindow,
                bottom: topToWindow + heightParent,
            }
            const centerPoint = this.parent.dataset.prlxCenter ?
                this.parent.dataset.prlxCenter : 'center';

            if (positionParent.top < 30 && positionParent.bottom > -30) {
                // Элемент в исходном положении (0,0), когда родитель находится по отношению к экрану: 
                switch (centerPoint) {
                    // верхней точке (начало родителя соприкасается верхнего края экрана)
                    case 'top':
                        this.offset = -1 * topToWindow;
                        break;
                    // центр экрана (середина родителя в середине экрана)
                    case 'center':
                        this.offset = (heightWindow / 2) - (topToWindow + (heightParent / 2));
                        break;
                    // Начало: нижняя часть экрана = верхняя часть родителя
                    case 'bottom':
                        this.offset = heightWindow - (topToWindow + heightParent);
                        break;
                }
            }

            this.value += (this.offset - this.value) / this.smooth;
            this.animationID = window.requestAnimationFrame(this.animation);

            this.elements.forEach(el => {
                const parameters = {
                    axis: el.dataset.axis ? el.dataset.axis : 'v',
                    direction: el.dataset.direction ? el.dataset.direction + '1' : '-1',
                    coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
                    additionalProperties: el.dataset.properties ? el.dataset.properties : '',
                }
                this.parameters(el, parameters);
            })
        }
        parameters(el, parameters) {
            if (parameters.axis == 'v') {
                el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`
            } else if (parameters.axis == 'h') {
                el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`
            }
        }
    }

    if (document.querySelectorAll('[data-prlx-parent]')) {
        let parallax = new Parallax(document.querySelectorAll('[data-prlx-parent]'));
    }


    // слайдеры
    function initSliders() {
        // Перечень слайдеров
        // Проверяем, есть ли слайдер на стронице
        if (document.querySelector('.masters__slider')) { // Указываем скласс нужного слайдера
            new Swiper('.masters__slider', { // Указываем скласс нужного слайдера
                observer: true,
                observeParents: true,
                slidesPerView: 4,
                spaceBetween: 20,
                autoHeight: false,
                speed: 500,

                // Кнопки "влево/вправо"
                navigation: {
                    prevEl: '.masters__prev',
                    nextEl: '.masters__next',
                },

                // Брейкпоинты

                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                },
            });
        }
        if (document.querySelector('.article__slider')) { // Указываем скласс нужного слайдера
            new Swiper('.article__slider', { // Указываем скласс нужного слайдера
                observer: true,
                observeParents: true,
                slidesPerView: 3,
                spaceBetween: 20,
                autoHeight: false,
                speed: 500,

                // Кнопки "влево/вправо"
                navigation: {
                    prevEl: '.article__prev',
                    nextEl: '.article__next',
                },

                // Брейкпоинты

                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                },
            });
        }
    }

    window.addEventListener("load", function (e) {
        // Запуск инициализации слайдеров
        initSliders();
    });

    // Получение хеша в адресе сайта
 function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
// Модуль плавной проктутки к блоку
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = '';
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = 'header.header';
			headerItemHeight = document.querySelector(headerItem).offsetHeight;
		}
		let options = {
			speedAsDuration: true,
			speed: speed,
			header: headerItem,
			offset: offsetTop,
			easing: 'easeOutQuad',
		};
		// Закрываем меню, если оно открыто
		document.querySelector('html').classList.contains("menu-open") ? menuClose() : null;

		if (typeof SmoothScroll !== 'undefined') {
			// Прокрутка с использованием дополнения
			new SmoothScroll().animateScroll(targetBlockElement, '', options);
		} else {
			// Прокрутка стандартными средствами
			let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
			targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
			targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
			window.scrollTo({
				top: targetBlockElementPosition,
				behavior: "smooth"
			});
		}
	} 
};
// Плавная навигация по странице
function pageNavigation() {
	// data-goto - указать ID блока
	// data-goto-header - учитывать header
	// data-goto-top - недокрутить на указанный размер
	// data-goto-speed - скорость (только если используется доп плагин)
	// Работаем при клике на пункт
	document.addEventListener("click", pageNavigationAction);
	// Если подключен scrollWatcher, подсвечиваем текущий пукт меню
	document.addEventListener("watcherCallback", pageNavigationAction);
	// Основная функция
	function pageNavigationAction(e) {
		if (e.type === "click") {
			const targetElement = e.target;
			if (targetElement.closest('[data-goto]')) {
				const gotoLink = targetElement.closest('[data-goto]');
				const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : '';
				const noHeader = gotoLink.hasAttribute('data-goto-header') ? true : false;
				const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
				const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
				gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				e.preventDefault();
			}
		} else if (e.type === "watcherCallback" && e.detail) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			// Обработка пунктов навигации, если указано значение navigator подсвечиваем текущий пукт меню
			if (targetElement.dataset.watch === 'navigator') {
				const navigatorActiveItem = document.querySelector(`[data-goto]._navigator-active`);
				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
					navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
				} else if (targetElement.classList.length) {
					for (let index = 0; index < targetElement.classList.length; index++) {
						const element = targetElement.classList[index];
						if (document.querySelector(`[data-goto=".${element}"]`)) {
							navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
							break;
						}
					}
				}
				if (entry.isIntersecting) {
					// Видим объект
					// navigatorActiveItem ? navigatorActiveItem.classList.remove('_navigator-active') : null;
					navigatorCurrentItem ? navigatorCurrentItem.classList.add('_navigator-active') : null;
				} else {
					// Не видим объект
					navigatorCurrentItem ? navigatorCurrentItem.classList.remove('_navigator-active') : null;
				}
			}
		}
	}
	// Прокрутка по хешу
	if (getHash()) {
		let goToHash;
		if (document.querySelector(`#${getHash()}`)) {
			goToHash = `#${getHash()}`;
		} else if (document.querySelector(`.${getHash()}`)) {
			goToHash = `.${getHash()}`;
		}
		goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
	}
}
pageNavigation();

});



