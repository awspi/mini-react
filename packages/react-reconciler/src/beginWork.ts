// DFS中的 递

import { ReactElementType } from 'shared/ReactTypes'
import { mountChildFibers, reconcileChildFibers } from './childFibers'
import { FiberNode } from './fiber'
import { renderWithHooks } from './fiberHooks'
import { processUpdateQueue, UpdateQueue } from './updateQueue'
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags'

//* ReactElement与对应的fiberNode比较 返回子fiberNode
export const beginWork = (wip: FiberNode) => {
	// 1.比较
	// 2.返回fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip)
		case HostComponent:
			return updateHostComponent(wip)
		case HostText:
			// 递 到叶子结点HostText
			return null
		case FunctionComponent:
			return updateFunctionComponent(wip)
		default:
			if (__DEV__) {
				console.warn('beginWork尚未实现的类型', wip.tag)
			}
			break
	}
	return null
}

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip)
	reconcileChildren(wip, nextChildren)
	return wip.child
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState
	const updateQueue = wip.updateQueue as UpdateQueue<Element>
	const pending = updateQueue.shared.pending
	updateQueue.shared.pending = null
	const { memoizedState } = processUpdateQueue(baseState, pending)
	wip.memoizedState = memoizedState

	const nextChildren = wip.memoizedState
	reconcileChildren(wip, nextChildren)
	//  返回子fiberNode
	return wip.child
}

function updateHostComponent(wip: FiberNode) {
	//不能触发更新 只创建子fiberNode
	// <div><span/></div> -> div.child
	const nextProps = wip.pendingProps
	const nextChildren = nextProps.children
	reconcileChildren(wip, nextChildren)
	return wip.child
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate
	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children)
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children)
	}
}
