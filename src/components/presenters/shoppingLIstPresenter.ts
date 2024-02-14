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
		this.handleUpdateView();
	}

	handleAddToShoppingList(item: IShoppingListItem): void {
		this._model.addToShoppingList(item);
		this.handleUpdateView();
	}

	handleRemoveFromShoppingList(id: string): void {
		this._model.removeFromShoppingList(id);
		this.handleUpdateView();
	}

	handleOpenModal() {
		this._modal.render({
			content: this._view.render(),
		});
	}

	handleUpdateView() {
		this._view.updateView(this._model.shoppingList);
	}
}
