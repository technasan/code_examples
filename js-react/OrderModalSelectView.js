import React from 'react'
import { observer } from 'mobx-react-lite'
import { useOrdersContext } from '@store/Orders/store'
import OrderModalCategoryList from '../Lists/OrderModalCategoryList/OrderModalCategoryList'
import OrderModalCategoryProductsView from './OrderModalCategoryProductsView'
import ProductsOrLoaderView from './ProductsOrLoaderView'
import OrdersPagination from '@components/Orders/Navigation/OrdersPagination'

// Выбираем нужный компонент для отображения
const OrderModalSelectView = () => {
	const store = useOrdersContext()

	// При клике на категорию в хранилище передается ее ID
	// если categoryId существует, то отображаем товары (и показываем пагинацию)
	// если поиск идет по всем товарам, то проверка срабатывает
	// на allCategory
	if (store.categoryId || store.allCategory) {
		return ( 
		<OrderModalCategoryProductsView>
			<ProductsOrLoaderView />
			<OrdersPagination />
		</OrderModalCategoryProductsView>
		)
	}
	// иначе отображаем список категорий
	return <OrderModalCategoryList />
}

export default observer(OrderModalSelectView)
