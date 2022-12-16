export type Type = any
export type Key = any
export type Ref = any
export type Props = any
export type ElementType = any

export interface ReactElementType {
	$$typeof: symbol | number
	key: Key
	type: ElementType
	props: Props
	ref: Ref
	__mark: string
}

// setState两种触发更新的方式
export type Action<State> = State | ((prevState: State) => State)
