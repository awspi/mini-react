import { Dispatch, Dispatcher } from 'react/src/currentDispatcher'
import internals from 'shared/internals'
import { Action } from 'shared/ReactTypes'
import { FiberNode } from './fiber'
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'

// 当前正在render的fiberNode
let currentlyRenderingFiber: FiberNode | null = null
// 当前正在处理的Hook的指针
let workInProgressHook: Hook | null = null

const { currentDispatcher } = internals

//每个FC fiberNode的memoizedState字段 指向保存hook的链表
//每个hook也有memoizedState字段 指向这个hook自身的数据

// Hook的数据结构
interface Hook {
	//自身状态
	memoizedState: any
	//触发更新
	updateQueue: unknown
	//下一个hook
	next: Hook | null
}

//函数式组件 通过执行来获取children
export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip
	//重置
	wip.memoizedState = null

	const current = wip.alternate

	if (current !== null) {
		//update
	} else {
		// mount
		currentDispatcher.current = HooksDispatherOnMount
	}
	const Component = wip.type
	const props = wip.pendingProps
	//* 函数式组件,通过执行来获取children
	const children = Component(props)

	//重置操作
	currentlyRenderingFiber = null

	return children
}

const HooksDispatherOnMount: Dispatcher = {
	useState: mountState
}

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	//找到当前useState对应的hook数据
	const hook = mountWorkInProgressHook()

	let memoizedState = undefined
	if (initialState instanceof Function) {
		memoizedState = initialState()
	} else {
		memoizedState = initialState
	}

	const queue = createUpdateQueue<State>()
	hook.updateQueue = queue
	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue)
	//currentlyRenderingFiber、queue已经预置到dispatch
	// 开发者直接传action即可
	queue.dispatch = dispatch
	return [memoizedState, dispatch]
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	//与首屏渲染流程类似
	// 1.创建update
	const update = createUpdate(action)
	// 2.enqueueUpdate
	enqueueUpdate(updateQueue, update)
	// 2.scheduleUpdateOnFiber
	scheduleUpdateOnFiber(fiber)
}

function mountWorkInProgressHook(): Hook {
	//mount时 先创建hook
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	}
	if (workInProgressHook === null) {
		// mount时 且是第一个hook
		if (currentlyRenderingFiber === null) {
			// 函数式组件一定会有currentlyRenderingFiber 如果没有 就是不在函数式组件中使用
			throw new Error('请在函数组件内使用Hook')
		} else {
			//mount时的第一个hook
			workInProgressHook = hook
			currentlyRenderingFiber.memoizedState = workInProgressHook
		}
	} else {
		// mount时 后续的hook
		workInProgressHook.next = hook
		//指向自己(下一个)
		workInProgressHook = hook
	}
	return workInProgressHook
}
