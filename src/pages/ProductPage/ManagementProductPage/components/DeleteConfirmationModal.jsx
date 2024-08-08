import React from 'react'
import { Modal } from 'antd'

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal title="Confirm Delete" open={open} onCancel={onClose} onOk={onConfirm} okText="Delete" cancelText="Cancel">
      <p>Are you sure you want to delete this product?</p>
    </Modal>
  )
}

export default DeleteConfirmationModal
