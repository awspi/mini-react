//ReactElement
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import {
	ElementType,
	Key,
	Props,
	ReactElementType,
	Ref,
	Type
} from 'shared/ReactTypes'
/**
 * ReactElement构造函数
 * @param type
 * @param key
 * @param ref
 * @param props
 * @returns
 */
const ReactElement = function (type: Type, key: Key, ref: Ref, props: Props) {
	//key, ref, props 对应着组件
	const element: ReactElementType = {
		//element的类型是react.element
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'mini'
	}
	return element
}
/**
 * 生产环境jsx
 * @param type 类型
 * @param config 包含的props
 * @param maybeChildren
 * @returns
 */
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	// 单独处理key props ref
	let key: Key = null //默认是null
	const props: Props = {}
	let ref: Ref = null
	//? 处理config
	for (const prop in config) {
		const val = config[prop]
		//key
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val //转为字符串
			}
			continue
		}
		//ref
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val
			}
			continue
		}
		//* 对于其他的prop 判断是否是config的prop而不是原型上的prop
		//如果是原型上的就不赋值
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}
	//? maybeChildren
	// 可能是一个child 就是ReactElement 也可能是多个 就是一个数组
	// 如果是一个 就直接赋值元素 如果是多个 赋值为数组本身
	const maybeChildrenLength = maybeChildren.length
	if (maybeChildrenLength) {
		// [child]
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0]
		} else {
			props.children = maybeChildren
		}
		//[]
	}
	return ReactElement(type, key, ref, props)
}

/**
 * 开发环境直接jsxDEV
 */
// export const jsxDEV = jsx
export const jsxDEV = (type: ElementType, config: any) => {
	// 单独处理key props ref
	let key: Key = null //默认是null
	const props: Props = {}
	let ref: Ref = null
	//? 处理config
	for (const prop in config) {
		const val = config[prop]
		//key
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val //转为字符串
			}
			continue
		}
		//ref
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val
			}
			continue
		}
		//* 对于其他的prop 判断是否是config的prop而不是原型上的prop
		//如果是原型上的就不赋值
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}
	return ReactElement(type, key, ref, props)
}
