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
export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update
}

//
/**
 * updateQueue消费update
 * @param baseState 基础的状态
 * @param pendingUpdate pendingUpdate
 * @returns 最终的状态 memorizedState
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	}
	if (pendingUpdate !== null) {
		// baseState 1 update 2 ->memorizedState 2
		// baseState 1 update (x)=>4x ->memorizedState 4
		const action = pendingUpdate.action
		if (action instanceof Function) {
			result.memorizedState = action(baseState)
		} else {
			result.memorizedState = action
		}
	}
	return result
}
