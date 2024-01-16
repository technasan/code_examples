import React from 'react'
import { observer } from 'mobx-react-lite'
import { useOrdersContext } from '@store/Orders/store'
import { Pagination, Space } from 'antd'
import { ORDERS_PAGINATION_COL } from '@components/Orders/constants/orderConstants'
import api from '@components/Orders/API/OrdersApi'
import { runInAction } from 'mobx'
import loco from '@store/AppInitializer/store'
const { translate } = loco

const OrdersPagination = () => {
	const store = useOrdersContext()
	let total = store.productsCount
	store.totalPages = Math.ceil(total / ORDERS_PAGINATION_COL)
	let newStart = 0
	const onChangeHandler = async (page, pageSize) => {
		newStart = (page - 1) * pageSize
		const data = await api.fetchProductsFromCategory(store.categoryId, newStart, ORDERS_PAGINATION_COL)

		runInAction(() => {
			store.products = data.list
			store.productsCount = data.count
			store.showPage = page
			store.totalPages = Math.ceil(store.productsCount / pageSize)
		})
	}

	// ниже - pagination-tip - текст Страница 1 из 34 · Товары 5 из 231
	const RenderPaginator = observer(() => {
		if (store.isPaginator) {
			return (
				<div className='d-flex-center flex-direction-column'>
					<Pagination
						className='app-pagination'
						total={total}
						size='small'
						defaultCurrent={store.showPage}
						pageSize={ORDERS_PAGINATION_COL}
						showSizeChanger={false}
						onChange={(page, pageSize) => {
							onChangeHandler(page, pageSize)
						}}
						//onChange={onChangeHandler.bind(null, page, pageSize)}
					/>
					<div className='pagination-tip'>
						{translate('PAGINATION_PAGE')} {store.showPage} {translate('PAGINATION_OF')} {store.totalPages}&nbsp;·&nbsp;
						{translate('OPERATION_DETAILS_GOODS')} {store.products.length} {translate('PAGINATION_OF')} {total}
					</div>
				</div>
			)
		}
		return null
	})

	return <RenderPaginator />
}

export default observer(OrdersPagination)
