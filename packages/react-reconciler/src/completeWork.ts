// DFS中的 归

import {
	appendInitialChid,
	Container,
	createInstance,
	createTextInstance
} from 'hostConfig'
import { FiberNode } from './fiber'
import { NoFlags } from './fiberFlags'
import { HostComponent, HostRoot, HostText } from './workTags'

//* ReactElement与对应的fiberNode比较 返回子fiberNode
export const completeWork = (wip: FiberNode) => {
	// 1.比较	2.返回

	const newProps = wip.pendingProps
	const current = wip.alternate

	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				//update
			} else {
				// 首屏渲染
				// 1.构建DOM
				const instance = createInstance(wip.type, newProps)
				// 2.将Dom插入到DOM树
				appendAllChildren(instance, wip)
				wip.stateNode = instance
			}
			bubbleProperties(wip)
			return null
		case HostText:
			// 首屏渲染
			// 1.构建DOM
			const instance = createTextInstance(newProps.content)
			wip.stateNode = instance
			bubbleProperties(wip)
			return null
		case HostRoot:
			bubbleProperties(wip)
			return null
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork的tag', wip)
			}
			break
	}
}

function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child
	while (node !== null) {
		if (node?.tag === HostComponent || node?.tag === HostText) {
			// 如果找到了
			appendInitialChid(parent, node.stateNode)
		} else if (node.child !== null) {
			node.child.return = node
			node = node.child
			continue
		}
		if (node === wip) {
			return
		}
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				//回到原点
				return
			}
			node = node?.return
		}
		node.sibling.return = node.return
		node = node.sibling
	}
}

function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags
	let child = wip.child
	if (child !== null) {
		subtreeFlags |= child.subtreeFlags
		subtreeFlags |= child.flags

		child.return = wip
		child = child.sibling
	}
	wip.subtreeFlags |= subtreeFlags
}
