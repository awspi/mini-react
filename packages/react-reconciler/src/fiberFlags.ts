export type Flags = number
//没有标记
export const NoFlags = 0b0000000
//插入
export const Placement = 0b0000001
//更新属性
export const Update = 0b0000010
//删除子节点
export const ChildDeletion = 0b0000100
//Mutation阶段 需要执行的操作
export const MutationMask = Placement | Update | ChildDeletion
