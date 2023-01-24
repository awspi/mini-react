import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes'
import { Flags, NoFlags } from './fiberFlags'
import { FunctionComponent, HostComponent, WorkTag } from './workTags'
import { Container } from 'hostConfig'
export class FiberNode {
	// ?实例
	type: any
	tag: WorkTag
	key: Key
	stateNode: any
	ref: Ref
	// ?树状结构
	return: FiberNode | null
	sibling: FiberNode | null
	child: FiberNode | null
	index: number
	// ?工作单元
	pendingProps: Props
	memoizedProps: Props | null
	memoizedState: any
	alternate: FiberNode | null
	updateQueue: unknown
	// ?副作用
	flags: Flags
	subtreeFlags: Flags
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// ?实例
		this.tag = tag
		this.key = key
		// 比如HostComponent是一个<div> stateNode就是div的DOM
		this.stateNode = null
		// 例如FunctionComponent 就是function本身
		this.type = null

		this.ref = null
		// ?树状结构
		// 指向父fiberNode 作为一个工作单元 下一个就是他的父节点
		this.return = null
		// 兄弟节点
		this.sibling = null
		// 子节点
		this.child = null
		// 节点的index 例如 <ul><li index=0/><li index=1/></li>
		this.index = 0
		// ?工作单元
		// 开始时的props
		this.pendingProps = pendingProps
		// 更新后的props
		this.memoizedProps = null
		this.memoizedState = null
		// 用于当前fiberNode的切换 指向current or workInProgress
		this.alternate = null
		// 指向updateQueue
		this.updateQueue = null
		// ?副作用
		this.flags = NoFlags
		// 子树的flags
		this.subtreeFlags = NoFlags
	}
}

//根FiberNode节点
export class FiberRootNode {
	//宿主环境挂载的节点 ReactDOM.createRoot(rootElement)的 rootElement
	container: Container
	//指向HostRootFiber
	current: FiberNode
	// 更新完成后的hostRootFiber
	finishedWork: FiberNode | null
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container
		this.current = hostRootFiber
		hostRootFiber.stateNode = this
		this.finishedWork = null
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	// 双缓存机制 -> 传入fiberNode应该返回alternate
	// WorkInProgress 缩写为wip
	let wip = current.alternate
	//对于首屏渲染 wip 为null
	if (wip === null) {
		// mount
		// 如果不存在就新建一个=current
		wip = new FiberNode(current.tag, pendingProps, current.key)
		wip.stateNode = current.stateNode
		wip.alternate = current
		current.alternate = wip
	} else {
		// update
		wip.pendingProps = pendingProps
		// 清除副作用
		wip.flags = NoFlags
		wip.subtreeFlags = NoFlags
	}
	wip.type = current.type
	wip.updateQueue = current.updateQueue
	wip.child = current.child
	wip.memoizedProps = current.memoizedProps
	wip.memoizedState = current.memoizedState
	return wip
}

export function createFiberFromELement(element: ReactElementType) {
	const { props, key, type } = element
	//默认为FunctionComponent
	let fiberTag: WorkTag = FunctionComponent
	if (typeof type === 'string') {
		// <div/> type:'div'
		fiberTag = HostComponent
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element)
	}
	const fiber = new FiberNode(fiberTag, props, key)
	fiber.type = type
	return fiber
}
