import { ICard } from '../../types';
import { IEvents } from '../base/events';
import { Card } from '../common/card';

export class CardView extends Card {
	constructor(container: HTMLElement, card: ICard, events: IEvents) {
		super(container, card, events);
		this.container.addEventListener('click', (event) => {
			this.events.emit('card:select', { ...this.card });
		});
	}
}
