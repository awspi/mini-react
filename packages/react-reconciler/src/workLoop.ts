import { beginWork } from './beginWork'
import { commitMutationEffects } from './commitWork'
import { completeWork } from './completeWork'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { MutationMask, NoFlags } from './fiberFlags'
import { HostRoot } from './workTags'

// 全局的指针,指向当前工作的fiberNode
let workInProgress: FiberNode | null = null

//? 让workInProgress指向当前遍历的第一个节点
function prepareFreshStack(root: FiberRootNode) {
	// 为 hostRootFiber 创建wip
	workInProgress = createWorkInProgress(root.current, {})
}
// 在fiber中调度update 链接Container和renderRoot
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	//TODO 调度功能
	const root = markUpdateFromFiberToRoot(fiber)
	renderRoot(root)
}

//从当前fiberNode找到到根节点
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber
	let parent = node.return
	// 如果return 不为null 说明不是hostRootFiber(只有stateNode 没有return)
	while (parent !== null) {
		node = parent
		parent = node.return
	}
	// 跳出了循环 说明到了	hostRootFiber
	if (node.tag === HostRoot) {
		return node.stateNode
	}
	return null
}

function renderRoot(root: FiberRootNode) {
	//初始化
	prepareFreshStack(root)
	//递归的流程
	do {
		try {
			workLoop()
			break
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误')
			}
			workInProgress = null
		}
	} while (true)

	const finishedWork = root.current.alternate
	root.finishedWork = finishedWork
	// wip fiberNode树 树中的flags
	//todo
	commitRoot(root)
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork

	if (finishedWork === null) {
		return
	}

	if (__DEV__) {
		console.warn('commit阶段 开始', finishedWork)
	}

	//重置
	root.finishedWork = null
	//判断是否存在三个子阶段(beforeMutation、mutation、layout)需要去执行的操作
	//root flags / root subtreeFlags 是否包含MutationMask的flag
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags
	if (subtreeHasEffect || rootHasEffect) {
		//beforeMutation
		//mutation
		commitMutationEffects(finishedWork)
		root.current = finishedWork
		//layout
	} else {
		root.current = finishedWork
	}
}

function workLoop() {
	//只要workInProgress!==null就一直执行
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress)
	}
}

function performUnitOfWork(fiber: FiberNode) {
	//? 有子节点，遍历子节点 -> 执行beginWork
	const next = beginWork(fiber)
	fiber.memoizedProps = fiber.pendingProps
	// next可能是 子fiber or null
	if (next === null) {
		// 递归到最深了
		//? 如果没有子节点，遍历兄弟节点 开始归->completeUnitOfWork
		completeUnitOfWork(fiber)
	} else {
		//继续向下遍历
		workInProgress = next
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber
	do {
		completeWork(node) //DFS中的 归

		const sibling = node.sibling
		// 如果存在兄弟节点 就再遍历兄弟节点
		if (sibling !== null) {
			workInProgress = sibling
			return
		}
		//如果不存在兄弟节点 就往上继续 归
		//* node指到父级节点
		node = node.return
		workInProgress = null
	} while (node !== null)
}
