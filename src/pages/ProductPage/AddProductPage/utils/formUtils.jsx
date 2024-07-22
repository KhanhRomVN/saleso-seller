import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'

export const renderInput = (label, name, value, onChange, multiline = false, rows = 1) => (
  <Box>
    <Typography variant="subtitle1">{label}</Typography>
    <InputBase
      fullWidth
      name={name}
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={rows}
      sx={{
        padding: '4px 10px',
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
        borderRadius: '10px',
      }}
    />
  </Box>
)
