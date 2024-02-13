import { ICard, IOrderData, ISuccessOrder } from '../types';
import { Api } from './base/api';

export interface IProjectApi {
	getCardList: () => Promise<ICard[]>;
	getCard: (id: string) => Promise<ICard>;
	postOrder: (order: IOrderData) => Promise<ISuccessOrder>;
}

export class ProjectApi extends Api implements IProjectApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<ICard[]> {
		return this.get('/product').then(
			(response: { total: number; items: ICard[] }) => {
				return response.items.map((card) => ({
					...card,
					image: this.cdn + card.image,
				}));
			}
		);
	}

	getCard(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((data: ICard) => ({
			...data,
			image: this.cdn + data.image,
		}));
	}

	postOrder(order: IOrderData): Promise<ISuccessOrder> {
		return this.post('/order', order).then((data: ISuccessOrder) => data);
	}
}
