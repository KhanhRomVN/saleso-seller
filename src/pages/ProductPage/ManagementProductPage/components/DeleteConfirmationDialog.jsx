import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
          color: 'white',
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{ color: 'white' }}>
          Are you sure you want to delete this product?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: 'white' }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} autoFocus style={{ color: 'white' }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
