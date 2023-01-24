import { FiberNode } from './fiber'

//函数式组件 通过执行来获取children
export function renderWithHooks(wip: FiberNode) {
	const Component = wip.type
	const props = wip.pendingProps
	//* 函数式组件,通过执行来获取children
	const children = Component(props)
	return children
}
