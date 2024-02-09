import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { cloneTemplate, ensureElement } from './utils/utils';

// const events = new EventEmitter();
// const apiProject = new Api(API_URL);
// const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// const gallery = ensureElement<HTMLElement>('.gallery');

// interface ICardAPI {
// 	id: string;
// 	description: string;
// 	category: string;
// 	price: number;
// 	title: string;
// 	image: string;
// }
// apiProject
// 	.get('/product')
// 	.then((result: { items: ICardAPI[]; total: number }) => {
// 		result.items.forEach((item: ICardAPI) => {
// 			console.log(item);
// 			const cardContent = cloneTemplate(cardTemplate);
// 			const cardImage = cardContent.querySelector('.card__image') as HTMLImageElement;
// 			const cardTitle = cardContent.querySelector('.card__title');
//       const cardText = cardContent.querySelector('.card__text');
//       const cardPrice = cardContent.querySelector('.card__price');
//       cardImage.src = `${CDN_URL}${item.image}`;
//       cardTitle.textContent = item.title;
//       cardText.textContent = item.description
//       cardPrice.textContent = item.price ? item.price.toString() : '750';
//       gallery.appendChild(cardContent);
// 		});
// 	});
