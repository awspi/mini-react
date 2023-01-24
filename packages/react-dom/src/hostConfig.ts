/**
 * HostConfig 宿主环境(浏览器)实现的方法
 */

//宿主挂载的节点
export type Container = Element
//实例类型
export type Instance = Element

export const createInstance = (type: string, props: any): Instance => {
	const element = document.createElement(type)
	//TODO 处理props
	return element
}
export const appendInitialChid = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child)
}
export const createTextInstance = (content: string) => {
	return document.createTextNode(content)
}
export const appendChildToContainer = appendInitialChid
