import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { ReactElementType } from 'shared/ReactTypes'
import { createFiberFromELement, FiberNode } from './fiber'
import { Placement } from './fiberFlags'
import { HostText } from './workTags'
// 对比子节点 current fiberNode 和reactElement 生成对应wip fiberNode
function childReconciler(shouldTrackEffect: boolean) {
	// false 不追踪副作用
	// 使用闭包 返回不同的reconcileChildFibers的实现
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		// 根据 ReactElement 创建fiberNode
		const fiber = createFiberFromELement(element)
		fiber.return = returnFiber
		return fiber
	}
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null)
		fiber.return = returnFiber
		return fiber
	}
	// 插入单一节点
	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffect && fiber.alternate === null) {
			// alternate===null->currentFiber===null 首屏渲染的情况
			fiber.flags |= Placement
		}
		return fiber
	}
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前fiber类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					)
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型')
					}
					break
			}
		}
		//TODO 多节点的情况 ul>li*3

		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			)
		}
		// return fiberNode
		return null
	}
}

export const reconcileChildFibers = childReconciler(true)
export const mountChildFibers = childReconciler(false)
