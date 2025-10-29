import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

const FormField = ({
  name,
  control,
  label,
  type = "text",
  options = [],
  startIcon,
  endIcon,
  endAdornment,
  onEndIconClick,
  disable = false,
  className = "",
  sx = {},
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        if (type === "select") {
          return (
            <FormControl
              fullWidth
              error={!!fieldState.error}
              className={className}
              sx={sx}
              disabled={disable}
            >
              <InputLabel>{label}</InputLabel>
              <Select
                {...field}
                label={label}
                {...props}
                disabled={disable}
                startAdornment={
                  startIcon ? (
                    <InputAdornment
                      position="start"
                      sx={{ pointerEvents: "none" }}
                    >
                      {startIcon}
                    </InputAdornment>
                  ) : undefined
                }
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          );
        }

        return (
          <TextField
            {...field}
            fullWidth
            label={label}
            type={type}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            variant="outlined"
            className={className}
            sx={sx}
            disabled={disable}
            slotProps={{
              input: {
                startAdornment: startIcon ? (
                  <InputAdornment
                    position="start"
                    sx={{ pointerEvents: "none" }}
                  >
                    {startIcon}
                  </InputAdornment>
                ) : undefined,
                endAdornment: endAdornment ? (
                  endAdornment // Ưu tiên endAdornment nếu truyền từ ngoài vào
                ) : endIcon ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onEndIconClick}
                      edge="end"
                      tabIndex={-1}
                      disabled={disable}
                    >
                      {endIcon}
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            {...props}
          />
        );
      }}
    />
  );
};
export default FormField;
