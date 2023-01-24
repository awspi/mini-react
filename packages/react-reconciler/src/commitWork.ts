import { appendChildToContainer, Container } from 'hostConfig'
import { FiberNode, FiberRootNode } from './fiber'
import { MutationMask, NoFlags, Placement } from './fiberFlags'
import { HostComponent, HostRoot, HostText } from './workTags'

let nextEffect: FiberNode | null = null

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork

	while (nextEffect !== null) {
		//向下遍历
		const child: FiberNode | null = nextEffect.child
		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			// 子节点存在Mutation需要执行的操作
			nextEffect = child
		} else {
			// 向上遍历DFS
			up: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect)
				const sibling: FiberNode | null = nextEffect.sibling
				if (sibling !== null) {
					// 同级
					nextEffect = sibling
					break up
				}
				// 向上
				nextEffect = nextEffect.return
			}
		}
	}
}

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	//finishedWork 是确定了存在flags的节点
	const flags = finishedWork.flags
	//flags Placement
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork)
		//从flags中移除
		finishedWork.flags &= ~Placement
	}
	//TODO flags Update
	//TODO flags ChildDeletion
}

const commitPlacement = (finishedWork: FiberNode) => {
	//需要知道:
	//parent DOM 要插入到谁?
	//finishedWork ~~DOM //fiber找到对应的DOM节点
	if (__DEV__) {
		console.warn('执行Placement操作')
	}
	// parent DOM
	const hostParent = getHostParent(finishedWork)
	// finishedWork ~~DOM
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent)
	}
}

function getHostParent(fiber: FiberNode): Container | null {
	//向上遍历
	let parent = fiber.return
	while (parent) {
		const parentTag = parent.tag
		//hostComponent / hostRoot
		if (parentTag === HostComponent) {
			// HostComponent的fiberNode对应的宿主环境节点就是保存在stateNode
			return parent.stateNode as Container
		}
		if (parentTag === HostRoot) {
			// HostRoot的fiberNode对应的宿主环境节点保存在 stateNode.containter
			return (parent.stateNode as FiberRootNode).container
		}
		parent = parent.return
	}
	if (__DEV__) {
		console.warn('未找到hostParent')
	}
	return null
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// DFS 出口
	//fiber-->找到host类型的fiber 然后插入到host parent
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode)
		return
	}
	// 向下遍历
	const child = finishedWork.child
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent)
		let sibling = child.sibling

		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent)
			sibling = sibling.sibling
		}
	}
}
