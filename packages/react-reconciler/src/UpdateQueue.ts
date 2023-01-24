import { Dispatch } from 'react/src/currentDispatcher'
import { Action } from 'shared/ReactTypes'
/**
 * Update的数据结构
 */
export interface Update<State> {
	// setState接收一个值或者函数
	action: Action<State>
}
/**
 * 保存 update的数据结构
 */
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null
	}
	//兼容hooks 用于保存hook的dispatch
	dispatch: Dispatch<State> | null
}

// 创建update实例的方法
export const createUpdate = <State>(action: Action<State>) => {
	return {
		action
	}
}

// 创建updateQueue实例的方法
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>
}

// 往updateQueue加入update
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update
}

//
/**
 * updateQueue消费update
 * @param baseState 基础的状态
 * @param pendingUpdate pendingUpdate
 * @returns 最终的状态 memoizedState
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	}
	if (pendingUpdate !== null) {
		// baseState 1 update 2 ->memoizedState 2
		// baseState 1 update (x)=>4x ->memoizedState 4
		const action = pendingUpdate.action
		if (action instanceof Function) {
			result.memoizedState = action(baseState)
		} else {
			result.memoizedState = action
		}
	}
	return result
}
