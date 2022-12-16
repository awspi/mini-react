import { Container } from 'hostConfig'
import { ReactElementType } from 'shared/ReactTypes'
import { FiberNode, FiberRootNode } from './fiber'
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './UpdateQueue'
import { scheduleUpdateOnFiber } from './workLoop'
import { HostRoot } from './workTags'

// ReactDOM.createRoot() 内部执行
/**
 * 创建整个项目的根节点 fiberRootNode
 * 将 fiberRootNode 与 hostRootFiber 连接起来
 * @param container
 * @returns
 */
export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null)
	const root = new FiberRootNode(container, hostRootFiber)
	hostRootFiber.updateQueue = createUpdateQueue()
	return root
}
// .render 内部执行
/**
 * 创建update 并将 update 添加到updateQueue中
 * @param element
 * @param root
 * @returns
 */
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current
	// 首屏渲染更新
	const update = createUpdate<ReactElementType | null>(element)
	// 更新插入到hostRootFiber的updateQueue
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	)
	// 在fiber中调度update
	scheduleUpdateOnFiber(hostRootFiber)
	return element
}
