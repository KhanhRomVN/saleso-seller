import React from 'react'
import { Dropdown, Menu } from 'antd'

const ProductActionDropdown = ({ visible, onVisibleChange, onItemClick }) => {
  const menu = (
    <Menu>
      <Menu.Item key="feedback" onClick={() => onItemClick('feedback')}>
        Feedback
      </Menu.Item>
      <Menu.Item key="customer" onClick={() => onItemClick('customer')}>
        Customer
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => onItemClick('edit')}>
        Edit
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} visible={visible} onVisibleChange={onVisibleChange} trigger={['click']}>
      <span></span>
    </Dropdown>
  )
}

export default ProductActionDropdown
