import { Presenter } from '../base/presenter';
import { IAppModel } from '../AppModel';
import { Modal } from '../common/modal';
import { IShoppingListItem } from '../../types';
import { IEvents } from '../base/events';
import { ShoppingListView } from '../view/shoppingListView';

export class ShoppingListPresenter extends Presenter<ShoppingListView> {
	constructor(
		model: IAppModel,
		events: IEvents,
		modal: Modal,
		view: ShoppingListView
	) {
		super(model, events, modal, view);
		this.view.updateView(this.model.shoppingList);
	}

	handleAddToShoppingList(item: IShoppingListItem): void {
		this.model.addToShoppingList(item);
		this.view.updateView(this.model.shoppingList);
	}

	handleRemoveFromShoppingList(id: string): void {
		this.model.removeFromShoppingList(id);
		this.view.updateView(this.model.shoppingList);
	}

	handleOpenModal() {
		this.modal.render({
			content: this.view.render(),
		});
	}

	handleUpdateView() {
		this.view.updateView(this.model.shoppingList);
	}
}
