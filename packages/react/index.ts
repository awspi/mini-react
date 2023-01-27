import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher'
import { isValidElement as isValidElementFn, jsx, jsxDEV } from './src/jsx'

export const useState: Dispatcher['useState'] = (initialState) => {
	const dispatcher = resolveDispatcher()
	return dispatcher.useState(initialState)
}

//内部数据共享层  对应原版的__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
export const __SECRET_INTERNALS = {
	currentDispatcher
}

export const version = '0.0.0'
//todo 根据环境来决定使用jsx 还是 jsxDEV
// export const createElement = jsxDEV
export const createElement = jsx
export const isValidElement = isValidElementFn
