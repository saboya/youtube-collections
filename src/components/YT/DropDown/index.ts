import { DropDown } from './DropDown'
import { Item } from './Item'

type DropDownComponentType = typeof DropDown & {
  Item: typeof Item
}

const DropDownComponent = DropDown as DropDownComponentType

DropDownComponent.Item = Item

export default DropDownComponent
